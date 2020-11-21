import React, { useContext } from 'react'
import {Link, useHistory} from 'react-router-dom';
import { UserContext } from '../App'

export default function Navbar() {
  const histroy = useHistory()
  const {state, dispatch} = useContext(UserContext)
  const renderList = () =>{
    if(state) {
      return [
        <li key={0}><Link to="/profile">Profile</Link></li>,
        <li key={1}><Link to="/createpost">Create Post</Link></li>,
        <li key={2}><Link to="/myfollowing">My following Post</Link></li>,
       <li key={3}><button onClick={()=>{localStorage.clear(); dispatch({type:"CLEAR"}); histroy.push("/login")}} className="waves-effect waves-light btn">Login Out</button></li>
      ]
    }
    else {
      return [
        <li key={0}><Link to="/login">login</Link></li>,
        <li key={1}><Link to="/signup">sign up</Link></li>
      ]
    }
  }
  return (
    <nav>
    <div className="nav-wrapper white">
      <Link to={state? "/": "/login"} className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        {renderList()}
      </ul>
    </div>
  </nav>
  )
}
