import React, { Component } from 'react';
import main_img from '../assets/main.jpg';

class Splash extends Component {

  render() {
    return (
      <div className="content-container">
        <img className="main-bg-img" src={main_img}/>
        <div className="login-container">
          <form action="/login" method="POST" className="login-form">
            <label>Username:</label>
            <input name="username" onChange={this.props.handleTextChange}/>
            <label>Password:</label>
            <input name="password" type="password"onChange={this.props.handleTextChange}/>
            <div className="login-form-text">
              <button type="button" onClick={this.props.handleLogin}>Login</button>
              <a href="/code">Got a Code?</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Splash;
