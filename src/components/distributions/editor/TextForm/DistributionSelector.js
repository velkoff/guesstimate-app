import React, {Component, PropTypes} from 'react';

import ReactDOM from 'react-dom'

import {Guesstimator} from 'lib/guesstimator/index.js'
import * as elev from 'server/elev/index.js'

// We use onMouseUp to make sure that the onMouseUp
// does not get called once another metric is underneath

class DistributionIcon extends Component{
  _handleSubmit() {
    this.props.onSubmit(this.props.type)
  }
  render() {
    let classes = 'ui button tinyhover-toggle DistributionIcon'
    classes += this.props.isSelected ? ' selected' : ''
    return (
      <div
            className={classes}
            onClick={this._handleSubmit.bind(this)}
      >
        <img src={this.props.icon}/>
      </div>
    )
  }
}

export default class DistributionSelector extends Component{
  _handleShowMore() {
    elev.open(elev.ADDITIONAL_DISTRIBUTIONS)
  }

  render() {
    const {selected} = this.props
    return (
      <div className='DistributionSelector'>
        <hr/>
        <a
          className='more-distributions'
          onClick={this._handleShowMore.bind(this)}
        >
          {'More'}
        </a>
        <div className='DistributionList'>
          {['NORMAL', 'UNIFORM', 'LOGNORMAL'].map(type => {
            const isSelected = (selected === type)
            const icon = Guesstimator.samplerTypes.find(type).icon
            return (
              <DistributionIcon
                type={type}
                onSubmit={this.props.onSubmit}
                isSelected={isSelected}
                icon={icon}
                key={type}
              />
            )
          })}
        </div>
      </div>
    )
  }
}
