import React, { Component } from 'react';
import Navbar from './navbar.js';

class Mode extends Component {

  render() {
    return (
      <div className="content-container">
        <form className="modeForm" method='post' action='/updateMode'>
        {this.props.modes.map((item,index) => {
          return(
            <div className="modeChoiceContainer" key={index}>
              <input type="radio" className="radioForm" value={item} name="modeChoice"/>
              <label className="modeChoiceText">{item}</label>
            </div>
          )
        })}
        <button onClick={this.props.changeMode} className="modeFormBtn" type="submit">Save</button>
        </form>
      </div>
    );
  }
}

export default Mode;
