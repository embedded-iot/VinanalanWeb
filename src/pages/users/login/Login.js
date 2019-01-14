import React from 'react';
import { connect } from 'react-redux';
import '../styles/LoginForm.scss';
import { userActions } from '../../../actions';
import validator from "validator";
import loginImg from "../../../public/images/map.svg";
import Checkbox from "../../../components/commons/checkbox/Checkbox";
import cookie from 'react-cookies';

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
    let value = e.target.value.toLowerCase().trim();
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
      dispatch(userActions.login(user, this.state.remember));
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
            <div className="login-subtitle">Vinaland</div>
            <div className="login-title">Admin Portal</div>

            <div className="login-content">
              <div className="login-img">
                <img src={loginImg} />
              </div>
              <form className="form">
                <div className="login-notice">Please login by your Vinaland account!</div>
                <div className="login-label">Email</div>
                <input type="text" className="login-input" value={email} onChange={this.handleInputEmail} />
                {
                  submitted && !email && <div className="help-block">Email is required</div>
                }

                <div className="login-label">Password</div>
                <input type="password" className="login-input" value={password} onChange={this.handleInputPass} />
                {
                  submitted && !password && <div className="help-block">Password is required</div>
                }

                <div className="remember-box">
                  <Checkbox title="Remember me" onChange={this.handleRemember} />
                  <a onClick={(e) => this.props.history.push("/ForgotPW")}>Forgot password?</a>
                </div>

                <button className="btn btn-active" onClick={this.handleSubmit}>LOGIN</button>
                {
                  loggingIn && <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                }
                <button className="btn btn-normal" onClick={(e) => this.props.history.push("/Register")}>REGISTER</button>
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

export default connect(mapStateToProps)(Login);