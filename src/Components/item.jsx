import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


class Item extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clicked: false, guestId: ''
    }
    this.handleItemClick = this.handleItemClick.bind(this)
  }

  handleItemClick = (e) => {
    console.log('item clicked', e.target.textContent);
    if (this.state.clicked === false) {
      this.setState({
        clicked: true
      })
    } else {
      this.setState({
        clicked: false
      })
    }
    // mutation to toggle that item that was clicked.
    // render onclick a div that says <name> claimed item!
  }

  render() {
    console.log('Item props', this.props);
    console.log('anything HEREE E ' ,this.props.guestQuery)
    setTimeout(() => {
      this.setState({
        guestId: this.props.guestQuery.user.id
      }, () => console.log('this is guest id state set timeout', this.state.guestId))

    }, 3000)

    const isClicked = this.state.clicked
    return (
      <div style={{"textAlign": "center"}}>
      {isClicked ? (
        <a onClick={(e) => this.handleItemClick(e)}>{this.props.name} was claimed by {this.props.currentUser.name || this.state.guestId}</a>
      ) : (

        <a onClick={(e) => this.handleItemClick(e)}>{this.props.name}</a>
      )}
    </div>
    )
  }

}

const GUEST_QUERY = gql `
  query guestQuery ($id: String){
      user(hash: $id) {
        id
        # items {
        #   id
        #   name
        #   user_id
        # }
    }
  }
`

const ItemGuest = graphql(GUEST_QUERY, {
  skip: (props) => (typeof props.currentUser !== 'string'),
  options: (props) => ({variables: {id: props.currentUser}}),
  name: 'guestQuery'
})(Item)

export default ItemGuest
