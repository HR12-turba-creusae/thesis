import React from 'react';
import ItemList from './itemList';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { GoogleApiWrapper, google } from 'google-maps-react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';
import Map from './map.jsx';
import Chat from './chat';
import { confirmPresence, denyPresence, addToCalendar } from '../mutations.js';

class EventFocus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latLng: [],
      guests: this.props.guests,
      toggleChat: false,
      toggleChatButton: true,
      toggleItemsView: true,
      toggleAttendanceView: false
    };

    this.clickAttending = this.clickAttending.bind(this);
    this.clickNotAttending = this.clickNotAttending.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.determineWhatToRender = this.determineWhatToRender.bind(this);
    this.toggleChat = this.toggleChat.bind(this);
    this.toggleItemsView = this.toggleItemsView.bind(this);
    this.toggleAttendingView = this.toggleAttendingView.bind(this);
    this.addToCalendar = this.addToCalendar.bind(this)
  }

  toggleItemsView() {
    if (!this.state.toggleItemsView) {
      this.setState({
        toggleItemsView: !this.state.toggleItemsView,
        toggleAttendanceView: !this.state.toggleAttendanceView
      });
    }
  }

  toggleAttendingView() {
    if (!this.state.toggleAttendanceView) {
      this.setState({
        toggleAttendanceView: !this.state.toggleAttendanceView,
        toggleItemsView: !this.state.toggleItemsView
      });
    }
  }

  clickAttending() {
    this.props
      .confirmPresence({
        variables: {
          user_id: this.props.currentUser.id,
          event_id: this.props.event.id
        }
      })
      .then(() => this.props.refresh());
  }

  clickNotAttending() {
    this.props
      .denyPresence({
        variables: {
          user_id: this.props.currentUser.id,
          event_id: this.props.event.id
        }
      })
      .then(() => this.props.refresh());
  }

  componentWillReceiveProps() {
    this.addressToLatLong();
  }

  addressToLatLong() {
    //this should be in componentDidMount
    geocodeByAddress(this.props.event.location)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({ latLng: latLng });
        //send this to the map component to put the marker
      })
      .catch(error => console.error('Error', error));
  }

  handleClick() {
    this.props.toggleEditState();
  }

  determineWhatToRender(stateOption, eventOption) {
    if (
      stateOption === null ||
      stateOption === undefined ||
      stateOption.length === 0 ||
      stateOption === 0
    ) {
      return eventOption;
    } else {
      return stateOption;
    }
  }

  toggleChat() {
    this.setState({
      toggleChat: !this.state.toggleChat,
      toggleChatButton: !this.state.toggleChatButton
    });
  }

  addToCalendar(){
    let event = this.props.event
    let { description, name, location, dateTimeStart, id } = event
    let user_id = this.props.currentUser.id
    this.props.addToCalendar({
      variables: {
        description, 
        name, 
        location, 
        dateTimeStart, 
        user_id, 
        id
      }
    })
  }

  render() {
    let event = this.props.event;
    let checkIfHostOfEvent =
      this.props.currentUser.id === this.props.event.host_id;

    return (
      <div className="event-page">
        <div className="event-page-grid">
          {/* Edit Event Button
          <div className="event-page-edit-button">
            {checkIfHostOfEvent && (
              <RaisedButton
                label="Edit Event"
                primary={true}
                onClick={this.handleClick}
              />
            )}
          </div> */}
          {/* RSVP Buttons
          <div className="event-page-rsvp-button">
            {!checkIfHostOfEvent && (
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
              </div>
            )}
          </div> */}
          {/* Event Image */}
          <div className="event-page-image">
            {/* Event Title */}
            <div className="event-page-title">
              <h1>{this.determineWhatToRender(this.props.name, event.name)}</h1>
            </div>
            <img src={this.props.event.img} alt="" />
          </div>

          <div className="event-page-info">
            {/* Event Location */}
            <div className="event-page-location">
              location{' '}
              {this.determineWhatToRender(this.props.location, event.location)}
            </div>
            {/* Event Date */}
            <div className="event-page-location">
              date: {this.determineWhatToRender(this.props.date, event.date)}
            </div>
            {/* Event Time */}
            <div className="event-page-time">
              time: {this.props.time || event.time}
            </div>
            {/* Event Description */}
            <div className="event-page-description">
              description:{' '}
              {this.determineWhatToRender(
                this.props.description,
                event.description
              )}
            </div>
            <button onClick={this.addToCalendar}>+ Add Event To Google Calendar</button>
            {/* Map
            <div className="event-page-map">
              <Map
                useThis={this.props.event.location}
                props={this.props}
                latLng={this.state.latLng}
              />
            </div> */}
          </div>

          <div className="event-page-sidebar">
            <div className="event-page-sidebar-buttons">
              <div onClick={this.toggleItemsView} className="tab">
                Item Registery
              </div>
              <div onClick={this.toggleAttendingView} className="tab">
                Attending
              </div>
            </div>
            {/* Attendance List */}
            <div
              className={
                this.state.toggleAttendanceView
                  ? 'event-page-attendance-show'
                  : 'event-page-attendance-hide'
              }
            >
              <h1>Who's Coming</h1>
              <ul>
                {this.props.guests.map(guest => {
                  return (
                    <div>
                      <a>{guest.name}</a>
                      <a>
                        {guest.memberReply === 0
                          ? ': Not attending'
                          : guest.memberReply === 1
                            ? ': Attending'
                            : ': Pending'}
                      </a>
                    </div>
                  );
                })}
              </ul>
            </div>
            {/* Item Registery */}
            <div
              className={
                this.state.toggleItemsView
                  ? 'event-page-registery-show'
                  : 'event-page-registery-hide'
              }
            >
              <div className="event-page-registery-header">
                <h2>Item Registery</h2>
                <h3>Click on an item to claim it</h3>
                <button
                  onClick={() =>
                    (window.location.href = 'https://www.amazon.com/')
                  }
                >
                  Buy an item on Amazon!
                </button>
                <button
                  onClick={() => (window.location.href = 'https://drizly.com/')}
                >
                  Buy some booze!
                </button>
              </div>

              <ItemList currentUser={this.props.currentUser} event={event} />

              {/* <ul /> */}
            </div>
          </div>

          {/* Event Chat */}
          <div className="event-page-chat">
            <Chat
              user={this.props.currentUser}
              event={event}
              showChat={this.state.toggleChat}
              toggleChat={this.toggleChat}
            />
            <button
              className={
                this.state.toggleChatButton ? 'showToggleChat' : 'noToggleChat'
              }
              onClick={this.toggleChat}
            >
              Chat
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const EventFocusWithData = compose(
  graphql(confirmPresence, { name: 'confirmPresence' }),
  graphql(denyPresence, { name: 'denyPresence' }),
  graphql(addToCalendar, {name: 'addToCalendar'}),
  GoogleApiWrapper({
    apiKey: 'AIzaSyCcyYySdneaabfsmmARXqAfGzpn9DCZ3dg',
    apiKey: 'AIzaSyCDVd2ErtvbrNJht5TENmZ54E9mMECUviA'
  })
)(EventFocus);

export default EventFocusWithData;
