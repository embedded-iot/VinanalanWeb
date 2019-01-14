import React, { Component } from "react";
import "./Header.scss";
import { connect } from "react-redux";
import logo_vinaland from "../../public/images/icons/vinaland-logo.png";
import user_ic from "../../public/images/icons/user_ic.png";
import { setLanguage, userActions } from "../../actions";
import ic_en from "../../public/images/icons/en.png";
import ic_vi from "../../public/images/icons/vi.png";

class HeaderAdmin extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      image_profile: null
    }
  }

  handleLogOut = () => {
    this.props.logout();
    this.props.history.push("/Login");
  };

  changeLanguage = () => {
    if (this.props.locale == "vi") {
      this.props.setLanguage("en");
    } else {
      this.props.setLanguage("vi");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedIn !== this.props.loggedIn) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        this.setState({
          username: user.userName,
          email: user.email,
          image_profile: user.image_profile
        })
      } else {
        this.setState({ username: "" });
      }
    }
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.setState({
        username: user.userName,
        email: user.email,
        image_profile: user.image_profile
      })
    } else {
      this.setState({ username: "", email: "" });
    }
  }

  render() {
    const {
      username,
      email,
      image_profile
    } = this.state;
    const urlPage = window.location.pathname.toLowerCase();

    return (
      <div className="header-session">
        <div className="main-header">
          {
            <div className="branch-box mr-auto">
              <img className="ic-logo" src={logo_vinaland} />
            </div>
          }
          <div className="header-contents">
            <button className="locale-box" onClick={this.changeLanguage}>
              <img className="header-icon" src={this.props.locale === "en" ? ic_en : ic_vi} />
              {
                this.props.locale
              }
            </button>

            <div className="user-box">
              <button className="btn-show-user-info dropdown-toggle" type="button" data-toggle="dropdown">{username}
                <img src={user_ic} />
              </button>
              <div className="dropdown-menu profile">
                <div className="profile-userpic">
                  <img src={image_profile ? image_profile : logo_vinaland} className="img-responsive" alt="" />
                </div>
                <div className="profile-usertitle">
                  <div className="profile-name">
                    {username}
                  </div>
                  <div className="profile-email">
                    {email}
                  </div>
                </div>
                <div className="profile-userbuttons">
                  <button type="button" className="btn btn-sm btn-become-host" onClick={(e) => this.props.history.push("/UserInfo")}>User Info</button>
                  <button type="button" className="btn btn-sm btn-logout" onClick={this.handleLogOut}>Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { loggedIn } = state.authentication;
  return {
    loggedIn,
    locale: state.translation.locale
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLanguage: (locale) => {
      dispatch(setLanguage(locale));
    },
    logout: () => {
      dispatch(userActions.logout());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderAdmin);