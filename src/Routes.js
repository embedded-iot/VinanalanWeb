import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import HeaderAdmin from './components/header/HeaderAdmin'
import LeftSideBar from './components/leftSideBar/LeftSideBar'
import {
    PageNotFound,
    Login,
    Register,
    ForgotPW,
    HomeCatalog,
    RoomsCatalog,
    Rooms,
    RoomDetail,
    BookRoom,
    ReportManament
} from './pages';

import {
    Home
} from "./pages/admins";

import {PrivateRoute, NotRequireLogin, RequireLogin} from './components/commons';

const Routes = () => {
    return (
        <Router>
            <div id="content">
                <HeaderAdmin/>
                <LeftSideBar/>
                <div className="content-container">
                    <Switch>
                        <Route exact path="/Login" component={Login}/>
                        <Route path="/Register" component={Register}/>
                        <Route path="/ForgotPw" component={ForgotPW}/>

                        <Route exact path="/" component={Home}/>
                        <Route exact path="/Home" component={Home}/>

                        <Route exact path="/HomeCatalog" component={HomeCatalog}/>
                        <Route exact path="/RoomsCatalog" component={RoomsCatalog}/>

                        <Route exact path="/Room" component={Rooms}/>
                        <Route exact path="/RoomDetail/:roomId" component={RoomDetail}/>
                        <Route exact path="/BookRoom/:roomId" component={BookRoom}/>

                        <Route exact path="/Report" component={ReportManament}/>


                        <Route component={PageNotFound}></Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default Routes;