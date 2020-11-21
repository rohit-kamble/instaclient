import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

export default function Signup() {
  const history = useHistory()
  const [name, setName] = useState("");
  const [password, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("")

  useEffect(() => {
    if(url) {
      allFiedls()
    }
  }, [url])

  const allFiedls = () => {
    fetch("https://newinsta.vercel.app/signup",{
      method: "post",
      headers: {
        "content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        password,
        email,
        pic: url
      })
    })
    .then(res=>res.json())
    .then(res=>{
      if(res.error)
      {
        M.toast({html: res.error})
      }
      else {
        M.toast({html: res.message, classes:"green"})
        history.push('/login')
      }
    })
  }


  const uploadPic =  () => {
    const data =  new FormData()
    data.append("file", image)
    data.append("upload_preset", "insta-clone")
    data.append("clone_name", "dabbudx0x")
    fetch('https://api.cloudinary.com/v1_1/dabbudx0x/image/upload',{
      method: "post",
      body: data
    } )
    .then(res=>res.json())
    .then(data=> {console.log("url***", data);setUrl(data.url); })
  }

  const Postdata = () => {
    if(image) {
      uploadPic()
    }
    else {
      allFiedls()
    }
  }


  return (
    <div className="center">
      <div className="container">
        <h1>Sign up</h1>
        <div className="input-field">
          <input
          type="text"
          value= {name}
          onChange={(e)=>setName(e.target.value)}
         />
          <label>username</label>
        </div>
        <div className="input-field">
          <input
          type="text"
          value= {email}
          onChange={(e)=>setEmail(e.target.value)}
         />
        <label>Email</label>
        </div>
        <div className="input-field">
          <input
          type="text"
          value= {password}
          onChange={(e)=>setPass(e.target.value)}
         />
        <label>password</label>
        </div>
        <div className="file-field input-field">
          <div className="btn">
            <span>upload Pic</span>
            <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text"/>
          </div>
        </div>
        <button className="waves-effect waves-light btn" onClick={()=>Postdata()}>Sign Up</button>
        <h5>
          <Link to="/login" >Alerady have an account ?</Link>
        </h5>
      </div>
    </div>
  )
}
