import React, { Component } from 'react';

class pollList extends Component {

  componentWillMount() {
    this.props.getAllPolls()
  }

  render() {
    return (
      <div className="pollContainer">
      {this.props.pollsData.map((item,index) => {
        let sumVote = 0;
        for(var vote in Object.keys(item)) {
          sumVote += Object.keys(item)[vote];
        }
        return (
          <div className="pollItem">
            {Object.keys(item).map((keyItem,keyIndex) => {
              if(keyItem != "code") {
                return(
                  <p className="pollChoice">{keyItem} : {item[keyItem]} ({(item[keyItem] == 0 ? 0 : item[keyItem] / sumVote)} %)</p>
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
