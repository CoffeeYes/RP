import React, { Component } from 'react';
import Webcam from './webcam.js'

class Koth extends Component {

  render() {

    return (
      <div className="cam-container">
        <div className="cam-col">
          <div className="camBox localCam guest">
            <p>name1</p>
            <Webcam/>
          </div>
          <div className="camBox remoteCam guest">
            <p>name3</p>
            <video autoPlay={true} className="cam2" id="remote1"></video>
          </div>
        </div>
        <div className="cam-col">
          <div className="camBox remoteCam guest">
            <p>name2</p>
            <video autoPlay={true} className="cam2" id="remote2"></video>
          </div>
          <div className="camBox remoteCam guest">
            <p>name4</p>
            <video autoPlay={true} className="cam2" id="remote3"></video>
          </div>
        </div>
      </div>
    );
  }
}

export default Koth;
