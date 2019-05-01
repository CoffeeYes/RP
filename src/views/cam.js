import React, { Component } from 'react';
import main_img from '../assets/main.jpg';

class Cam extends Component {

  render() {
    return (
      <div>
        <p>{this.props.camName}</p>
        <video autoPlay={true} className={["cam " + this.props.camType]} id={this.props.camID}></video>
      </div>
    );
  }
}

export default Cam;
