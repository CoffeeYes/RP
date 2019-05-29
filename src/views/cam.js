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

  //set cam filters based on user type
  componentDidMount() {
    if(this.props.userType != "admin") {
      this.setState({camFilter : "camNotBlurred"})
    }
  }

  toggleFilter(event) {
    this.state.camFilter == "camBlurred" ? this.setState({camFilter : "camNotBlurred"}) : this.setState({camFilter : "camBlurred"})
  }
  render() {
      if(this.props.userType == "admin") {
        return(
          <div className={["camBox " + this.props.containerType]}>
            <p>{this.props.camName}</p>
            <div className="buttonContainer">
              <button onClick={this.toggleFilter} className="toggleButton"> B </button>
              <button onClick={this.toggleMute} className="toggleButton"> M </button>
            </div>
            <video autoPlay={true} className={["cam " + this.props.camType + " " + this.state.camFilter]} id={this.props.camID}></video>
            <audio id={["audio" + this.props.camType + this.props.num]}></audio>
          </div>
        )
      }
      else {
        return (
          <div className={["camBox " + this.props.containerType]}>
            <p>{this.props.camName}</p>
            <video autoPlay={true} className={["cam " + this.props.camType + " " + this.state.camFilter]} id={this.props.camID}></video>
            <audio id={["audio" + this.props.camType + this.props.num]}></audio>
          </div>
        )
      }
  }
}

export default Cam;
