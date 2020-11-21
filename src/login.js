import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from './App'

export default function Login() {
  const {state, dispatch} = useContext(UserContext);
  const history = useHistory()
  const [password, setPass] = useState("");
  const [email, setEmail] = useState("");
  const Postdata = () => {
    fetch("https://newinsta.vercel.app/signin",{
      method: "post",
      headers: {
        "content-Type": "application/json"
      },
      body: JSON.stringify({
        password,
        email,
      })
    })
    .then(res=>res.json())
    .then(res=>{
      if(res.error)
      {
        M.toast({html: res.error})
      }
      else {
        localStorage.setItem("jwt", res.token)
        localStorage.setItem("user", JSON.stringify(res.user))
        dispatch({type:"USER", payload: res.user})
        M.toast({html: "signed sucess", classes:"green"})
        history.push('/')
      }
    })
  }
  return (
    <div className="center">
      <div className="container">
        <h1>Login</h1>
        <div className="input-field">
        <input
          type="text"
          value= {email}
          onChange={(e)=>setEmail(e.target.value)}
         />
          <label for="autocomplete-input">Email</label>
        </div>
        <div className="input-field">
        <input
          type="password"
          value= {password}
          onChange={(e)=>setPass(e.target.value)}
         />
          <label for="autocomplete-input">password</label>
        </div>
        <button onClick={()=>Postdata()} className="waves-effect waves-light btn">Login in</button>
        <h5>
          <Link to="/signup">dont have an account</Link>
        </h5>
      </div>
    </div>
  )
}
