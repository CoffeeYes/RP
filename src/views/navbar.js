import React, { Component } from 'react';

class Navbar extends Component {

  render() {
    return (
      <div className="navbar">
          <a className="navItem" href="/lobby">Lobby</a>
          <a className="navItem" href="/panel/mode">Mode</a>
          <a className="navItem" href="/panel/users">Users</a>
      </div>
    );
  }
}

export default Navbar;
