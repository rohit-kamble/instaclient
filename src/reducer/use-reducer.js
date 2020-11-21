export const reducer = (state, action)=>{
  if(action.type === "USER")
  {
    return action.payload
  }
  if(action.type === "CLEAR")
  {
    return null
  }
  if(action.type === "UPDATEPIC"){
    console.log("userReducer**", state)
    console.log("action.payload**", action.payload)
    return {
      ...state,
      pic: action.payload.pic
    }
  }
  if(action.type === "UPDATE")
  {
    console.log("action**", action)
    return {
      ...state,
      followers: action.payload.followers,
      following: action.payload.following
    }
  }
  return state
}
export const initialState =   JSON.parse(localStorage.getItem('user'))