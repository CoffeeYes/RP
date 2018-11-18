import React, { Component } from 'react';

class Splash extends Component {

  render() {
    return (
      <div className="content-container">
        <div className="login-container">
          <form action="/login" method="POST" className="login-form">
            <label>Username:</label>
            <input name="username"/>
            <label>Password:</label>
            <input name="password"/>
            <div className="login-form-text">
              <button>Login</button>
              <a href="/code">Got a Code?</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Splash;
