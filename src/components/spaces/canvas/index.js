'use strict';

import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';

import FlowGrid from 'gComponents/lib/FlowGrid/FlowGrid.jsx'
import Metric from 'gComponents/metrics/card'

import { removeMetric, changeMetric, addMetric } from 'gModules/metrics/actions'
// TODO(matthew): Clarify 
import { changeSelect, deSelect } from 'gModules/selected_cell/actions'
import { selectRegion, deSelectRegion } from 'gModules/selected_region/actions'
import { runSimulations, deleteSimulations } from 'gModules/simulations/actions'

import { hasMetricUpdated } from 'gComponents/metrics/card/updated.js'

// TODO(matthew): css imports at end?
import './style.css'
import { denormalizedSpaceSelector } from '../denormalized-space-selector.js';
import JSONTree from 'react-json-tree'
import * as canvasStateActions from 'gModules/canvas_state/actions.js'
import * as canvasStateProps from 'gModules/canvas_state/prop_type.js'

import { copy, paste } from 'gModules/copied/actions.js'

function mapStateToProps(state) {
  return {
    canvasState: state.canvasState,
    selectedCell: state.selectedCell,
    selectedRegion: state.selectedRegion,
  }
}

// TODO(matthew): Canvas just needs graph, not whole space.
const PT = PropTypes;
@connect(mapStateToProps)
@connect(denormalizedSpaceSelector)
export default class Canvas extends Component{
  static propTypes = {
    // TODO(matthew): Move canvasState PT Shape into canvasStateProps lib.
    canvasState: PT.shape({
      edgeView: canvasStateProps.edgeView,
      metricCardView: canvasStateProps.metricCardView,
      metricClickMode: canvasStateProps.metricClickMode
    }),
    denormalizedSpace: PropTypes.object,
    dispatch: PropTypes.func,
    // TODO(matthew): Not used (guesstimateForm).
    guesstimateForm: PropTypes.object,
    selectedCell: PropTypes.object,
    // TODO(matthew): Not used (embed).
    embed: PropTypes.bool,
    // TODO(matthew): Noooooo. This is not what oneOfType is for. We should just pick one (number, as that is what
    // spaces is above.
    spaceId: PropTypes.oneOfType([
      // TODO(matthew): What's going on here with the React.PropTypes vs PropTypes above?
        React.PropTypes.string,
        React.PropTypes.number,
    ])
  }

  static defaultProps = {
    // TODO(matthew): What? screenshot v. embed?
    screenshot: false
  }

  componentDidMount(){
    const metrics = _.get(this.props.denormalizedSpace, 'metrics')
    if (!_.isEmpty(metrics) && metrics.length > 19){
      // TODO(matthew): I don't want this to dispatch. This should just be a local state change.
      this.props.dispatch(canvasStateActions.change({edgeView: 'hidden'}))
    } else {
      this.props.dispatch(canvasStateActions.change({edgeView: 'visible'}))
    }
    // TODO(matthew): Only do this if necessary? Store simulations on client as long as possible.
    this.props.dispatch(runSimulations({spaceId: this.props.denormalizedSpace.id}))

    if (this.props.screenshot) {
      this.props.dispatch(canvasStateActions.change({metricCardView: 'display'}))
    }
  }

  // TODO(matthew): This seems weird... Can we do this a different way. Make the Add Metric method run a simulation
  // instead? Is this even still needed?
  componentDidUpdate(prevProps) {
    const metrics = _.get(this.props.denormalizedSpace, 'metrics')
    const oldMetrics = _.get(prevProps.denormalizedSpace, 'metrics')
    if ((oldMetrics.length === 0) && (metrics.length > 0)){
      this.props.dispatch(runSimulations({spaceId: this.props.denormalizedSpace.id}))
    }
  }

  // TODO(matthew): What happens if we take this away? Do the clients run out of mem?
  componentWillUnmount(){
    this.props.dispatch(deleteSimulations(this.props.denormalizedSpace.metrics.map(m => m.id)))
  }

  // TODO(matthew): Clarify API relation here. Shouldn't need to do both.
  _handleSelect(location) {
    this.props.dispatch(changeSelect(location))
    this.props.dispatch(selectRegion(location, location))
  }

  _handleMultipleSelect(corner1, corner2) {
    this.props.dispatch(selectRegion(corner1, corner2))
  }

  _handleDeSelectAll() {
    this.props.dispatch(deSelect())
    this.props.dispatch(deSelectRegion())
  }

  _handleCopy() {
    this.props.dispatch(copy(this.props.denormalizedSpace.id))
  }

  _handlePaste() {
    this.props.dispatch(paste(this.props.denormalizedSpace.id))
  }

  // TODO(matthew): Why isNew?
  _handleAddMetric(location) {
    this.props.dispatch(addMetric({space: this.props.spaceId, location: location, isNew: true}))
  }

