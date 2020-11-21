import React, {useEffect, useState, useContext} from 'react'
import {UserContext} from "./App"

export default function Profile() {
  const [mypic, setMypic] = useState([])
  const [isUpdtae, canShowUpdatePic] = useState(false)
  const [uploadedImage, setUploadImage] = useState("");
  const {state, dispatch} = useContext(UserContext);
console.log("state*%%%*", state)
console.log("mypic*%%%*", mypic)
  useEffect(()=>{
    fetch('https://newinsta.vercel.app/mypost',
    {
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json"
      },
    })
    .then(res=>res.json())
    .then(res=>setMypic(res.mypost))
  },[])

  useEffect(()=>{
    if(isUpdtae === true){
       uploadPic()
    }
  },[uploadedImage])

  const uploadPic =  (file) => {
    const data =  new FormData()
    data.append("file", uploadedImage)
    data.append("upload_preset", "insta-clone")
    data.append("clone_name", "dabbudx0x")
    fetch('https://api.cloudinary.com/v1_1/dabbudx0x/image/upload',{
      method: "post",
      body: data
    } )
    .then(res=>res.json())
    .then(data=> {
      fetch('https://newinsta.vercel.app/updatedpic',{
        method: "put",
        headers: {
          "Authorization": "Bearer "+localStorage.getItem("jwt"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pic: data.url
        })
      }).then(res=>res.json())
      .then(result=>{
        console.log("result**", result)
        dispatch({type: "UPDATEPIC", payload: result.pic})
        setUploadImage(result.pic)
        canShowUpdatePic(false)
      })
    })
  }

  return (typeof(state) === "object" &&
    <div className="container" style={{margin: '1rem auto'}}>
      {console.log("underState***", state)}
      <div className="row">
       {(state || uploadedImage ) && <div className="col l6 s12">
          <img style={{width:"160px", height:"160px", borderRadius: "80px"}}
            src={(uploadedImage || state.pic)}/>
        </div>
        }
        <div className="col l6 s12">
        {state && <h1>{state.name}</h1>}
         {state && <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h6>{mypic.length} post</h6>
            <h6>{state.followers.length} follower</h6>
            <h6>{state.following.length} following</h6>
          </div>
          }
        </div>
      </div>
      {isUpdtae ?
        <div className="file-field input-field">
        <div className="btn">
          <span>upload Pic</span>
          <input type="file" onChange={(e)=>setUploadImage(e.target.files[0])}/>
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text"/>
        </div>
      </div>
      :
      <button className="waves-effect waves-light btn" onClick={()=>canShowUpdatePic(true)} >updated Profile pic</button>
      }
      <div className="photo-gallery">
        {mypic.map((item,i)=>{
          return (
            <img style={{width:'260px', height:"300px", padding:"10px"}} key={i} src={item.photo} alt={item.title}/>
          )
        })}
      </div>
    </div>
  )
}
