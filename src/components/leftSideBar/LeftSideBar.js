import React, { Component } from "react";
import "./LeftSideBar.scss";
import { connect } from 'react-redux';
import icHome from "../../public/images/icons/ic_home.png";
import icReport from "../../public/images/icons/ic_report.png";
import icRoom from "../../public/images/icons/ic_room.png";
import icSetting from "../../public/images/icons/menu-setting-icon-158259.png";
import icService from "../../public/images/icons/ic_service.png";
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    HOME: <FormattedMessage id="HOME" />,
    ROOM: <FormattedMessage id="ROOM" />,
    REPORT: <FormattedMessage id="REPORT" />,
    CONFIG: <FormattedMessage id="CONFIG" />,
    HOME_CATALOG: <FormattedMessage id="HOME_CATALOG" />,
    ROOM_CATALOG: <FormattedMessage id="ROOM_CATALOG" />,
}

class LeftSideBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            urlPage: location.pathname
        }
    }

    handleLogOut = () => {
        this.props.dispatch(userActions.logout());
    };


    handleActive = (value) => {
        this.setState({ urlPage: value });
    }


    render() {
        let hideMenu = false;
        if (location.pathname === "/Login" || location.pathname === "/Register") {
            hideMenu = true;
        } else {
            hideMenu = false;
        }
        const { urlPage } = this.state;
        return (
            <div className={hideMenu ? "left-side-bar hide" : "left-side-bar"}>
                <div>
                    <Link to="/Home" className={urlPage === "/Home" || urlPage === "/" ? "item-menu selected" : "item-menu"}
                        onClick={() => this.handleActive("/Home")}>
                        <img src={icHome} />
                        <span className="menu">{STRINGS.HOME}</span>
                        <hr />
                    </Link>

                    <Link to="/Room" onClick={() => this.handleActive("/Room")}
                        className={urlPage === "/Room" ? "item-menu selected" : "item-menu"}>
                        <img src={icRoom} />
                        <span className="menu">{STRINGS.ROOM}</span>
                        <hr />
                    </Link>
                    {/*<div onClick={(e) => this.handleRedirectPage("/Service")}*/}
                    {/*className={urlPage === "/service" ? "item-menu selected" : "item-menu"}>*/}
                    {/*<img src={icService}/>*/}
                    {/*<span className="menu">Service</span>*/}
                    {/*<hr/>*/}
                    {/*</div>*/}
                    <Link to="/Report" onClick={() => this.handleActive("/Report")}
                        className={urlPage === "/Report" ? "item-menu selected" : "item-menu"}>
                        <img src={icReport} />
                        <span className="menu">{STRINGS.REPORT}</span>
                        <hr />
                    </Link>

                    <div className={urlPage === "/RoomsCatalog" || urlPage === "/HomeCatalog" ? "item-menu selected" : "item-menu"}>
                        <div className="item-menu" id="dropdownMenuButton" style={{ textAlign: 'center' }}
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src={icSetting} />
                            <span className="menu">{STRINGS.CONFIG}</span>
                        </div>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <Link className="dropdown-item" to="/RoomsCatalog" onClick={() => this.handleActive("/RoomsCatalog")}>{STRINGS.ROOM_CATALOG}</Link>
                            <Link className="dropdown-item" to="/HomeCatalog" onClick={() => this.handleActive("/HomeCatalog")}>{STRINGS.HOME_CATALOG}</Link>
                            <Link className="dropdown-item" to="/IncomeUtilities" onClick={() => this.handleActive("/IncomeUtilities")}>Tiện ích trong</Link>
                            <Link className="dropdown-item" to="/OutcomeUtilities" onClick={() => this.handleActive("/OutcomeUtilities")}>Tiện ích ngoài</Link>
                            <Link className="dropdown-item" to="/ExtraFees" onClick={() => this.handleActive("/ExtraFees")}>Các loại phí khác</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LeftSideBar;