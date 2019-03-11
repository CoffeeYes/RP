import React, { Component } from 'react';
import Webcam from 'react-webcam'

class Koth extends Component {

  render() {
    return (
      <div className="cam-container">
        <div className="cam-row">
          <div className="camBox guest">
            <p>name1</p>
            <Webcam className="cam2"/>
          </div>
          <div className="camBox guest">
            <p>name2</p>
            <Webcam className="cam2"/>
          </div>
        </div>
        <div className="cam-row">
          <div className="camBox guest">
            <p>name3</p>
            <Webcam className="cam2"/>
          </div>
          <div className="camBox guest">
            <p>name4</p>
            <Webcam className="cam2"/>
          </div>
        </div>
      </div>
    );
  }
}

export default Koth;
