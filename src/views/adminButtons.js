import React, { Component } from 'react';

class AdminButtons extends Component {
  render() {
    if(this.props.mode == "king of the hill") {
      return (
        <div className="buttonsContainer">
          <button onClick={this.props.swapContestants}>Swap</button>
          <button onClick={this.props.muteAll}>Mute All</button>
          <button onClick={this.props.unmuteAll}>Unmute All</button>
          <button onClick={this.props.blurAll}>Blur All</button>
          <button onClick={this.props.unblurAll}>Unblur All</button>
          <button onClick={this.props.resetAll}>Reset Votes</button>
        </div>
      );
    }
    else if (this.props.mode == "bachelor") {
      return (
        <div className="buttonsContainer">
          <button onClick={this.props.muteAll}>Mute All</button>
          <button onClick={this.props.unmuteAll}>Unmute All</button>
          <button onClick={this.props.blurAll}>Blur All</button>
          <button onClick={this.props.unblurAll}>Unblur All</button>
        </div>
      );
    }
  }
}

export default AdminButtons;
