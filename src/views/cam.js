import React, { Component } from 'react';
import main_img from '../assets/main.jpg';
import unmute from '../assets/icon_unmute.png';
import mute from '../assets/icon_mute.png';
import icon_video from '../assets/icon_video.png'
import icon_novideo from '../assets/icon_novideo.png'

class Cam extends Component {

  constructor(props) {
    super(props);

    this.state = {
      camFilter : "camBlurred",
      muteIcon : unmute,
      videoIcon : icon_novideo
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
                <button onClick={this.toggleFilter} className="toggleButton">
                  <img src={this.state.videoIcon} />
                </button>
                <button onClick={this.toggleMute} className="toggleButton">
                  <img src={this.state.muteIcon} />
                </button>
            </div>
          </div>
            <video autoPlay={true} className={["cam " + this.props.camType + " " + this.state.camFilter]} id={this.props.camID}></video>
          </div>
        )
      }
      else {
        return (
          <div className={["camBox " + this.props.containerType]}>
            <p>{this.props.camName}</p>
            <video autoPlay={true} className={["cam " + this.props.camType + " " + this.state.camFilter]} id={this.props.camID}></video>
          </div>
        )
      }
  }
}

export default Cam;
