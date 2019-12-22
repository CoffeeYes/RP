import React, { Component } from 'react';

class Timer extends Component {

  render() {
    return (
      <div className="timerContainer">
        <p id="timeText">{this.props.currentTime}</p>
        <button className="timerButton">Start</button>
        <button className="timerButton">Reset</button>
      </div>
    );
  }
}

export default Timer;
