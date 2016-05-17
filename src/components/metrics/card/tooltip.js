// TODO(matthew): Clean Imports. Remove:
//   - React
//   - Component (once functional)
//   - PropTypes
//   - ReactMarkdown
import React, {Component, PropTypes} from 'react'
import ToolTip from 'gComponents/utility/tooltip/index.js'
import {MarkdownViewer} from 'gComponents/utility/markdown-viewer/index.js'
import ReactMarkdown from 'react-markdown'

// TODO(matthew): Narrow props (just needs description).
// TODO(matthew): Make functional
export default class MetricToolTip extends Component {
  render() {
    const {guesstimate} = this.props
    if (_.isEmpty(guesstimate.description)){
      return (false)
    }
    return (
      <ToolTip>
        <MarkdownViewer source={guesstimate.description}/>
      </ToolTip>
    )
  }
}
