import React, { Component } from 'react';
import Navbar from './navbar.js';

class votingPoll extends Component {

  componentWillMount() {
    this.props.fetchPoll();
  }
  render() {
    return (
      <div>
        <p>{this.props.error}</p>
        <p>votingPoll</p>
      </div>
    )
  }
}
export default votingPoll;
