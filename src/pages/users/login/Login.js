import React from 'react';
import { connect } from 'react-redux';
import '../styles/LoginForm.scss';
import { userActions } from '../../../actions';
import validator from "validator";
import loginImg from "../../../public/images/map.svg";
import Checkbox from "../../../components/commons/checkbox/Checkbox";
import cookie from 'react-cookies';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const STRINGS = {
  LOGIN: <FormattedMessage id="LOGIN" />,
  EMAIL: <FormattedMessage id="EMAIL" />,
  REGISTER: <FormattedMessage id="REGISTER" />,
  FORGOT_PASS: <FormattedMessage id="FORGOT_PASS" />,
  LOG_OUT: <FormattedMessage id="LOG_OUT" />,
  ADMIN_PORTAL: <FormattedMessage id="ADMIN_PORTAL" />,
  PLEASE_LOGIN: <FormattedMessage id="PLEASE_LOGIN_BY_YOUR_SAREPI_ACCOUNT" />,
  REMEMBER_ME: <FormattedMessage id="REMEMBER_ME" />,
  REQUIRED_EMAIL: <FormattedMessage id="REQUIRED_EMAIL" />,
  REQUIRED_PASSWORD: <FormattedMessage id="REQUIRED_PASSWORD" />,
  PASSWORD: <FormattedMessage id="PASSWORD" />,
}



class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      submitted: false,
      remember: false
    };
  }

  componentDidMount() {
    const email = cookie.load("vinaland_email_login");
    const url = new URL(window.location);
    var resetPass = url.searchParams.get("reset-pass");
    if (resetPass == "true") {
      this.props.dispatch(userActions.logout());
    }
    if (email) {
      this.setState({
        email: email
      })
    }
  }

  handleInputPass = (e) => {
    const value = e.target.value;
    this.setState({
      password: value
    });
  }

  handleInputEmail = (e) => {
    let value = e.target.value.trim();
    this.setState({
      email: value
    })
  };

  formIsValid = () => {
    return validator.isEmail(this.state.email);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({ submitted: true });
    const { email, password } = this.state;
    const { dispatch } = this.props;

    if (this.formIsValid() && password) {
      let user = {
        email: email,
        password: password
      };
      dispatch(userActions.login(user, this.state.remember, this.props.history));
    }
  }

  handleRemember = (value, checked) => {
    this.setState({
      remember: checked
    })
  }

  render() {
    const { loggingIn } = this.props;
    const { email, password, submitted } = this.state;
    return (
      <div className="page-content">
        <div className="login-form">
          <div className="login-container">
            <div className="login-subtitle">Sarepi</div>
            <div className="login-title">{STRINGS.ADMIN_PORTAL}</div>

            <div className="login-content">
              <div className="login-img">
                <img src={loginImg} />
              </div>
              <form className="form">
                <div className="login-notice">{STRINGS.PLEASE_LOGIN}</div>
                <div className="login-label">{STRINGS.EMAIL}</div>
                <input type="text" className="login-input" value={email} onChange={this.handleInputEmail} />
                {
                  submitted && !email && <div className="help-block">{STRINGS.REQUIRED_EMAIL}</div>
                }

                <div className="login-label">{STRINGS.PASSWORD}</div>
                <input type="password" className="login-input" value={password} onChange={this.handleInputPass} />
                {
                  submitted && !password && <div className="help-block">{STRINGS.REQUIRED_PASSWORD}</div>
                }

                <div className="remember-box">
                  <Checkbox title={STRINGS.REMEMBER_ME} onChange={this.handleRemember} />
                  <a onClick={(e) => this.props.history.push("/ForgotPW")}>{STRINGS.FORGOT_PASS}</a>
                </div>

                <button className="btn btn-active" onClick={this.handleSubmit}>{STRINGS.LOGIN}</button>
                <button className="btn btn-normal" onClick={(e) => this.props.history.push("/Register")}>{STRINGS.REGISTER}</button>
              </form>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { loggingIn } = state.authentication;
  return {
    loggingIn
  };
}

export default withRouter(connect(mapStateToProps)(Login));