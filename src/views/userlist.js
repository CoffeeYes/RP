import React, { Component } from 'react';

class UserList extends Component {

  render() {
    return (
      <div className="horcent">
        <ul>
        {this.props.list.map((item,index) => {
          return (
            <li key={index}>{item.displayname} {item.username} {item.password}</li>
          )
        })}
        </ul>
      </div>
    );
  }
}

export default UserList;
