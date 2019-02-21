import React, { Component } from 'react';

class pollList extends Component {

  componentWillMount() {
    this.props.getAllPolls()
  }

  render() {
    return (
      <p>pollList</p>
    );
  }
}

export default pollList;