  // TODO(matthew): Refine with location Utils.
  _handleMoveMetric({prev, next}) {
    // TODO(matthew): Use _.some
    const destinationMetric = this.props.denormalizedSpace.metrics.find(f => f.location.row === next.row && f.location.column === next.column)
    if (!!destinationMetric) {
      return
    }
    const metric = this.props.denormalizedSpace.metrics.find(f => f.location.row === prev.row && f.location.column === prev.column)
    this.props.dispatch(changeMetric({id: metric.id, location: next}))
    // TODO(matthew): Check select v multiple select API.
    this.props.dispatch(changeSelect(next))
  }

  _selectedMetric() {
    // TODO(matthew): Refactor later with location libs and more precise defensive coding.
   const {selectedCell} = this.props
   const metrics = _.get(this.props.denormalizedSpace, 'metrics')

   return metrics && _.isFinite(selectedCell.row) && metrics.filter(i => _.isEqual(i.location, selectedCell))[0];
  }

  _isAnalysisView(props = this.props) {
    return (_.get(props, 'canvasState.metricCardView') === 'analysis')
  }

  renderMetric(metric, selected) {
    const {location} = metric
    // TODO(matthew): Rename for clarity. Also maybe rework into method above.
    const hasSelected = selected && metric && (selected.id !== metric.id)
    const selectedSamples = _.get(selected, 'simulation.sample.values')
    // TODO(matthew): Difference between _.isEmpty and ... .length === 0?
    const passSelected = hasSelected && selectedSamples && !_.isEmpty(selectedSamples)
    // TODO(matthew): Why location passed separately?
    // TODO(matthew): Why 'key' prop like this when undergoes translation below? It isn't used...
    return (
      <Metric
          canvasState={this.props.canvasState}
          key={metric.id}
          location={location}
          metric={metric}
          selectedMetric={passSelected && selected}
      />
    )
  }

  showEdges() {
    // TODO(matthew): Maybe make function that takes canvasState?
    return (this.props.canvasState.edgeView === 'visible')
  }

  edges() {
    // TODO(matthew): Seems like this has access to the graph, and we make the effort of destroying it before passing it
    // down... Seems like we could use this to do ancestors / descendants if we wanted.
    // TODO(matthew): Refactor to do empty conditional first, then rest unindented.
    let edges = []

    if (this.showEdges()){
      const space = this.props.denormalizedSpace
      const {metrics} = space
      const findMetric = (metricId) => metrics.find(m => m.id === metricId)
      // TODO(matthew): Delete below line (unused).
      const metricIdToLocation = (metricId) => findMetric(metricId).location

      edges = space.edges.map(e => {
        const [inputMetric, outputMetric] = [findMetric(e.input), findMetric(e.output)]
        let errors = _.get(inputMetric, 'simulation.sample.errors')
        const color = (errors && !!errors.length) ? 'RED' : 'BLUE'
        return {input: inputMetric.location, output: outputMetric.location, color}
      })
    }
    return edges
  }

  render () {
    const {selectedCell, selectedRegion} = this.props
    const {metrics} = this.props.denormalizedSpace
    const {metricCardView} = this.props.canvasState

    const edges = this.edges()
    // TODO(matthew) Maybe use `` for composition and const?
    let className = 'canvas-space'
    const showGridLines = (metricCardView !== 'display')
    // TODO(matthew): Use proper if.
    this.showEdges() ? className += ' showEdges' : ''
    const selectedMetric = this._isAnalysisView() && this._selectedMetric()
    const overflow = this.props.screenshot ? 'hidden' : 'default'

    // TODO(matthew): Delete trailing ;
    return (
      <div className={className}>
        {(metricCardView === 'debugging') &&
          <JSONTree data={this.props}/>
        }
        <FlowGrid
          onMultipleSelect={this._handleMultipleSelect.bind(this)}
          overflow={overflow}
          items={metrics.map(m => ({key: m.id, location: m.location, component: this.renderMetric(m, selectedMetric)}))}
          hasItemUpdated = {(oldItem, newItem) => hasMetricUpdated(oldItem.props, newItem.props)}
          edges={edges}
          selectedRegion={selectedRegion}
          selectedCell={selectedCell}
          onSelectItem={this._handleSelect.bind(this)}
          onDeSelectAll={this._handleDeSelectAll.bind(this)}
          onAddItem={this._handleAddMetric.bind(this)}
          onMoveItem={this._handleMoveMetric.bind(this)}
          onRemoveItem={(id) => {this.props.dispatch(removeMetric(id))}}
          onCopy={this._handleCopy.bind(this)}
          onPaste={this._handlePaste.bind(this)}
          showGridLines={showGridLines}
          canvasState={this.props.canvasState}
        />
      </div>
    );
  }
}
