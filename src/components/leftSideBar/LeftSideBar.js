import React, {Component} from "react";
import "./LeftSideBar.scss";
import {connect} from 'react-redux';
import icHome from "../../public/images/icons/ic_home.png";
import icReport from "../../public/images/icons/ic_report.png";
import icRoom from "../../public/images/icons/ic_room.png";
import icService from "../../public/images/icons/ic_service.png";

class LeftSideBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentPage: ""
        }
    }

    handleLogOut = () => {
        this.props.dispatch(userActions.logout());
    };

    handleRedirectPage = (nextPage) => {
        this.setState({
            currentPage: nextPage
        })
        this.props.history.push(nextPage);
    }

    render() {
        const urlPage = window.location.pathname.toLowerCase();
        const page = localStorage.getItem("page");
        return (
            <div className="left-side-bar">
                <div>
                    <div onClick={(e) => this.handleRedirectPage("/Home")}
                         className={urlPage === "/home" ? "item-menu selected" : "item-menu"}>
                        <img src={icHome}/>
                        <span className="menu">Home</span>
                        <hr/>
                    </div>
                    <div onClick={(e) => this.handleRedirectPage("/Room")}
                         className={urlPage === "/room" ? "item-menu selected" : "item-menu"}>
                        <img src={icRoom}/>
                        <span className="menu">Room</span>
                        <hr/>
                    </div>
                    <div onClick={(e) => this.handleRedirectPage("/Service")}
                         className={urlPage === "/service" ? "item-menu selected" : "item-menu"}>
                        <img src={icService}/>
                        <span className="menu">Service</span>
                        <hr/>
                    </div>
                    <div onClick={(e) => this.handleRedirectPage("/Report")}
                         className={urlPage === "/report" ? "item-menu selected" : "item-menu"}>
                        <img src={icReport}/>
                        <span className="menu">Report</span>
                    </div>


                    <div className={urlPage === "/service" ? "item-menu selected" : "item-menu"}>
                        <div className="item-menu" id="dropdownMenuButton" style={{textAlign: 'center'}}
                             data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src={icReport}/>
                            <span className="menu">Config</span>
                        </div>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="/RoomsCatalog">Rooms Catalog</a>
                            <a className="dropdown-item" href="/HomeCatalog">Home Catalog</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideBar);