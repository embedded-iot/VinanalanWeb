import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import * as UserServices from "../../pages/users/services/userService";

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    localStorage.getItem('user')
      ? UserServices.isHost() || UserServices.isAdmin() ? <Component {...props} /> : <Redirect to={{ pathname: '/welcome', state: { from: props.location } }} />
      : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
  )} />
)