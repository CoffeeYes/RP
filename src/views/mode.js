import React, { Component } from 'react';
import Navbar from './navbar.js';

class Mode extends Component {

  render() {
    return (
      <div className="content-container">
        <form className="modeForm">
        {this.props.modes.map((item,index) => {
          return(
            <div className="modeChoiceContainer">
              <input type="radio" className="radioForm"/>
              <label className="modeChoiceText">{item}</label>
            </div>
          )
        })}
        <button onClick={this.props.changeMode} className="modeFormBtn">Save</button>
        </form>
      </div>
    );
  }
}

export default Mode;
