import React, { Component } from 'react';
import Navbar from './navbar.js';

class Panel extends Component {

  render() {
    return (
      <Navbar prepLobby={this.props.prepLobby}/>
    );
  }
}

export default Panel;
