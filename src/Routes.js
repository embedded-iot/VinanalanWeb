import React from 'react';
import {BrowserRouter, HashRouter, Router, Route, Switch} from 'react-router-dom';
import {history} from '../src/helper';

import {
    PageNotFound,
    Login,
    Register,
    ForgotPW,
    HomeCatalog,
    RoomsCatalog,
    Rooms,
    RoomDetail,
    BookRoom
} from './pages';

import {
    Home
} from "./pages/admins";

import {PrivateRoute, NotRequireLogin, RequireLogin} from './components/commons';

export default () =>
    <Router history={history}>
        <Switch>
            <Route exact path="/Login" component={Login}/>
            <Route path="/Register" component={Register}/>
            <Route path="/ForgotPw" component={ForgotPW}/>

            <Route exact path="/HomeCatalog" component={HomeCatalog}/>
            <Route exact path="/RoomsCatalog" component={RoomsCatalog}/>
            <Route exact path="/Room" component={Rooms}/>
            <Route exact path="/RoomDetail/:roomId" component={RoomDetail}/>
            <Route exact path="/BookRoom/:roomId" component={BookRoom}/>

            <Route exact path="/" component={Home}/>
            <Route exact path="/Home" component={Home}/>

            <Route component={PageNotFound}></Route>
        </Switch>
    </Router>;