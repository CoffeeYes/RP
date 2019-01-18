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
            <form key={index} className="userListItem">
              <input className="userListText" value={item.displayname} name="displayname"/>
              <input className="userListText" value={item.username} name="username"/>
              <input className="userListText" value={item.password} name="password"/>
              <button name="deleteUser" type="submit" className="deleteUserBtn" onClick={this.props.deleteUser}>X</button>
            </form>
          )
        })}
        </ul>
      </div>
    );
  }
}

export default UserList;
