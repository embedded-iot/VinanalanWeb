import React, { Component } from "react";
import "./LeftSideBar.scss";
import { withRouter } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import logo_vinaland from "../../public/images/icons/logo.png";

const STRINGS = {
  HOME: <FormattedMessage id="HOME" />,
  ROOM: <FormattedMessage id="ROOM" />,
  REPORT: <FormattedMessage id="REPORT" />,
  CONFIG: <FormattedMessage id="CONFIG" />,
  HOME_CATALOG: <FormattedMessage id="HOME_CATALOG" />,
  ROOM_CATALOG: <FormattedMessage id="ROOM_CATALOG" />
};

class LeftSideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      urlPage: location.pathname
    };
  }

  componentDidMount() {
    this.props.history.push(this.state.urlPage);
  }

  handleActive = value => {
    this.setState({ urlPage: value });
    this.props.history.push(value);
  };

  getClassNameLeftSideBar = () => {
    let classNameLeftSideBar = "left-side-bar";
    if (
      location.pathname === "/Login" ||
      location.pathname === "/Register" ||
      location.pathname === "/ForgotPW"
    ) {
      classNameLeftSideBar += " hide";
    }
    if (this.state.collapsed) {
      classNameLeftSideBar += " collapsed";
    }
    return classNameLeftSideBar;
  };

  menuList = [
    { pathName: "/Home", name: "Tòa nhà" }/*,
    { pathName: "/Rooms", name: "Phòng" }*/
  ];

  menuConfig = [
    { pathName: "/Users", name: "Quản lý tài khoản" },
    { pathName: "/RoomsCatalog", name: "Loại phòng" },
    { pathName: "/HomeCatalog", name: "Loại tòa nhà" },
    { pathName: "/IncomeUtilities", name: "Tiện ích trong tòa nhà" },
    { pathName: "/OutcomeUtilities", name: "Tiện ích ngoài tòa nhà" },
    { pathName: "/RoomUtilities", name: "Tiện ích phòng" },
    { pathName: "/InFurnitures", name: "Thiết bị phòng" },
    { pathName: "/OutFurnitures", name: "Thiết bị tòa nhà" },
    { pathName: "/ExtraFees", name: "Các loại phí khác" }
  ];

  render() {
    const { urlPage, collapsed } = this.state;
    return (
      <div className={this.getClassNameLeftSideBar()}>
        <div className="branch-box">
          <img className="ic-logo" src={logo_vinaland} />
        </div>
        <div className="menu-wrapper">
          {this.menuList.map((item, index) => (
            <div
              className={
                urlPage === item.pathName ? "menu-item selected" : "menu-item"
              }
              key={index}
              onClick={() => this.handleActive(item.pathName)}
            >
              {item.name}
            </div>
          ))}
          <div className="menu-divider" />
          {this.menuConfig.map((item, index) => (
            <div
              className={
                urlPage === item.pathName ? "menu-item selected" : "menu-item"
              }
              key={index}
              onClick={() => this.handleActive(item.pathName)}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(LeftSideBar);
