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
              else {
                return (
                  <form className="deletePollForm" method="POST" action="/deletePoll">
                    <button name="pollCode" value={item[keyItem]} onClick={this.props.deletePoll}>X</button>
                  </form>
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
