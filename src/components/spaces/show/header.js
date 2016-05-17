// TODO(matthew): Delete 'React' import
import React, {Component} from 'react'
// TODO(matthew): Delete below imports (appear unused).
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'
import e from 'gEngine/engine'

// Used: (TODO(matthew): Delete this comment and reformat.
import CanvasViewForm from './canvasViewForm.js'
import Icon from 'react-fa'
import {SpaceName} from './spaceName.js'
// TODO(matthew): Investigate these components when you get a chance.
import DropDown from 'gComponents/utility/drop-down/index.js'
import {DropDownListElement} from 'gComponents/utility/drop-down/index.js'
import {PrivacyToggle} from './privacy-toggle/index.js'
import './header.css'

// TODO(matthew): Clean up below with function switch case.
// TODO(matthew): Probably don't need parens ({actionState}) -> {actionState}
const ProgressMessage = ({actionState}) => (
  <div className='saveMessage'>
    {actionState == 'SAVING' && 'Saving...'}
    {actionState == 'COPYING' && 'Copying...'}
    {actionState == 'CREATING' && 'Creating a new model...'}
    {actionState == 'ERROR' &&
      <div className='ui red horizontal label'>
        ERROR SAVING
      </div>
    }
    {actionState == 'ERROR_COPYING' &&
      <div className='ui red horizontal label'>
        ERROR COPYING
      </div>
    }
    {actionState == 'ERROR_CREATING' &&
      <div className='ui red horizontal label'>
        ERROR CREATING NEW MODEL
      </div>
    }
    {actionState == 'SAVED' && 'All changes saved'}
    {actionState == 'COPIED' && 'Successfully copied'}
    {actionState == 'CREATED' && 'New model created'}
  </div>
)

// TODO(matthew): Multi-line below. Probably don't need parens.
// TODO(matthew): Nothing in here should check if space exists. Clarify component API.
// TODO(matthew): Narrow props for fewer updates. Just space name, description, editableByMe, is_private, actionState)
// TODO(matthew): ShouldComponentUpdate needed after above? How often will re-try-to-render?
const SpaceHeader = ({canBePrivate, space, isLoggedIn, onSave, onCopy, onDestroy, onPublicSelect, onPrivateSelect, onSaveName}) => {
  // TODO(matthew): one line below, use const?
  let privacy_header = (<span><Icon name='globe'/> Public</span>)
  if (space.is_private) {
    privacy_header = (<span><Icon name='lock'/> Private</span>)
  }

  // TODO(matthew): Model actions subcomponent.
  return (
    <div className='header'>

      <div className='header-name'>
        <SpaceName
            name={space.name}
            editableByMe={space.editableByMe}
            onSave={onSaveName}
        />
      </div>

      <div className='header-actions'>
        <CanvasViewForm/>

        {space.editableByMe &&
          <DropDown
            headerText={'Model Actions'}
            openLink={<a className='space-header-action'>Model Actions</a>}
            position='right'
          >
            <ul>
              <DropDownListElement icon={'warning'} header='Delete Model' onMouseDown={onDestroy}/>
            </ul>
          </DropDown>
        }

        {space.editableByMe &&
          <PrivacyToggle
            headerText={'Privacy Options'}
            openLink={<a className='space-header-action'>{privacy_header}</a>}
            position='right'
            isPrivateSelectionInvalid={!canBePrivate}
            isPrivate={space.is_private}
            onPublicSelect={onPublicSelect}
            onPrivateSelect={onPrivateSelect}
          />
        }
        { space && isLoggedIn &&
          <div onMouseDown={onCopy} className='copy-button'>
            <a className='space-header-action'><Icon name='copy'/> Copy</a>
          </div>
        }
        <ProgressMessage actionState={space.canvasState.actionState}/>
      </div>
    </div>
  )
}

// TODO(matthew): Standardize on exports below or with class/const def. No export default.
export default SpaceHeader
