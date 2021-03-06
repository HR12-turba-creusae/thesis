import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { GUEST_QUERY2 } from '../queries.js'
import { toggleClaim } from '../mutations.js'


class Item extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clicked: false,
      name: this.props.currentUser
    }
    this.handleItemClick = this.handleItemClick.bind(this)
  }

  componentWillMount(){
    if (this.props.claimedBy && this.props.claimedBy.id === this.props.currentUser.id){
      this.setState({
        clicked: true
      })
    }
  }

  handleItemClick = e => {
     if (this.state.clicked === false) {
       this.setState({
         clicked: true
       });
     } else {
       this.setState({
         clicked: false
       });
     }
     console.log('user in click', this.props.currentUser)
     this.props.toggleClaimOfItem({
       variables: {
         id: this.props.id,
         user_id: this.props.currentId
       }
     })
     this.forceUpdate()
   };

  render() {

    if (this.props.guestQuery.loading || this.props.guestQuery.error
       // || this.props.itemsQuery.loading || this.props.itemsQuery.error
     ) {
      return null
    }
// console.log('Props in itemLost ', this.props)
  // console.log('this should be the user id for the item ', this.props.itemsQuery.event[0].user_id)
  console.log('this should be the user id for the user ', this.props.currentId)

    console.log('what is the id here ', this.props.currentId, this.props.id)
    console.log('USER ID THIS THIS THIS', this.props.currentUser); //currentUser
    // console.log('props in item ', this.props.itemsQuery.event)

    const isClicked = this.state.clicked
    let hash = this.props.hash

    if (this.props.itemUserId !== null && this.props.currentId !== this.props.userToItem.name){ //this.props.itemsQuery.event.items(one).user_id
      return(
        <div style={{ textAlign: 'center', align: 'center' }}>
         <a>{this.props.description} was claimed by {this.props.userToItem.name}</a>
        </div>
      )
    } else {
      return(
        <div style={{ textAlign: 'center', align: 'center' }}>
        {isClicked ?
          <a onClick={e => this.handleItemClick(e)}>
          {this.props.description} was claimed by {this.state.name}
          </a>
         :
          <a onClick={e => this.handleItemClick(e)}>{this.props.description}</a>
        }
        </div>
    )
  }
}
}


//does this match your id
//^ for GUEST_QUERY2

//for the item where the user_id is equal to the user_id
//^ for toggleClaim

const guestClaim = compose(
  graphql(toggleClaim, { name: 'toggleClaimOfItem' }),
  graphql(GUEST_QUERY2, {
    options: (props) => ({variables: {id: props.hash}}),
    name: 'guestQuery'})
)(Item)

export default guestClaim
