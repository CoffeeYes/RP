import React, { Component } from 'react';
import Navbar from './navbar.js';
import PollList from './pollList.js';

class Vote extends Component {

  render() {
    return (
      <div className="horcent">
        <form className="addVotingForm">
          {this.props.inputCount.map((item,index) => {
              return (
                <input name={"field" + index} key={index} onChange={this.props.handleFieldText}/>
              )
          })}
          <button className="addInput" onClick={this.props.addField}>Add Field</button>
          <button onClick={this.props.handleAddPoll}>Submit</button>
        </form>
        <PollList getAllPolls={this.props.getAllPolls} pollsData={this.props.pollsData} deletePoll={this.props.deletePoll}/>
      </div>
    );
  }
}

export default Vote;
