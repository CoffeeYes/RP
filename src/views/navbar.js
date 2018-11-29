import React, { Component } from 'react';

class Navbar extends Component {

  render() {
    return (
      <div className="navbar">
          <a className="navItem" href="/lobby">Lobby</a>
          <a className="navItem" href="/mode">Mode</a>
          <a className="navItem" href="/users">Users</a>
          <a className="navItem" href="/vote">vote</a>
      </div>
    );
  }
}

export default Navbar;
