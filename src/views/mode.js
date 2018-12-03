import React, { Component } from 'react';
import Navbar from './navbar.js';

class Mode extends Component {

  render() {
    return (
      <div>
        {this.props.modes.map((item,index) => {
          return(
            <p>{item}</p>
          )
        })}
      </div>
    );
  }
}

export default Mode;
