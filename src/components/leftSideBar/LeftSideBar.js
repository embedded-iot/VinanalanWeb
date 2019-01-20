import React, {Component} from "react";
import "./LeftSideBar.scss";
import {connect} from 'react-redux';
import icHome from "../../public/images/icons/ic_home.png";
import icReport from "../../public/images/icons/ic_report.png";
import icRoom from "../../public/images/icons/ic_room.png";
import icSetting from "../../public/images/icons/menu-setting-icon-158259.png";
import icService from "../../public/images/icons/ic_service.png";
import {Link} from 'react-router-dom';

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

    render() {
        const urlPage = window.location.pathname.toLowerCase();
        const page = localStorage.getItem("page");
        return (
            <div className="left-side-bar">
                <div>
                    <Link to="/Home" className={urlPage === "/home" ? "item-menu selected" : "item-menu"}>
                        <img src={`/${icHome}`}/>
                        <span className="menu">Home</span>
                        <hr/>
                    </Link>

                    <Link to="/Room"
                         className={urlPage === "/room" ? "item-menu selected" : "item-menu"}>
                        <img src={`/${icRoom}`}/>
                        <span className="menu">Room</span>
                        <hr/>
                    </Link>
                    {/*<div onClick={(e) => this.handleRedirectPage("/Service")}*/}
                         {/*className={urlPage === "/service" ? "item-menu selected" : "item-menu"}>*/}
                        {/*<img src={icService}/>*/}
                        {/*<span className="menu">Service</span>*/}
                        {/*<hr/>*/}
                    {/*</div>*/}
                    <Link to="/Report"
                         className={urlPage === "/report" ? "item-menu selected" : "item-menu"}>
                        <img src={`/${icReport}`}/>
                        <span className="menu">Report</span>
                        <hr/>
                    </Link>

                    <div className={urlPage === "/service" ? "item-menu selected" : "item-menu"}>
                        <div className="item-menu" id="dropdownMenuButton" style={{textAlign: 'center'}}
                             data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src={`/${icSetting}`}/>
                            <span className="menu">Config</span>
                        </div>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <Link className="dropdown-item" to="/RoomsCatalog">Rooms Catalog</Link>
                            <Link className="dropdown-item" to="/HomeCatalog">Home Catalog</Link>
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