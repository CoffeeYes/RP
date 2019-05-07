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
            <button onClick={this.toggleFilter} className="filterButton"> B </button>
            <video autoPlay={true} className={["cam " + this.props.camType + " " + this.state.camFilter]} id={this.props.camID}></video>
          </div>
        )
      }
      else {
        return (
          <div className={["camBox" + this.props.containerType]}>
            <p>{this.props.camName}</p>
            <video autoPlay={true} className={["cam " + this.props.camType + " " + this.state.camFilter]} id={this.props.camID}></video>
          </div>
        )
      }
  }
}

export default Cam;
