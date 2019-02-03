import React, { Component } from 'react';
import Navbar from './navbar.js';

class votingPoll extends Component {

  componentWillMount() {
    let pollCode = window.location.href.split('?q=')[1];

    if(pollCode != undefined) {
      fetch(['/getPoll?code=' + pollCode])
    }
  }
  render() {
    return (
      <p>votingPoll</p>
    )
  }
}
export default votingPoll;
