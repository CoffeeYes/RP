import React, { Component } from 'react';
import Webcam from './webcam.js'

class Koth extends Component {

  render() {

    return (
      <div className="cam-container">
        <div className="cam-row">
          <div className="camBox guest">
            <p>name1</p>
            <Webcam/>
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
