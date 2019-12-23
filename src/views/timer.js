import React, { Component } from 'react';

class Timer extends Component {

  render() {
    return (
      <div className="timerContainer">
        <p id="timeText">{this.props.currentTime}</p>
        <button className="timerButton" onClick={this.props.startTimer}>Start</button>
        <button className="timerButton" onClick={this.props.resetTimer}>Reset</button>
      </div>
    );
  }
}

export default Timer;
