import React, { Component } from 'react';

class AdminButtons extends Component {
  render() {
    if(this.props.mode == "king of the hill") {
      return (
        <div className="buttonsContainer">
          <button onClick={this.props.swapContestants} className="adminButton">Swap</button>
          <button onClick={this.props.muteAll} className="adminButton">Mute All</button>
          <button onClick={this.props.unmuteAll} className="adminButton">Unmute All</button>
          <button onClick={this.props.blurAll} className="adminButton">Blur All</button>
          <button onClick={this.props.unblurAll} className="adminButton">Unblur All</button>
          <button onClick={this.props.resetAll} className="adminButton">Reset Votes</button>
        </div>
      );
    }
    else if (this.props.mode == "bachelor") {
      return (
        <div className="buttonsContainer">
          <button onClick={this.props.muteAll} className="adminButton">Mute All</button>
          <button onClick={this.props.unmuteAll} className="adminButton">Unmute All</button>
          <button onClick={this.props.blurAll} className="adminButton">Blur All</button>
          <button onClick={this.props.unblurAll} className="adminButton">Unblur All</button>
        </div>
      );
    }
  }
}

export default AdminButtons;
