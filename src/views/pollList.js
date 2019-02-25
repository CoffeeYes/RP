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
              if(keyItem != "code") {
                return(
                  <p className="pollChoice">{keyItem} : {item[keyItem]}</p>
                )
              }
            })}
          </div>
        )
      })}
      </div>
    );
  }
}

export default pollList;
