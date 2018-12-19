import React, { Component } from 'react';

class Splash extends Component {

  render() {
    return (
      <div className="content-container">
        <form action='/roomCode' method='post' className="codeForm">
          <h2>Enter your code</h2>
          <input name="codeInput"/>
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

export default Splash;
