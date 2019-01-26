import React, { Component } from 'react';
import Navbar from './navbar.js';

class Vote extends Component {

  render() {
    return (
      <div className="horcent">
        <form className="addVotingForm">
          {this.props.inputCount.map((item,index) => {
              return (
                <input name={"field" + index} key={index}/>
              )
          })}
          <button className="addInput" onClick={this.props.addField}>Add Field</button>
        </form>
      </div>
    );
  }
}

export default Vote;
