import React, { Component } from 'react';
import Navbar from './navbar.js';

class Panel extends Component {

  render() {
    return (
      <Navbar fetchModes={this.props.fetchModes}/>
    );
  }
}

export default Panel;
