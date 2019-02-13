import React, { Component } from 'react';
import Navbar from './navbar.js';

class votingPoll extends Component {

  componentWillMount() {
    this.props.fetchPoll();
  }
  render() {
    if(this.props.error) {
      return (
        <div className="content-container">
          <p>{this.props.error}</p>
        </div>
      )
    }
    else {
      return (
        <div className="content-container">
          <form className="pollForm">
            {this.props.pollResult.map((item,index) => {
                return (
                  <div>
                    <input name="choice" key={index} type="radio" value={item} onClick={this.props.clickVote}/>{item}
                  </div>
                )
            })}
            <button onClick={this.props.handleVote}>Submit</button>
          </form>
        </div>
      )
    }
  }
}
export default votingPoll;
