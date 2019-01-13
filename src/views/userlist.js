import React, { Component } from 'react';

class UserList extends Component {

  render() {
    return (
      <div className="horcent">
        <ul>
        <div className="userListHead">
          <p className="userListText">Display Name</p>
          <p className="userListText">username</p>
          <p className="userListText">Password</p>
        </div>
        {this.props.list.map((item,index) => {
          return (
            <div key={index} className="userListItem">
              <p className="userListText">{item.displayname}</p>
              <p className="userListText">{item.username}</p>
              <p className="userListText">{item.password}</p>
              <button name="deleteUser" className="deleteUserBtn">X</button>
            </div>
          )
        })}
        </ul>
      </div>
    );
  }
}

export default UserList;
