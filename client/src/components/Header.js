import React from 'react'
import { NavLink } from 'react-router-dom'
//<===== stateless component to display my header with home/ signin/ signup & welcome "user"
const Header = (props) => {
  const { context } = props;
  const authUser = context.authenticatedUser;
//<=========If authenticated user is signed in it will display a welcome message with their name 
  return (
    <div className="header">
      <div className="bounds">
        <h1 className="header--logo"><NavLink to="/">Courses</NavLink></h1>
        {authUser ?
        <nav>
          <span>Welcome, {authUser.firstName} {authUser.lastName}</span>
          <NavLink className="signout" to="/signout">Sign Out</NavLink>
        </nav> :
      <nav>
        <NavLink className="home" to="/">Home</NavLink>
        <NavLink className="signup" to="/signup">Sign Up</NavLink>
        <NavLink className="signin" to="/signin">Sign In</NavLink>
      </nav>
        }
    </div >
    </div>
)}
export default Header