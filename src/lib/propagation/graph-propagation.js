/* @flow */

import _ from 'lodash';
import async from 'async'

import e from 'gEngine/engine';
import type {Simulation, Graph} from '../lib/engine/types.js'
import {invalidateSimulations} from 'gModules/simulations/actions'
import MetricPropagation from './metric-propagation.js'

function isRecentPropagation(propagationId: number, simulation: Simulation) {
  return !_.has(simulation, 'propagation') || (propagationId >= simulation.propagation)
}

//TODO: Stop tree where there is an error
export class GraphPropagation {
  dispatch: Function;
  getState: Function;
  graphFilters: object;
  id: number;
  currentStep: number;
  steps: Array<any>;
  // metricId, samples

  constructor(dispatch: Function, getState: Function, graphFilters: object) {
    this.graphFilters = graphFilters
    this.dispatch = dispatch
    this.getState = getState
    this.id = Date.now()

    this.spaceId = graphFilters.spaceId

    if (this.spaceId === undefined && graphFilters.metricId) {
      const metric = e.metric.get(getState().metrics, graphFilters.metricId)
      this.spaceId = metric && metric.space
    }

    this.useGuesstimateForm = graphFilters.useGuesstimateForm || false

    this.orderedMetricIds = this._orderedMetricIds(graphFilters)
    this.orderedMetricPropagations = this.orderedMetricIds.map(id => (new MetricPropagation(id, this.id)))

    this.currentStep = 0

    const remainingPropagationSteps = this.orderedMetricPropagations.map(p => p.remainingSimulations.length)
    this.totalSteps = _.sum(remainingPropagationSteps)
  }

  run(): void {
    this._reset()
    this._propogate()
  }

  _reset(): void {
    if (this.graphFilters.onlyHead){
      let metrics = e.graph.dependencyTree(this._graph(), {...this.graphFilters, onlyHead: false}).map(e => e[0])
      this.dispatch(invalidateSimulations(metrics))
    }
  }

  _propogate(): void {
    if (this.currentStep >= this.totalSteps) {
      return
    }
    this._step().then(() => {this._propogate()});
  }

  _step() {
    const i = (this.currentStep % this.orderedMetricIds.length)
    return this._simulateMetric(this.orderedMetricPropagations[i]).then(() => {this.currentStep++})
  }

  _simulateMetric(metricPropagation) {
    return metricPropagation.step(this._graph(), this.dispatch)
  }

  _graph(): Graph {
    const state = this.getState()
    let subset = e.space.subset(e.graph.create(state), this.spaceId)

    if (this.useGuesstimateForm) {
      subset = e.graph.toBizarroGraph(subset, state.guesstimateForm);
    }

    return subset
  }

  _orderedMetricIds(graphFilters: object): Array<Object> {
    this.dependencies = e.graph.dependencyTree(this._graph(), graphFilters)
    const inOrder = _.sortBy(this.dependencies, function(n){return n[1]}).map(e => e[0])
    return inOrder
  }
}
