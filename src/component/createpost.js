import React, { useState, useEffect } from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'

export default function Createpost() {
  const history = useHistory();
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl]= useState("")

  useEffect(() => {
    url && postAdded();
  }, [url])

  const postData = () => {
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "insta-clone")
    data.append("clone_name", "dabbudx0x")
    fetch('https://api.cloudinary.com/v1_1/dabbudx0x/image/upload',{
      method: "post",
      body: data
    } )
    .then(res=>res.json())
    .then(data=>{console.log("data***", data); setUrl(data.url)})
  }

  const postAdded =()=>{
    fetch('https://newinsta.vercel.app/cretaepost', {
      method: "post",
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        body,
        photo: url,
      })
    })
    .then(res=>res.json())
    .then(res=>{
      console.log("res**", res)
      if(res.error){
        M.toast({html: res.error, classes:"red"})
      }
      else {
        M.toast({html:"post added successfully", classes: "green"})
        history.push("/")
      }
    })
  }
  return (
    <div className="card input-filed"
    style={{
      margin: "30px auto",
      maxWidth: "500px",
      padding: "20px",
      textAlign: "center"
    }}>
      <input
      type="text"
      value= {title}
      onChange={(e)=>setTitle(e.target.value)}
      placeholder="title"
      />
      <input
      type="text"
      value= {body}
      onChange={(e)=>setBody(e.target.value)}
      placeholder="body"
      />
    <div className="file-field input-field">
      <div className="btn">
        <span>upload image</span>
        <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
      </div>
    </div>
    <button
    onClick={()=>postData()}
    className="waves-effect waves-light btn-small"
    >Submit Post</button>
    </div>

  )
}
