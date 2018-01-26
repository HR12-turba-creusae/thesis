// Description of Redux State
// {
//     currentEvent: {
//         id: null,
//         hostId: null,
//         location: '',
//         description: '',
//         time/date: '',
//         currentEventRegistery: [{id: null, userId: null, name: '', }],
//         guests: []
//     },
//     currentUser: {
//         id: null,
//         name: '',
//         memberStatus: true,
//         email: ''
//     },
//     attendingEvents: {
//         id: {},
//         id: {} 
//     },
//     hostingEvents: {
//         id: {},
//         id: {}
//     },
//     pastEvents: {
//         id: {},
//         id: {},

//     }
//     // ui state
// }

// Import redux dependencies
import { combineReducers } from 'redux'

// import split reducers
import { currentEvent } from './currentEvent'
import { hostingEvents } from './hostingEvents'
import { currentEvent } from './currentEvent'
import { currentUser } from './currentUser'

const combinedReducer = combineReducers(currentEvent, hostingEvents, currentUser, attendingEvents)

module.exports = combinedReducer;