import React, { Component } from 'react';
import main_img from '../assets/main.jpg';

import unmute from '../assets/icon_unmute.png';
import mute from '../assets/icon_mute.png';
import icon_video from '../assets/icon_video.png'
import icon_novideo from '../assets/icon_novideo.png'
import icon_expand from '../assets/icon_expand.png'

import CamHeader from './camHeader.js'
var camID;
class Cam extends Component {

  constructor(props) {
    super(props);

    this.state = {
      camFilter : "camBlurred",
      muteIcon : mute,
      videoIcon : icon_novideo,
      expandIcon : icon_expand,
      augmentClasses : "",
      highlighted : false,
    }

    this.toggleFilter = this.toggleFilter.bind(this);
  }

  //set cam filters based on user type
  componentDidMount() {
    if(this.props.userType !== "admin") {
      this.setState({camFilter : "camNotBlurred"})
    }

    camID = this.props.camID
  }

  //derive local state from parent prop for blurring/muting all cams
  static getDerivedStateFromProps = (nextProps,prevState) => {
    if(nextProps.allBlurred !== prevState.allBlurred) {
      return({allBlurred : nextProps.allBlurred})
    }
    else if(nextProps.allMuted !== prevState.allMuted) {
      return({allMuted : nextProps.allMuted})
    }
    else {
      return null
    }
  }

  componentDidUpdate = (prevProps,prevState) => {
    //if another cam has been highlighted add the hiddencam class to hide this cam component
    if(prevProps.hideOtherCams !== this.props.hideOtherCams) {
      if(this.state.highlighted === false) {
        if(prevProps.hideOtherCams === false) {
          this.setState({augmentClasses : "hiddenCam"})
        }
        else {
          this.setState({augmentClasses : ""})
        }
      }
    }

    //blur or unblur all cams based on derviedstate from parent prop allBlurred
    if(prevState.allBlurred !== this.state.allBlurred) {
      if(this.state.allBlurred === true) {
        this.setState({camFilter : "camBlurred",videoIcon : icon_novideo});
      }
      else {
        this.setState({camFilter : "camNotBlurred",videoIcon : icon_video})
      }
    }

    if(prevState.allMuted !== this.state.allMuted) {
      if(this.state.allMuted === true) {
        this.setState({muteIcon : mute})
        var video = document.querySelector("#" + this.props.camID)
          if(video) {
            video.muted = true
          }
      }
      else {
        this.setState({muteIcon : unmute});
        var video = document.querySelector("#" + this.props.camID)
        if(video) {
          video.muted = false
        }
      }
    }
  }

  toggleFilter(event) {
    //this.state.camFilter === "camBlurred" ? this.setState({camFilter : "camNotBlurred"}) : this.setState({camFilter : "camBlurred"})
    if(this.state.camFilter === "camBlurred") {
      this.setState({camFilter : "camNotBlurred"})
    }
    else {
      this.setState({camFilter : "camBlurred"})
    }
    //toggle icon
    this.state.videoIcon === icon_novideo ? this.setState({videoIcon : icon_video}) : this.setState({videoIcon : icon_novideo})
  }

  toggleMute = () => {
    var video = document.querySelector('#' + this.props.camID);
    video.muted =  !(video.muted)

    if(this.state.muteIcon === unmute) {
      this.setState({muteIcon : mute})
    }
    else {
      this.setState({muteIcon : unmute})
    }
  }

  toggleHighlightCam = () => {
    if(this.state.augmentClasses === "") {
      this.setState({augmentClasses : "highlight"})
      this.setState({highlighted : true})
    }
    else {
      this.setState({augmentClasses : ""})
      this.setState({highlighted : false})
    }

    this.props.toggleHideNonHighlightedCams()
  }

  //catch the kick function to change local component state then call parent function
  thisUserIsBeingKicked = (camID) => {
    this.props.kickUser(camID)

    if(this.state.highlighted === true) {
      this.setState({highlighted: false})
      this.setState({augmentClasses : ""})
    }
  }

  render() {
          return(
            <div className={["camBox " + this.props.containerType + " " + this.state.augmentClasses]}>
            <CamHeader
            tickIcon={this.props.tickIcon}
            crossIcon={this.props.crossIcon}
            iconID={this.props.iconID}
            camName={this.props.camName}
            userType={this.props.userType}
            camType={this.props.camType}
            videoIcon={this.state.videoIcon}
            muteIcon={this.state.muteIcon}
            expandIcon={this.state.expandIcon}
            toggleFilter={this.toggleFilter}
            toggleMute={this.toggleMute}
            kickUser={(camID) => this.thisUserIsBeingKicked(camID)}
            camID={this.props.camID}
            mode={this.props.mode}
            highlightCam={this.toggleHighlightCam}
            />
            <div className={["videoContainer" + " " + this.state.augmentClasses]}>
              <video autoPlay={true} className={["cam " + this.props.camType + " " + this.state.camFilter + " " + this.state.augmentClasses]} id={this.props.camID}></video>
            </div>
            </div>
          )
  }
}

export default Cam;
