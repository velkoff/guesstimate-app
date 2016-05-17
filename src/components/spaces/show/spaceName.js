// TODO(matthew): Delete 'React' & 'PropTypes' imports.
import React, {Component, PropTypes} from 'react'

import DropDown from 'gComponents/utility/drop-down/index.js'
// TODO(matthew): Delete these imports (unused)
import {DropDownListElement} from 'gComponents/utility/drop-down/index.js'
import Icon from 'react-fa'
import CanvasViewForm from './canvasViewForm.js'
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'

// TODO(matthew): Make functional.
// TODO(matthew): Why does this exist? Seems no different from other items in showHeader.
// TODO(matthew): Do all components need proptypes? Seems wise for all class components.
export class SpaceName extends Component {
  onSave() {
    // TODO(matthew): I bet we can do better than this.
    this.refs.DropDown._close()
    const name = this.refs.name.value
    this.props.onSave(name)
  }

  render () {
    let {editableByMe, name} = this.props
    const hasName = !_.isEmpty(name)
    // TODO(matthew): put className in h1 directly below. If is unnecessary in this context.
    const className = `text-editable ${hasName ? '' : 'default-value'}`
    // TODO(matthew): showName -> shownName
    const showName = hasName ? name : 'Untitled Model'
    // TODO(matthew): Standardize on 2 vs four indents for <div\n ... \n>
    return(
      <span>
        {editableByMe &&
          <DropDown
            headerText={'Rename Model'}
            openLink={<h1 className={className}> {showName} </h1>}
            position='right'
            hasPadding={true}
            width='wide'
            ref='DropDown'
          >
          <div className='ui form'>
            <h2> Name </h2>
            <textarea
              defaultValue={name}
              type='text'
              rows='2'
              ref='name'
            />
            <div className='ui button primary large' onClick={this.onSave.bind(this)}>
                Rename
            </div>
          </div>
          </DropDown>
        }
        {!editableByMe &&
          <h1> {name} </h1>
        }
      </span>
    )
  }
}

