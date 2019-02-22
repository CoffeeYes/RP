import React, { Component } from 'react';

class pollList extends Component {

  componentWillMount() {
    this.props.getAllPolls()
  }

  render() {
    return (
      <div className="pollContainer">
      {this.props.pollsData.map((item,index) => {
        return (
          <div className="pollItem">
            <p>poll</p>
          </div>
        )
      })}
      </div>
    );
  }
}

export default pollList;
