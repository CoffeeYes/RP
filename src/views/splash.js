import React, { Component } from 'react';
import main_img from '../assets/main.jpg';

class Splash extends Component {

  render() {
    return (
      <div className="content-container-main">
        <div className="login-container">
          <form action="/login" method="POST" className="login-form">
            <p className="error">{this.props.error}</p>
            <label>Username</label>
            <input name="username" onChange={this.props.handleTextChange} className="login-input"/>
            <label>Password</label>
            <input name="password" type="password"onChange={this.props.handleTextChange} className="login-input" onKeyPress={this.props.keyPressedOnSplash}/>
            <div className="login-form-text">
              <button type="button" onClick={this.props.handleLogin} id="login-button">Login</button>
              <a href="/code">Got a Code?</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Splash;
