import React, { Component } from 'react';
import main_img from '../assets/main.jpg';

import unmute from '../assets/icon_unmute.png';
import mute from '../assets/icon_mute.png';
import icon_video from '../assets/icon_video.png'
import icon_novideo from '../assets/icon_novideo.png'

import CamHeader from './camHeader.js'
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
    if(nextProps.allMuted != this.props.allMuted) {
      if(nextProps.allMuted == true) {
        this.setState({muteIcon : mute})
      }
      else {
        this.setState({muteIcon : unmute});
      }
    }

    if(nextProps.allBlurred != this.props.allBlurred) {
      if(nextProps.allBlurred == true) {
        this.setState({camFilter : "camBlurred"});
        this.setState({videoIcon : icon_novideo});
      }
      else {
        this.setState({camFilter : "camNotBlurred"})
        this.setState({videoIcon : icon_video});
      }
    }
  }

  toggleFilter(event) {
    //this.state.camFilter == "camBlurred" ? this.setState({camFilter : "camNotBlurred"}) : this.setState({camFilter : "camBlurred"})
    if(this.state.camFilter == "camBlurred") {
      this.setState({camFilter : "camNotBlurred"})
    }
    else {
      this.setState({camFilter : "camBlurred"})
    }
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
          return(
            <div className={["camBox " + this.props.containerType]}>
            <CamHeader
            tickIcon={this.props.tickIcon}
            crossIcon={this.props.crossIcon}
            iconID={this.props.iconID}
            camName={this.props.camName}
            userType={this.props.userType}
            camType={this.props.camType}
            videoIcon={this.state.videoIcon}
            muteIcon={this.state.muteIcon}
            toggleFilter={this.toggleFilter}
            toggleMute={this.toggleMute}
            kickUser={(camID) => this.props.kickUser(camID)}
            camID={this.props.camID}
            />
              <video autoPlay={true} className={["cam " + this.props.camType + " " + this.state.camFilter]} id={this.props.camID}></video>
            </div>
          )
  }
}

export default Cam;
