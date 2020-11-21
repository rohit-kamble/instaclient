import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from './../App'
import {Link} from 'react-router-dom'

export default function SubscribePost() {
  const {state, dispatch} = useContext(UserContext);
  const [data, setData] = useState([])

  useEffect(()=>{
    fetch('https://newinsta.vercel.app/getSubPost', {
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json"
      },
    })
    .then(res=>res.json())
    .then(res=>{
      console.log("res**", res)
      setData(res.posts)
    })
  },[])

  const makeComment =(text, postId, name)=>{
    console.log("text**", text)
    console.log("postId**", postId)
    console.log("name**", name)
    fetch('https://newinsta.vercel.app/comment', {
      method: "put",
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        postId,
        text,
        name,
      })
    })
    .then(res=>res.json())
    .then(res=>{
      console.log("chacek res**", res)
      const newData = data.map(item=>{
        console.log(item.posts_id === res._id)
        if(item._id === res._id){
          return res
        }
        else {
          return item
        }
      })
      setData(newData)
    })
    .catch(err=>console.log(err))
  }

  const likePost = (id)=>{
    fetch("https://newinsta.vercel.app/like",{
      method: "put",
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        postId: id
      })
    })
    .then(res=>res.json())
    .then(res=>{
      const newData = data.map(item=>{
        if(item._id === res._id){
          return res
        }
        else {
          return item
        }
      })
      setData(newData)
    })
    .catch(err=>console.log(err))
  }

  const unlikePost = (id)=>{
    fetch("https://newinsta.vercel.app/unlike",{
      method: "put",
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        postId: id
      })
    })
    .then(res=>res.json())
    .then(res=>{
      const newData = data.map(item=>{
        if(item._id === res._id){
          return res
        }
        else {
          return item
        }
      })
      setData(newData)
      }
    ).catch(err=>console.log(err))
  }

  const deletPost= (postId)=>{
    fetch(`https://newinsta.vercel.app/deletepost/${postId}`,{
      method: "delete",
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt")
      },
    })
    .then(res=>res.json())
    .then(result=>{
      const newData = data.filter(item=>{
        console.log("item**", item)
        console.log("data**", data)
        return item._id !== result._id
      })
      setData(newData)
    })
  }

  const deleteComment = (commentId, id) => {
    fetch(`https://newinsta.vercel.app/deletecomment/${id}/${commentId}`,{
      method: "delete",
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt")
      },
    })
    .then(res=>res.json())
    .then(result=>{
      console.log("result**", result)
      const newData = data.map((item) => {
        if(item._id === result._id) {
          return result
        }
        else {
          return item;
        }
      })
      setData(newData)
    })
  }

  return (
    <div>
      {console.log("data**", data)}
    {!!data && data.map((item,i)=>{

      const {photo, body, title, postedBy, comments, _id} = item;
      console.log("state", state)
      return (
        <div key={i} className="home-card">
          <div className="card card-center">
          <div className="card-content">
          <h6 className="left"><Link to={postedBy._id !== state._id ? `/profile/${postedBy._id}`: `/profile`}>{postedBy.name}</Link></h6>
              {postedBy._id == state._id &&
                 <i className="material-icons right" style={{color: "black", display:'block', cursor:"pointer"}}
                 onClick={()=>deletPost(_id)}
                 >deleter</i>
              }
            </div>
            <div className="card-image">
             {photo && <img src={photo} style={{margin: '0 auto'}}/>}
            </div>
            <div className="card-content">
            {/* <i className="material-icons left" style={{color: "black", display:'block'}}>favorite</i> */}
              {item.likes.includes(state._id)?<i className="material-icons left" style={{color: "black", display:'block', cursor:"pointer"}}
                  onClick={()=>unlikePost(item._id)}
                >favorite</i>: <i className="material-icons left" style={{color: "black", display:'block', cursor:"pointer"}}
                onClick={()=>likePost(item._id)}
              >favorite_border</i>}
            </div>
            <div className="card-content">
              <h6 className="left">{item.likes.length} likes</h6>
            </div>
            <div className="card-content">
              <h6 className="left">{title}</h6>
            </div>
            <div className="card-content">
              <p className="left">{body}</p>
            </div>
            {!!comments && comments.map(record=>{
              console.log("record**", record)
                  return(
                    <div className="card-content" key={i}>
                      <h6 className="left"><span style={{fontWeight: 'bold'}}>@{record.name} </span>{record.text}</h6>
                      {record.postedBy._id === state._id && <i className="material-icons right" style={{color: "black", display:'block', cursor:"pointer"}} onClick={()=>{deleteComment(record._id, _id)}}>deleter</i>}
                  </div>
                  )
                })
            }
            <form onSubmit={(e)=>{e.preventDefault();makeComment(e.target[0].value, item._id, state.name)}}>
              <div className="card-content">
                <input type="text" placeholder="add comment"/>
              </div>
            </form>
          </div>
        </div>
      )
    })}
  </div>
  )
}
