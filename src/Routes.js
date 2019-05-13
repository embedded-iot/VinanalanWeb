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
    Users,
    Homes,
    HomeCatalog,
    RoomsCatalog,
    RoomUtilities,
    IncomeUtilities,
    OutcomeUtilities,
    InFurnitures,
    OutFurnitures,
    ExtraFees,
    Rooms,
    RoomDetail,
    BookRoom,
    ReportManament
} from './pages';

import {
    Home,
    Reservations,
    HomeDetails,
    AddHome,
    AddRoom,
    HomeDetailsReservation,
    Rooms as RoomsNew
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
};

const Protected = (props) => <div>
    <Switch>
        <Route exact path="/" component={Homes}/>
        <Route exact path="/Home" component={Homes}/>
        <Route exact path="/HomeOld" component={Home}/>
        <Route exact path="/home/AddHome" component={AddHome}/>
        <Route exact path="/Home/:homeId/details" component={HomeDetails}/>
        <Route exact path="/Home/:homeId/:mode" component={AddHome}/>

        <Route exact path="/Reservations" component={Reservations}/>
        <Route exact path="/Reservations/:selectedStep" component={Reservations}/>
        <Route exact path="/Reservations/HomeDetails/:homeId" component={HomeDetailsReservation}/>

        <Route exact path="/Settings/Users" component={Users}/>
        <Route exact path="/Settings/HomeCatalog" component={HomeCatalog}/>
        <Route exact path="/Settings/RoomsCatalog" component={RoomsCatalog}/>
        <Route exact path="/Settings/RoomUtilities" component={RoomUtilities}/>
        <Route exact path="/Settings/IncomeUtilities" component={IncomeUtilities}/>
        <Route exact path="/Settings/OutcomeUtilities" component={OutcomeUtilities}/>
        <Route exact path="/Settings/InFurnitures" component={InFurnitures}/>
        <Route exact path="/Settings/OutFurnitures" component={OutFurnitures}/>
        <Route exact path="/Settings/ExtraFees" component={ExtraFees}/>

        <Route exact path="/Room" component={RoomsNew}/>
        <Route exact path="/Room/Details/:roomId/:mode" component={AddRoom}/>
        <Route exact path="/Room/Home/:homeId/:homeName" component={RoomsNew}/>
        <Route exact path="/Room/AddRoom" component={AddRoom}/>
        <Route exact path="/Room/AddRoom/:homeId" component={AddRoom}/>
        <Route exact path="/Rooms/:homeId" component={Rooms}/>
        <Route exact path="/Rooms" component={Rooms}/>
        <Route exact path="/RoomDetail/:roomId" component={RoomDetail}/>
        <Route exact path="/Room/RoomDetail/:roomId" component={RoomDetail}/>
        <Route exact path="/BookRoom/:roomId" component={BookRoom}/>
        <Route exact path="/Room/BookRoom/:roomId" component={BookRoom}/>

        <Route exact path="/Report" component={ReportManament}/>
        <PrivateRoute path="/protected" component={Protected}/>

        <Route component={PageNotFound}></Route>
    </Switch>
</div>;


const ContentWrapper = (props) =>{
    const { location } = props;
    console.log(location.pathname);
    const hideLeftMenu = location.pathname === '/Login';
    return (
      <div className={"content-container" + (hideLeftMenu ? ' hide-left-menu': '')}>
          <Switch>
              <Route exact path="/Login" component={Login}/>
              <Route path="/Register" component={Register}/>
              <Route path="/ForgotPw" component={ForgotPW}/>
              <PrivateRoute component={Protected}/>
          </Switch>
      </div>
    );
};

const Routes = (props) => {
    return (
        <Router>
            <div id="content">
                <Loader/>
                <AlertModal/>
                <ConfirmModal/>
                <HeaderAdmin/>
                <LeftSideBar/>
                <ContentWrapper location={location} />
            </div>
        </Router>
    );
}

export default injectIntl(Routes);