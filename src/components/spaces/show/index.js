// TODO(matthew): delete 'React' import (unused).
import React, {Component, PropTypes} from 'react'
// TODO(matthew): Is this used in the '@connect' below?
import { connect } from 'react-redux';
import './style.css'

// TODO(matthew): Standardize on gComponents/...' or '../' & './'
import Canvas from 'gComponents/spaces/canvas'
import SpacesShowHeader from './header.js'
import * as spaceActions from 'gModules/spaces/actions.js'
// TODO(matthew): sTandardize on space buffer or no.
import { denormalizedSpaceSelector } from '../denormalized-space-selector.js';
import SpaceSidebar from './sidebar.js'
import ClosedSpaceSidebar from './closed_sidebar.js'
// TODO(matthew): Only need 'e.me.' Can we restrict import here?
import e from 'gEngine/engine'
import * as elev from 'server/elev/index.js'

function mapStateToProps(state) {
  return {
    me: state.me
  }
}

// TODO(matthew): Just standardize on either PT or PropTypes everywhere (standardize on PropTypes).
const PT = PropTypes

// TODO(matthew): Consider using action connectors to get rid of 'this.props.dispatch' (instead we'd use
// 'this.props.update' but it would resolve to the same thing.
// TODO(matthew): No Export Default
// TODO(matthew): Decide on selector API so we can limit defensive coding here (e.g. always has metrics)
@connect(mapStateToProps)
@connect(denormalizedSpaceSelector)
export default class SpacesShow extends Component {
  // TODO(matthew): Needs a shouldComponentUpdate
  displayName: 'RepoDetailPage'

  static propTypes = {
    dispatch: PT.func.isRequired,
    spaceId: PT.number,
    denormalizedSpace: PT.object,
    // TODO(matthew): embed should probably just be a separate component.
    embed: PT.bool
  }

  state = {
    showSidebar: true,
    attemptedFetch: false,
  }

  componentWillMount() {
    this.considerFetch(this.props)
    if (!this.props.embed) { elev.show() }
  }

  componentWillUnmount() {
    if (!this.props.embed) { elev.hide() }
  }

  componentDidUpdate(newProps) {
    // TODO(shouldn't be necessary. Should only be necessary once, upon Mount.
    this.considerFetch(newProps)
  }

  // TODO(matthew) newProps => {denormalizedSpace}
  considerFetch(newProps) {
    // TODO(check if necessary)
    const space = newProps.denormalizedSpace
    const needsData = !_.has(space, 'graph')

    if (needsData) {
      this.fetchData()
    }
  }

  fetchData() {
    if (!this.state.attemptedFetch) {
      this.props.dispatch(spaceActions.fetchById(parseInt(this.props.spaceId)))
      // TODO(matthew): Probably don't need bit of state if really only calls once.
      this.setState({attemptedFetch: true})
    }
  }

  // TODO(matthew): Standardize on v. handle
  // TODO(matthew): should one-liners really be methods of class? Or just expanded in passed props below?
  // TODO(matthew): Does this not save the graph? In which case we should rename this to be reflective.
  // TODO(matthew): Is there an integral proptype? If so, require that above and eliminate this here.
  onSave() {
    this.props.dispatch(spaceActions.update(parseInt(this.props.spaceId)))
  }
  destroy() {
    // TODO(matthew): Standardize action interface (e.g. take id or take object?)
    this.props.dispatch(spaceActions.destroy(this.props.denormalizedSpace))
  }

  onPublicSelect() {
    this.props.dispatch(spaceActions.generalUpdate(parseInt(this.props.spaceId), {is_private: false}))
  }
  onPrivateSelect() {
    this.props.dispatch(spaceActions.generalUpdate(parseInt(this.props.spaceId), {is_private: true}))
  }

  onSaveName(name) {
    this.props.dispatch(spaceActions.update(parseInt(this.props.spaceId), {name}))
  }
  onSaveDescription(description) {
    this.props.dispatch(spaceActions.update(parseInt(this.props.spaceId), {description}))
  }

  hideSidebar() {
    this.setState({showSidebar: false})
  }
  openSidebar() {
    this.setState({showSidebar: true})
  }

  _handleCopy() {
    this.props.dispatch(spaceActions.copy(parseInt(this.props.spaceId)))
  }

  render() {
    // TODO(matthew): denormalizedSpace -> space.
    const space = this.props.denormalizedSpace;
    if (!space) { return <div className='spaceShow'></div> }

    // TODO(matthew): rename; seems ambiguous with state.showSidebar
    // TODO(matthew): rename state.showSidebar; isn't what it means. Means sidebarExpanded.
    const sidebarIsViseable = space.editableByMe || !_.isEmpty(space.description)
    // TODO(matthew): Clean up relationship between organizational perms and individual perms.
    const canBePrivate = !!space.organization_id || e.me.canMakeMorePrivateModels(this.props.me)
    const isLoggedIn = e.me.isLoggedIn(this.props.me)
    if (this.props.embed) {
      return (
        <div className='spaceShow screenshot'>
          <Canvas spaceId={space.id} overflow={'hidden'} screenshot={true}/>
        </div>
      )
    }

    // TODO(space.editableByMe and space.createdByMe are different, not respected in showing of user badge for example.
    // TODO(props should be defined in terms of child component, not parent? e.g 
    // TODO(space sidebar controls open close state maybe? 
    // onDestroy={this.onDestroy.bind(this)} ->  onClickModelDelete={this.onDestroy.bind(this)}
    // TODO(matthew): Why pass spaceId down to canvas, why not whole space? Seems unnecessary.
    return (
      <div className='spaceShow'>
        <div className='hero-unit container-fluid'>
          <div className='row'>
            <div className='col-md-10'>
              <SpacesShowHeader
                  isLoggedIn={isLoggedIn}
                  onDestroy={this.destroy.bind(this)}
                  onSaveName={this.onSaveName.bind(this)}
                  onSave={this.onSave.bind(this)}
                  onCopy={this._handleCopy.bind(this)}
                  onDestroy={this.destroy.bind(this)}
                  space={space}
                  canBePrivate={canBePrivate}
                  onPublicSelect={this.onPublicSelect.bind(this)}
                  onPrivateSelect={this.onPrivateSelect.bind(this)}
              />
            </div>

            <div className='col-md-2'>
              {space.user && !space.editableByMe &&
                <a className='ui image label' href={`/users/${space.user.id}`}>
                  <img src={space.user.picture}/>
                  {space.user.name}
                </a>
              }
            </div>
          </div>
        </div>
        <div className='content'>
          {sidebarIsViseable && this.state.showSidebar &&
            <SpaceSidebar
                space={space}
                onClose={this.hideSidebar.bind(this)}
                onSaveDescription={this.onSaveDescription.bind(this)}
            />
          }
          {sidebarIsViseable && !this.state.showSidebar &&
            <ClosedSpaceSidebar onOpen={this.openSidebar.bind(this)}/>
          }
          <Canvas spaceId={space.id}/>
        </div>
      </div>
    )
  }
}
