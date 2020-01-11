import React, { Component } from 'react';

class Timer extends Component {

  render() {
    if(this.props.editing == false){
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
    else {
      return (
        <div className="timerContainer">
          <p className="error">{this.props.error}</p>
          <div className="updateTimerContainer">
            <label>Minutes</label>
            <input onChange={this.props.updateTimeText} name="updateTimerMinutes" type="number"/>
            <label>Seconds</label>
            <input onChange={this.props.updateTimeText} name="updateTimerSeconds" type="number"/>
          </div>
          <div className="timerButtonContainer">
            <button className="timerButton" onClick={this.props.startTimer}>Start</button>
            <button className="timerButton" onClick={this.props.resetTimer}>Reset</button>
            <button className="timerButton" onClick={this.props.updateTimeOnBackend}>Save</button>
          </div>
        </div>
      )
    }
  }
}

export default Timer;
