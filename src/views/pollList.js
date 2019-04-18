import React, { Component } from 'react';

class pollList extends Component {

  componentDidMount() {
    this.props.getAllPolls()
  }

  render() {
    return (
      <div className="pollContainer">
      {this.props.pollsData.map((item,index) => {
        //calculate total number of votes
        let sumVote = 0;
        for(var vote in Object.keys(item)) {
          if(Object.keys(item)[vote] != 'code') {
            sumVote += item[Object.keys(item)[vote]];
          }
        }
        return (
          <div className="pollItem" key={index}>
            {Object.keys(item).map((keyItem,keyIndex) => {
              if(keyItem != "code") {
                return(
                  <p className="pollChoice" key={keyIndex}>{keyItem} : {item[keyItem]} ({(item[keyItem] == 0 ? 0 : (item[keyItem] / sumVote) * 100)} %)</p>
                )
              }
              else {
                return (
                  <div key={keyIndex}>
                    <p className="pollChoice">Code : {item[keyItem]}</p>
                    <form className="deletePollForm" method="POST" action="/deletePoll">
                      <button name="pollCode" value={item[keyItem]} onClick={this.props.deletePoll}>X</button>
                    </form>
                  </div>
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
