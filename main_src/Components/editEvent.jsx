import React from 'react';
import ItemList from './itemList';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import {GoogleApiWrapper} from 'google-maps-react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import Map from './map.jsx';
import Chat from './chat'

class EditEvent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      latLng: [], 
      guests: this.props.guests 
    }

    this.clickAttending = this.clickAttending.bind(this)
    this.clickNotAttending = this.clickNotAttending.bind(this)
  }

  clickAttending() {
    this.props.confirmPresence({
      variables: {
        user_id: this.props.currentUser.id,
        event_id: this.props.event.id
      }
    }).then(() => this.props.refresh())
  }

  clickNotAttending() {    
    this.props.denyPresence({
      variables: {
        user_id: this.props.currentUser.id,
        event_id: this.props.event.id
      }
    }).then(() => this.props.refresh())
  }

  addressToLatLong(){ //this should be in componentDidMount
    geocodeByAddress(this.props.location.state.event.location)
      .then(results => getLatLng(results[0]))
      .then(latLng => {console.log('Success', latLng); this.setState({latLng: latLng}); console.log("HERE ", this.state.latLng)}) //send this to the map component to put the marker
      // .then(() => console.log('here is state ? ', this.state.latLng))
      .catch(error => console.error('Error', error))
  }

  render() {
    if (this.props.location.state.event === undefined) {
      return null;
    }

      var event = this.props.event;


      return (
      <div style={{ textAlign: 'center' }} className="eventPage">
      <RaisedButton label="Edit Event" primary={true} />
      <h1 className="eventPage">{event.name}</h1>
       { this.props.currentUser.id !== event.host_id ?
          <div style={{ textAlign: 'center', align: 'center' }}>
                <FlatButton
                  style={{ textAlign: 'center', align: 'center' }}
                  onClick={this.clickAttending}
                  label="I'll be there"
                />
                <FlatButton
                  style={{ textAlign: 'center', align: 'center' }}
                  onClick={this.clickNotAttending}
                  label="Hell nah, I aint coming"
                />
          </div> : <div />
        }
      <div className="eventPage">{event.location}</div>
      <div className="eventPage">{event.date}</div>
      <div className="eventPage time">{event.time}</div>
      <div className="eventPage">{event.description}</div>

        <div>
          <h2>Who's Coming</h2>
          <ul>
            {this.props.guests.map((guest) => {
              return (
                <div>
                  <a>{guest.name}</a>
                  <a>{guest.memberReply === 0 ? ': Not attending' : guest.memberReply === 1 ? ': Attending' : ': Pending'}</a>
                </div>
              );
            })}
          </ul>
        </div>
        <div>
          <button onClick={() => this.addressToLatLong()}>Click me if ya want map info</button>
          <button onClick={() => console.log('clicked')}>Click me if ya want directions</button>

          <Map props={this.props} latLng={this.state.latLng}/>
        </div>
        <div>
          <h2>Item Registery</h2>
          <h3>Click on an item to claim it</h3>
          <ItemList
            currentUser={this.props.currentUser}
            event={event}
          />
          <ul />
        </div>
          <img
          style={{ height: '400px', width: '400px' }}
          src={event.img}
          alt=""
        />
        <Chat 
          user={this.props.currentUser}
          event={event}
        />
      </div>

    )
  }
}

const confirmPresence = gql`
  mutation confirmPresence($user_id: Int, $event_id: Int){
    confirmPresence(id: $user_id, guest_event_id: $event_id)
  }
`

const denyPresence = gql`
  mutation denyPresence($user_id: Int, $event_id: Int){
    denyPresence(id: $user_id, guest_event_id: $event_id)
  }
`

const EditEventWithData = compose(
  graphql(confirmPresence, { name: 'confirmPresence' }),
  graphql(denyPresence, { name: 'denyPresence' })
  GoogleApiWrapper({
    apiKey: 'AIzaSyCcyYySdneaabfsmmARXqAfGzpn9DCZ3dg'
  })
)(EditEvent);

export default EditEventWithData
