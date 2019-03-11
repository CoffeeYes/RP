import React, { Component } from 'react';

class Koth extends Component {
  setRef = webcam => {
    this.webcam = webcam
  }

  handleUserMedia = () => {
    console.log(this.webcam.stream)
  }

  record = () => {
    setInterval( () => {
      console.log("image")
    },(30/1000))
  }
  render() {

    return (
      <div className="cam-container">
        <div className="cam-row">
          <div className="camBox guest">
            <p>name1</p>
          </div>
          <div className="camBox guest">
            <p>name2</p>
          </div>
        </div>
        <div className="cam-row">
          <div className="camBox guest">
            <p>name3</p>
          </div>
          <div className="camBox guest">
            <p>name4</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Koth;
