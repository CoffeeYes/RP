import React, { Component } from 'react';

class Splash extends Component {

  render() {
    return (
      <div className="content-container">
        <form action='/roomCode' method='post'>
          <input name="codeInput"/>
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

export default Splash;
