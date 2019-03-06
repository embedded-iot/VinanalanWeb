import React, { Component } from "react";
import "./LeftSideBar.scss";
import { connect } from 'react-redux';
import icHome from "../../public/images/icons/ic_home.png";
import icHomeActive from "../../public/images/icons/ic_home_active.png";
import icReport from "../../public/images/icons/ic_report.png";
import icRoom from "../../public/images/icons/ic_room.png";
import icSetting from "../../public/images/icons/ic_setting.png";
import icSettingActive from "../../public/images/icons/ic_setting_active.png";
import icService from "../../public/images/icons/ic_service.png";
import {Link, withRouter} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Menu, Icon, Button } from 'antd';

const SubMenu = Menu.SubMenu;

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
            collapsed: false,
            urlPage: '/Home'
        }
    }

    componentDidMount() {
        this.props.history.push("/Home");
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    handleLogOut = () => {
        this.props.dispatch(userActions.logout());
    };


    handleActive = (value) => {
        this.setState({urlPage: value})
        this.props.history.push(value);
    }

    getClassNameLeftSideBar = () => {
        let classNameLeftSideBar = 'left-side-bar';
        if (location.pathname === "/Login" || location.pathname === "/Register") {
            classNameLeftSideBar += ' hide';
        }
        if (this.state.collapsed) {
            classNameLeftSideBar += ' collapsed';
        }
        return classNameLeftSideBar;
    }
    render() {
        const { urlPage, collapsed } = this.state;
        const widthLeftMenu = collapsed ? "80px" : "290px";
        return (
          <div className={this.getClassNameLeftSideBar()} style={{width: widthLeftMenu}}>
              <div className="menu-content" style={{width: widthLeftMenu}}>
                  <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="light"
                    inlineCollapsed={this.state.collapsed}
                  >
                      <Menu.Item key="1" onClick={() => this.handleActive("/Home")}>
                          {/*<Icon type="pie-chart" />*/}
                          <span style={{marginRight: "10px"}}><img style={{ width: '21px', height: "20px" }} src={ urlPage === '/Home' ? icHomeActive : icHome} /></span>
                          <span>Tòa nhà</span>
                      </Menu.Item>
                      {/*<Menu.Item key="2">
                          <Icon type="desktop" />
                          <span>Option 2</span>
                      </Menu.Item>
                      <Menu.Item key="3">
                          <Icon type="inbox" />
                          <span>Option 3</span>
                      </Menu.Item>*/}
                      <SubMenu key="sub1" title={<span><img className="anticon anticon-inbox" style={{ width: '19px', height: "19px", marginRight: '15px'}} src={ urlPage !== '/Home' ? icSettingActive : icSetting} />
                      <span style={urlPage !== '/Home' ? { color: '#ffc001' }:{}}>Cấu hình</span></span>}>
                          <Menu.Item key="7"><Link className="dropdown-item" to="/Users" onClick={() => this.handleActive("/Users")}>Quản lý tài khoản</Link></Menu.Item>
                          <Menu.Item key="8"><Link className="dropdown-item" to="/RoomsCatalog" onClick={() => this.handleActive("/RoomsCatalog")}>Loại phòng</Link></Menu.Item>
                          <Menu.Item key="9"><Link className="dropdown-item" to="/HomeCatalog" onClick={() => this.handleActive("/HomeCatalog")}>Loại tòa nhà</Link></Menu.Item>
                          <Menu.Item key="10"><Link className="dropdown-item" to="/IncomeUtilities" onClick={() => this.handleActive("/IncomeUtilities")}>Tiện ích trong</Link></Menu.Item>
                          <Menu.Item key="11"><Link className="dropdown-item" to="/OutcomeUtilities" onClick={() => this.handleActive("/OutcomeUtilities")}>Tiện ích ngoài</Link></Menu.Item>
                          <Menu.Item key="12"><Link className="dropdown-item" to="/ExtraFees" onClick={() => this.handleActive("/ExtraFees")}>Các loại phí khác</Link></Menu.Item>
                      </SubMenu>
                  </Menu>
                 {/* <Button type="primary" className="button-collapsed" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                      <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                  </Button>*/}
              </div>

          </div>
        )
    }

    /*render() {
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
                    {/!*<div onClick={(e) => this.handleRedirectPage("/Service")}*!/}
                    {/!*className={urlPage === "/service" ? "item-menu selected" : "item-menu"}>*!/}
                    {/!*<img src={icService}/>*!/}
                    {/!*<span className="menu">Service</span>*!/}
                    {/!*<hr/>*!/}
                    {/!*</div>*!/}
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
                            <Link className="dropdown-item" to="/Users" onClick={() => this.handleActive("/Users")}>Quản lý tài khoản</Link>
                            <Link className="dropdown-item" to="/RoomsCatalog" onClick={() => this.handleActive("/RoomsCatalog")}>Loại phòng</Link>
                            <Link className="dropdown-item" to="/HomeCatalog" onClick={() => this.handleActive("/HomeCatalog")}>Loại tòa nhà</Link>
                            <Link className="dropdown-item" to="/IncomeUtilities" onClick={() => this.handleActive("/IncomeUtilities")}>Tiện ích trong</Link>
                            <Link className="dropdown-item" to="/OutcomeUtilities" onClick={() => this.handleActive("/OutcomeUtilities")}>Tiện ích ngoài</Link>
                            <Link className="dropdown-item" to="/ExtraFees" onClick={() => this.handleActive("/ExtraFees")}>Các loại phí khác</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }*/
}

export default withRouter(LeftSideBar);