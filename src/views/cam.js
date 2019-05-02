import React, { Component } from 'react';
import main_img from '../assets/main.jpg';

class Cam extends Component {

  constructor(props) {
    super(props);

    this.state = {
      camFilter : "camBlurred"
    }

    this.toggleFilter = this.toggleFilter.bind(this);
  }

  toggleFilter(event) {
    this.state.camFilter == "camBlurred" ? this.setState({camFilter : "camNotBlurred"}) : this.setState({camFilter : "camBlurred"})
  }
  render() {
    return (
      <div>
        <p>{this.props.camName}</p>
        <video autoPlay={true} className={["cam " + this.props.camType + " " + this.state.camFilter]} id={this.props.camID}></video>
        <button onClick={this.toggleFilter}> B </button>
      </div>
    );
  }
}

export default Cam;
