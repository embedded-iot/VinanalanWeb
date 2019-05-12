import React, { Component } from "react";
import "./LeftSideBar.scss";
import { NavLink, Route, withRouter} from 'react-router-dom';
import { FormattedMessage } from "react-intl";
import logo_vinaland from "../../public/images/icons/logo.png";

const STRINGS = {
  HOME: <FormattedMessage id="HOME" />,
  ROOM: <FormattedMessage id="ROOM" />,
  REPORT: <FormattedMessage id="REPORT" />,
  CONFIG: <FormattedMessage id="CONFIG" />,
  HOME_CATALOG: <FormattedMessage id="HOME_CATALOG" />,
  ROOM_CATALOG: <FormattedMessage id="ROOM_CATALOG" />,
  USERS_MANAGE: <FormattedMessage id="USERS_MANAGE" />,
  TYPES_OFF_HOME_CATALOGS: <FormattedMessage id="TYPES_OFF_HOME_CATALOGS" />,
  TYPES_OFF_ROOM_CATALOGS: <FormattedMessage id="TYPES_OFF_ROOM_CATALOGS" />,
  INCOME_UTILITIES: <FormattedMessage id="INCOME_UTILITIES" />,
  USERS: <FormattedMessage id="USERS" />,
  OUTCOME_UTILITIES: <FormattedMessage id="OUTCOME_UTILITIES" />,
  OUT_FURNITURES: <FormattedMessage id="OUT_FURNITURES" />,
  ROOM_UTILITIES: <FormattedMessage id="ROOM_UTILITIES" />,
  IN_FURNITURES: <FormattedMessage id="IN_FURNITURES" />,
  EXTRA_FEES: <FormattedMessage id="EXTRA_FEES" />
};


const Settings = (props) => {
  let menuConfig = [
    { pathName: "/Users", name: STRINGS.USERS },
    { pathName: "/HomeCatalog", name: STRINGS.TYPES_OFF_HOME_CATALOGS },
    { pathName: "/RoomsCatalog", name: STRINGS.TYPES_OFF_ROOM_CATALOGS },
    { pathName: "/IncomeUtilities", name: STRINGS.INCOME_UTILITIES },
    { pathName: "/OutcomeUtilities", name: STRINGS.OUTCOME_UTILITIES },
    { pathName: "/OutFurnitures", name: STRINGS.OUT_FURNITURES },
    { pathName: "/RoomUtilities", name: STRINGS.ROOM_UTILITIES },
    { pathName: "/InFurnitures", name: STRINGS.IN_FURNITURES },
    { pathName: "/ExtraFees", name: STRINGS.EXTRA_FEES }
  ];

  return (
    <div>
      {
        menuConfig.map(item=> (
          <NavLink key={item.pathName} to={'/Settings' + item.pathName} className='menu-item sub-menu' activeClassName='selected'>{item.name}</NavLink>
        ))
      }
    </div>
  )
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
    { pathName: "/Home", name: "Tòa nhà" },
    { pathName: "/Room", name: "Phòng" },
    { pathName: "/Reservations", name: "Đặt phòng" }
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
            <NavLink key={index} to={item.pathName} className='menu-item' activeClassName='selected'>{item.name}</NavLink>
          ))}
          <div className="menu-divider" />
          <NavLink to='/Settings/Users' className='menu-item'>Cấu hình</NavLink>
          <Route path="/Settings" component={Settings} />
        </div>
      </div>
    );
  }
}

export default withRouter(LeftSideBar);
