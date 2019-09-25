import React, { Component } from 'react';
import Navbar from './navbar.js';

class Mode extends Component {

  componentDidMount() {
    this.props.fetchModes();
  }

  render() {
    return (
      <div className="content-container">
        <form className="modeForm" method='post' action='/updateMode'>
        <p className="error">{this.props.error}</p>
        <div className="modesContainer">
        {this.props.modes.map((item,index) => {
          return(
            <div className="modeChoiceContainer" key={index}>
              <input type="radio" className="radioForm" value={item} name="modeChoice" onChange={this.props.changeMode}/>
              <label className="modeChoiceText">{item}</label>
            </div>
          )
        })}
        </div>
        <button onClick={this.props.updateModeOnBackend} className="modeFormBtn" type="submit">Save</button>
        </form>
      </div>
    );
  }
}

export default Mode;
