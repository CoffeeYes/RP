import React, { Component } from 'react';
import Navbar from './navbar.js';

class votingPoll extends Component {

  componentWillMount() {
    this.props.fetchPoll();
  }
  render() {
    return (
      <div className="content-container">
        <p>{this.props.error}</p>
        <form className="pollForm">
          {this.props.pollResult.map((item,index) => {
              return (
                <div>
                  <input name={"field" + index} key={index} type="radio" value={item}/>{item}
                </div>
              )
          })}
        </form>
      </div>
    )
  }
}
export default votingPoll;
