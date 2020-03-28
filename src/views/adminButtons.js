import React, { Component } from 'react';

class AdminButtons extends Component {
  constructor(props) {
    super(props)

    this.state = {
      buttonContainerClasses : "",
      hideButtontext : "▾"
    }
  }

  toggleHideButtonContainer = () => {
    if(this.state.buttonContainerClasses == "hidden") {
      this.setState({buttonContainerClasses : "",
                     hideButtontext : "▾"})
    }
    else {
      this.setState({buttonContainerClasses : "hidden",
                     hideButtontext : "▴"})
    }
  }
  render() {
    if(this.props.mode == "king of the hill") {
      return (
        <div className="buttonsContainer-koth">
          <button onClick={this.props.swapContestants} className="adminButton blackButton kothButton">Swap</button>
          <button onClick={this.props.muteAll} className="adminButton blackButton kothButton">Mute All</button>
          <button onClick={this.props.unmuteAll} className="adminButton blackButton kothButton">Unmute All</button>
          <button onClick={this.props.blurAll} className="adminButton blackButton kothButton">Blur All</button>
          <button onClick={this.props.unblurAll} className="adminButton blackButton kothButton">Unblur All</button>
          <button onClick={this.props.resetAll} className="adminButton blackButton kothButton">Reset Votes</button>
        </div>
      );
    }
    else if (this.props.mode == "bachelor") {
      return (
        <div className="buttonAndHideContainer">
          <button className="hideButtonContainer blackButton" onClick={this.toggleHideButtonContainer}>{this.state.hideButtontext}</button>
          <div className={["buttonsContainer-bachelor " + this.state.buttonContainerClasses]} onClick={this.hideAdminButtons}>
              <button onClick={this.props.muteAll} className="adminButton blackButton bachelorButton">Mute All</button>
              <button onClick={this.props.unmuteAll} className="adminButton blackButton bachelorButton">Unmute All</button>
              <button onClick={this.props.blurAll} className="adminButton blackButton bachelorButton">Blur All</button>
              <button onClick={this.props.unblurAll} className="adminButton blackButton bachelorButton">Unblur All</button>
          </div>
        </div>
      );
    }
  }
}

export default AdminButtons;
