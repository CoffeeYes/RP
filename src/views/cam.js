import React, { Component } from 'react';
import main_img from '../assets/main.jpg';

import unmute from '../assets/icon_unmute.png';
import mute from '../assets/icon_mute.png';
import icon_video from '../assets/icon_video.png'
import icon_novideo from '../assets/icon_novideo.png'

var camID;
class Cam extends Component {

  constructor(props) {
    super(props);

    this.state = {
      camFilter : "camBlurred",
      muteIcon : mute,
      videoIcon : icon_novideo,
    }

    this.toggleFilter = this.toggleFilter.bind(this);
  }

  //set cam filters based on user type
  componentDidMount() {
    if(this.props.userType != "admin") {
      this.setState({camFilter : "camNotBlurred"})
    }

    camID = this.props.camID
  }

  //track prop change to change icons when all cams are muted or blurred
  componentWillReceiveProps(nextProps) {
    if(nextProps.allMuted == true) {
      this.setState({muteIcon : mute})
    }
    else {
      this.setState({muteIcon : unmute});
    }

    if(nextProps.allBlurred == true) {
      this.setState({camFilter : "camBlurred"});
      this.setState({videoIcon : icon_novideo});
    }
    else {
      this.setState({camFilter : "camNotBlurred"})
      this.setState({videoIcon : icon_video});
    }
  }

  toggleFilter(event) {
    this.state.camFilter == "camBlurred" ? this.setState({camFilter : "camNotBlurred"}) : this.setState({camFilter : "camBlurred"})

    //toggle icon
    this.state.videoIcon == icon_novideo ? this.setState({videoIcon : icon_video}) : this.setState({videoIcon : icon_novideo})
  }

  toggleMute = () => {
    var video = document.querySelector('#' + this.props.camID);
    video.muted =  !(video.muted)

    if(this.state.muteIcon == unmute) {
      this.setState({muteIcon : mute})
    }
    else {
      this.setState({muteIcon : unmute})
    }
  }
  render() {
      if(this.props.userType == "admin") {
        return(
          <div className={["camBox " + this.props.containerType]}>
          <div className="camHeader">
              <p>{this.props.camName}</p>
              <div className="buttonContainer">
                <img src={this.props.tickIcon} id={["tick" + this.props.iconID]}/>
                <img src={this.props.crossIcon} id={["cross" + this.props.iconID]}/>
                <button className="cameraButton" onClick={this.toggleFilter}>
                  <img src={this.state.videoIcon} />
                </button>
                <button className="cameraButton" onClick={this.toggleMute}>
                  <img src={this.state.muteIcon} />
                </button>
                <button className="cameraButton" onClick={() => this.props.kickUser(this.props.camID)}>Kick</button>
              </div>
          </div>
            <video autoPlay={true} className={["cam " + this.props.camType + " " + this.state.camFilter]} id={this.props.camID}></video>
          </div>
        )
      }
      else {
        return (
          <div className={["camBox " + this.props.containerType]}>
          <div className="camHeader">
            <p>{this.props.camName}</p>
            <div className="buttonContainer">
              <img src={this.props.tickIcon} id={["tick" + this.props.iconID]}/>
              <img src={this.props.crossIcon} id={["cross" + this.props.iconID]}/>
            </div>
          </div>
            <video autoPlay={true} className={["cam " + this.props.camType + " " + this.state.camFilter]} id={this.props.camID}></video>
          </div>
        )
      }
  }
}

export default Cam;
