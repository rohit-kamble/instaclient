import React, {useEffect, useState, useContext} from 'react'
import {UserContext} from "./../App"
import {useParams} from 'react-router-dom'

export default function User() {
  const [userProfile, setUserProfile] = useState(null)
  const {state, dispatch} = useContext(UserContext)
  const {userId} = useParams()
  const [ showFollow, setShowFollow ] = useState(state ? !state.following.includes(userId) : true);

  useEffect(()=>{
    fetch(`https://newinsta.vercel.app/user/${userId}`,
    {
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json"
      },
    })
    .then(res=>res.json())
    .then(res=>{
      setUserProfile(res)
    })
  }, [] )

  const followUser = () => {
    fetch('https://newinsta.vercel.app/follow',{
      method: "put",
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        follower: userId
      })
    })
      .then(res=>res.json())
      .then(data=> {
        // console.log("data follow", data)
        dispatch({type: "UPDATE", payload: {following: data.following, followers: data.followers}})
        localStorage.setItem("user", JSON.stringify(data))
        setUserProfile((prvState)=>{
          return {
            ...prvState,
            user: {
              ...prvState.user,
              followers: [...prvState.user.followers, data._id]
            }
          }
        })
       setShowFollow(false)
      })
  }

  const unfollowUser = () => {
    fetch('https://newinsta.vercel.app/unfollow',{
      method: "put",
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("jwt"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        unfollowId: userId
      })
    })
      .then(res=>res.json())
      .then(data=> {
        // console.log("data unfollow**", data)
        dispatch({type: "UPDATE", payload: {following: data.following, followers: data.followers}})
        localStorage.setItem("user", JSON.stringify(data))

        setUserProfile((prvState)=>{
          const newFollower = prvState.user.followers.filter(item=> item !== data._id)
          return {
            ...prvState,
            user: {
              ...prvState.user,
              followers: newFollower
            }
          }
        })
        setShowFollow(true)
      })
  }

  return (userProfile?
    <div className="container" style={{margin: '1rem auto'}}>
      {console.log("userProfile***", userProfile)}
      <div className="row">
        <div className="col l6 s12">
          <img style={{width:"160px", height:"160px", borderRadius: "80px"}}
            src={userProfile ? userProfile.user.pic: 'loading...'}/>
        </div>
        <div className="col l6 s12">
          <h1>{userProfile.user.name}</h1>
          <h2>{userProfile.user.email}</h2>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h6>{userProfile.posts.length} post</h6>
            <h6>{userProfile.user.followers.length} follower</h6>
            <h6>{userProfile.user.following.length} following</h6>
          </div>
          {showFollow ?<button onClick={()=>followUser()} className="waves-effect waves-light btn">Follow</button>:
           <button onClick={()=>unfollowUser()} className="waves-effect waves-light btn">UnFollow</button>}


        </div>
      </div>
      <div className="photo-gallery">
        {userProfile.posts.map((item,i)=>{
          return (
            <img style={{width:'260px', height:"300px", padding:"10px"}} key={i} src={item.photo} alt={item.title}/>
          )
        })}
      </div>
    </div>
    :
    null
  )
}
