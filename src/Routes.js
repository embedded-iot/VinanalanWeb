import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import HeaderAdmin from './components/header/HeaderAdmin'
import LeftSideBar from './components/leftSideBar/LeftSideBar'
import ConfirmModal from "./components/confirmModal/ConfirmModal";
import AlertModal from "./components/AlertModal/AlertModal";
import { injectIntl, FormattedMessage } from 'react-intl';
import Loader from "./components/Progress/Progress";

import {
    PageNotFound,
    Login,
    Register,
    ForgotPW,
    HomeCatalog,
    RoomsCatalog,
    IncomeUtilities,
    OutcomeUtilities,
    Rooms,
    RoomDetail,
    BookRoom,
    ReportManament
} from './pages';

import {
    Home
} from "./pages/admins";

// import {PrivateRoute, NotRequireLogin, RequireLogin} from './components/commons';

const PrivateRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={(props) => (
            localStorage.getItem('user')
                ? <Component {...props} />
                : <Redirect to='/Login'/>
        )}/>
    )
}

const Protected = (props) => <div>
    <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/Home" component={Home}/>

        <Route exact path="/HomeCatalog" component={HomeCatalog}/>
        <Route exact path="/RoomsCatalog" component={RoomsCatalog}/>
        <Route exact path="/IncomeUtilities" component={IncomeUtilities}/>
        <Route exact path="/OutcomeUtilities" component={OutcomeUtilities}/>

        <Route exact path="/Room/:homeId" component={Rooms}/>
        <Route exact path="/Room" component={Rooms}/>
        <Route exact path="/RoomDetail/:roomId" component={RoomDetail}/>
        {/*<Route exact path="/Room/RoomDetail/:roomId" component={RoomDetail}/>*/}
        <Route exact path="/BookRoom/:roomId" component={BookRoom}/>
        {/*<Route exact path="/Room/BookRoom/:roomId" component={BookRoom}/>*/}

        <Route exact path="/Report" component={ReportManament}/>
        <PrivateRoute path="/protected" component={Protected}/>

        <Route component={PageNotFound}></Route>
    </Switch>
</div>

const Routes = (props) => {
    return (
        <Router>
            <div id="content">
                <Loader/>
                <AlertModal/>
                <ConfirmModal/>
                <HeaderAdmin/>
                <LeftSideBar/>
                <div className="content-container">
                    <Switch>
                        <Route exact path="/Login" component={Login}/>
                        <Route path="/Register" component={Register}/>
                        <Route path="/ForgotPw" component={ForgotPW}/>
                        <PrivateRoute component={Protected}/>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default injectIntl(Routes);