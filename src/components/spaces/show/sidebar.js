// TODO(matthew): Delete 'React', 'PropTypes' (unused).
import React, {Component, PropTypes} from 'react'
// TODO(matthew): Check these imports at some point.
import ClickToEdit from 'gComponents/utility/click-to-edit/index.js'
import {MarkdownViewer} from 'gComponents/utility/markdown-viewer/index.js'
import {ButtonClose} from 'gComponents/utility/buttons/close'
// TODO(matthew): Delete these imports (unused)
import Icon from 'react-fa'

// TODO(matthew): No export default, no multiple export defaults certainly.
// TODO(matthew): Make functional
// TODO(matthew): This component is totally unneccessary. Delete it.
export default class DescriptionViewer extends Component {
  render() {
    return(
      <MarkdownViewer source={this.props.value}/>
    )
  }
}

// TODO(matthew): Make functional
// TODO(matthew): Narrow space props, just needs description, editableByMe
export default class SpaceSidebar extends Component {
  render() {
    // TODO(matthew): include onClose and others in this.props initializer.
    // TODO(matthew): Could we do an intelligent description initialization based on graph & title?
    const {space} = this.props
    const description = _.get(space, 'description')
    const canEdit = !!_.get(space, 'editableByMe')
    return (
      <div className='SpaceSidebar'>
        <div className='SpaceSidebar-inside'>
          <div className='SpaceSidebar-header'>
            <ButtonClose onClick={this.props.onClose}/>
          </div>
          <div className='SpaceSidebar-body'>
            <ClickToEdit
              viewing={<DescriptionViewer value={description}/>}
              emptyValue={<span className='emptyValue'>Describe this model...</span>}
              editingSaveText={'Save'}
              onSubmit={this.props.onSaveDescription}
              canEdit={canEdit}
              value={description}
            />
          </div>
        </div>
      </div>
    )
  }
}

// TODO(matthew): ... so many things. (well three).
export default SpaceSidebar
