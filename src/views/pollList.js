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
            {Object.keys(item).map((keyItem,keyIndex) => {
              return(
                <p>{item[keyItem]}</p>
              )
            })}
          </div>
        )
      })}
      </div>
    );
  }
}

export default pollList;
