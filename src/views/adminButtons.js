import React, { Component } from 'react';

class AdminButtons extends Component {
  render() {
    if(this.props.mode == "king of the hill") {
      return (
        <div className="buttonsContainer-koth">
          <button onClick={this.props.swapContestants} className="adminButton blackButton">Swap</button>
          <button onClick={this.props.muteAll} className="adminButton blackButton">Mute All</button>
          <button onClick={this.props.unmuteAll} className="adminButton blackButton">Unmute All</button>
          <button onClick={this.props.blurAll} className="adminButton blackButton">Blur All</button>
          <button onClick={this.props.unblurAll} className="adminButton blackButton">Unblur All</button>
          <button onClick={this.props.resetAll} className="adminButton blackButton">Reset Votes</button>
        </div>
      );
    }
    else if (this.props.mode == "bachelor") {
      return (
        <div className="buttonsContainer-bachelor">
          <button onClick={this.props.muteAll} className="adminButton blackButton">Mute All</button>
          <button onClick={this.props.unmuteAll} className="adminButton blackButton">Unmute All</button>
          <button onClick={this.props.blurAll} className="adminButton blackButton">Blur All</button>
          <button onClick={this.props.unblurAll} className="adminButton blackButton">Unblur All</button>
        </div>
      );
    }
  }
}

export default AdminButtons;
