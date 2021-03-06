import React, { Component } from 'react';

var timerInterval;
var flashingTimer;

class Timer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timerMinutes : 0,
      timerSeconds : 5,
      startingMinutes : 0,
      startingSeconds : 5,
      timerText : "",
      editing : false,
      updateTimerMinutes : "",
      updateTimerSeconds : "",
      error : "",
      timerBorderColor : "timerBlueBorder",
      augmentTimerClasses : "",
    }
  }

  //create text for timer and prefix zeros if necessary
  generateTimerText = (minutes,seconds) => {
    var timerText
    if(minutes < 10) {
      timerText = "0" + minutes + ":"
    }
    else {
      timerText = minutes + ":"
    }

    if(seconds < 10) {
      timerText += "0" + seconds;
    }
    else {
      timerText += seconds;
    }
    return timerText;
  }

  componentDidMount = () => {
    this.getTimerValuesFromBackend()
  }

  startTimer = () => {
    if(timerInterval === null) {
      timerInterval = setInterval( () => {
        var currentSeconds = this.state.timerSeconds
        var currentMinutes = this.state.timerMinutes

        if(currentSeconds > 0) {
          currentSeconds -= 1;
        }
        else {
          if(currentMinutes > 0) {
            currentMinutes -= 1;
            currentSeconds = 59;
          }
          else {
            clearInterval(timerInterval);
            //make timerContainer flash red and blue
            flashingTimer = setInterval( () => {
              //change border color
              if(this.state.timerBorderColor === "timerBlueBorder") {
                this.setState({timerBorderColor : "timerRedBorder"})
              }
              else {
                this.setState({timerBorderColor : "timerBlueBorder"})
              }

              //flash text
              if(this.state.timerText === "") {
                this.setState({timerText : "00:00"})
              }
              else {
                this.setState({timerText : ""})
              }
            },300)
            //stop flashing after x seconds
            setTimeout( () => {
              clearInterval(flashingTimer)
              this.setState({timerBorderColor : "timerBlueBorder"})
              //reset timer value after it has finished flashing
              var resetTimerText = this.generateTimerText(this.state.startingMinutes,this.state.startingSeconds);
              this.setState({timerText : resetTimerText})

              this.resetTimer();
            },5000)
          }
        }
        this.setState({timerSeconds : currentSeconds,timerMinutes : currentMinutes})
        var currentTimerText = this.generateTimerText(currentMinutes,currentSeconds);
        this.setState({timerText : currentTimerText})
      },1000)
    }
  }

  stopTimer = () => {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  resetTimer = () => {
    clearInterval(timerInterval);
    timerInterval = null;

    this.setState({timerMinutes : this.state.startingMinutes})
    this.setState({timerSeconds : this.state.startingSeconds})

    var resetTimerText = this.generateTimerText(this.state.startingMinutes,this.state.startingSeconds);
    this.setState({timerText : resetTimerText})
  }

  toggleEditingTimer = () => {
    this.setState({error : ""})

    if(this.state.editing === true ) {
      if (this.state.updateTimerMinutes === "" || this.state.updateTimerSeconds === "") {
        return this.setState({error : "Fields Cannot be empty",augmentTimerClasses : "timerContainerShowingError"})
      }
    }
    if(this.state.updateTimerMinutes !== "" && isNaN(parseInt(this.state.updateTimerMinutes)) | this.state.updateTimerSeconds !== "" && isNaN(parseInt(this.state.updateTimerSeconds))) {
        return this.setState({error : "only numbers are allowed",augmentTimerClasses : "timerContainerShowingError"})
    }
    else if(parseInt(this.state.updateTimerSeconds) < 0 | parseInt(this.state.updateTimerSeconds) > 59) {
      this.setState({updateTimerSeconds : ""})
      return this.setState({error : "please Enter a seconds value between 0 and 60",augmentTimerClasses : "timerContainerShowingError"})
    }
    else {
      this.setState({editing : !this.state.editing,augmentTimerClasses : ""})
    }
  }

  updateTimeText = (event) => {
    this.setState({[event.target.name] : event.target.value})
  }

  getTimerValuesFromBackend = () => {
    //get saved starting values for timer from backend
    fetch('/getTimerValues')
    .then(res => res.json())
    .then( data => {
      this.setState({startingMinutes : data.timerValues.minutes,startingSeconds : data.timerValues.seconds})
      this.setState({timerMinutes : data.timerValues.minutes,timerSeconds : data.timerValues.seconds})
      var initialTimer = this.generateTimerText(this.state.startingMinutes,this.state.startingSeconds);
      this.setState({timerText : initialTimer})
    })
  }

  updateTimeOnBackend = () => {
    this.setState({error: "working..."})
    fetch('/updateTimerValues',{
      method : 'POST',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
        seconds : parseInt(this.state.updateTimerSeconds) === 0 ? "0" : this.state.updateTimerSeconds,
        minutes : parseInt(this.state.updateTimerMinutes) === 0 ? "0" : this.state.updateTimerMinutes
      })
    })
    .then( () => {
      this.setState({error: ""})
      this.toggleEditingTimer()
      this.getTimerValuesFromBackend()
      //reset updateTimer fields
      this.setState({updateTimerMinutes : "",updateTimerSeconds : ""})
    })
  }

  render() {
    if(this.state.editing === false){
      return (
        <div className={["timerContainer " + this.state.timerBorderColor]}>
          <div className="timerTextAndButtonsContainer">
            <p id="timeText">{this.state.timerText}</p>
            <div className="timerButtonContainer">
              <div className="timerButtonRow">
                <button className="timerButton blackButton" onClick={this.startTimer}>Start</button>
                <button className="timerButton blackButton" onClick={this.stopTimer}>Stop</button>
              </div>
              <div className="timerButtonRow">
                <button className="timerButton blackButton" onClick={this.resetTimer}>Reset</button>
                <button className="timerButton blackButton" onClick={this.toggleEditingTimer}>Edit</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className={["timerContainer editingTimerBorder editingTimerContainer " + this.state.augmentTimerClasses]} >
          <p className="error">{this.state.error}</p>
          <div className="timerTextAndButtonsContainer">
            <div className="updateTimerContainer">
              <div className="updateTimerInputContainer">
                <label className="timerInputText">Minutes</label>
                <input onChange={this.updateTimeText} name="updateTimerMinutes" className="timerInput"/>
              </div>
              <div className="updateTimerInputContainer">
                <label className="timerInputText">Seconds</label>
                <input onChange={this.updateTimeText} name="updateTimerSeconds" className="timerInput"/>
              </div>
            </div>
            <div className="timerButtonContainer">
              <button className="timerButton blackButton" onClick={this.updateTimeOnBackend}>Save</button>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default Timer;
