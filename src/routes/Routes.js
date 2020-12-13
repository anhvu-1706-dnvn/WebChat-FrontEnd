
import React from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { createBrowserHistory } from "history";
import LandingPage from 'screens/LandingPage/LandingPage';
import SignIn from 'screens/SignIn/SignIn';
import Register from 'screens/Register/Register';
import UIChat from 'screens/UIChat/UIChat';
import VideoChat from 'screens/VideoChat/VideoChat';
const history = createBrowserHistory();
const PrivateRoute = ({component, ...rest}) => {
  const token = localStorage.getItem('token');
  return (
    <Route {...rest} exact
    render = {(props) => (
      token ? (
        <div>
          {React.createElement(component, props)}
        </div>
      ) :
      (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    )}
    />
  )
}
export default function Routes() {
  return (
    <Router history = {history}>
      <Switch>
        <Route exact path = '/' component={LandingPage} />
        <Route  path = '/login' component={SignIn} />
        <Route  path = '/register' component={Register} />
        <PrivateRoute  path = '/chat' component={UIChat} />
        <PrivateRoute  path = '/video' component={VideoChat} />
      </Switch>
    </Router>
  )
}
