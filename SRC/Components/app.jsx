import React from 'react'
import Header from './header.jsx'
//import Dashboard from './dashboard.jsx'
import DashboardWithData from './dashboard.jsx'
import EventPage from './eventPage.jsx'
import CreateEventWithData from './createEvent.jsx'
// import MuiThemeProvider from 'material-ui/styles'
import { Switch, Route, browserHistory } from 'react-router-dom'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import axios from 'axios'
import { withApollo } from 'react-apollo';
import $ from 'jquery'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: undefined,
      contacts: []
    }
  }

  componentWillMount() {
    axios.get('/user')
          .then(data => {

            this.setState({
              currentUser: data.data.user || null
            })
          })
          .catch(error => {
            console.log(error)
          })
  }


  render() {
    console.log('sup')
    if (this.state.currentUser === undefined) {
      return <div>wait</div>
    } else {
      console.log('contacts ', this.state.contacts)
      return (
        <MuiThemeProvider>
        <div>
          <Header />
          <div>
            <Switch>
              <Route path="/dashboard/:id" render={({match}) => <DashboardWithData history={browserHistory} currentUser={this.state.currentUser} currentGuest={match}/>}/>
              <Route path="/eventPage" render={() => <EventPage currentUser={this.state.currentUser} />}/>
              <Route path="/createEvent" render={() => <CreateEventWithData currentUser={this.state.currentUser} />}/>
            </Switch>
          </div>
        </div>
      </MuiThemeProvider>
      )
    }
  }
}

export default withApollo(App)
