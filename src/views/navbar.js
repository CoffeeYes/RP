import React, { Component } from 'react';

class Navbar extends Component {

  render() {
    return (
      <div className="navbar">
          <a className="navItem" href="/lobby">Lobby</a>
          <a className="navItem" href="/panel/mode" onClick={this.props.fetchModes}>Mode</a>
          <a className="navItem" href="/panel/users">Users</a>
          <a className="navItem" href="/panel/vote">vote</a>
      </div>
    );
  }
}

export default Navbar;
