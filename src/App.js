import React, { createContext, useReducer, useEffect, useContext } from 'react';
import Navbar from './component/navbar';
import './App.css';
import {BrowserRouter as Router, Route, Switch, useHistory} from 'react-router-dom';
import Home from './home';
import Login from './login';
import Signup from './signup';
import Profile from './profile';
import Createpost from './component/createpost'
import User from './component/user'
import SubscribePost from './component/subscribepost'
import {reducer, initialState} from './reducer/use-reducer'


export const UserContext = createContext()

const Routing=()=>{
  const history = useHistory();
  const { state, dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

        if(user) {
          dispatch({type: "USER", payload: user})
        }
        else {
          history.push('/login')
        }
  },[])
  return (
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route exact path="/profile" component={Profile}/>
      <Route path="/login" component={Login}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/createpost" component={Createpost}/>
      <Route path="/profile/:userId" component={User}/>
      <Route path="/myfollowing" component={SubscribePost}/>
  </Switch>
  )
}

function App() {
const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <Router>
        <Navbar/>
        <Routing/>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
