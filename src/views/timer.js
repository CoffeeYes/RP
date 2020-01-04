import React, { Component } from 'react';

class Timer extends Component {

  render() {
    return (
      <div className="timerContainer">
        <p id="timeText">{this.props.currentTime}</p>
        <div className="timerButtonContainer">
          <button className="timerButton" onClick={this.props.startTimer}>Start</button>
          <button className="timerButton" onClick={this.props.resetTimer}>Reset</button>
          <button className="timerButton" onClick={this.props.toggleEditingTimer}>Edit</button>
        </div>
      </div>
    );
  }
}

export default Timer;
