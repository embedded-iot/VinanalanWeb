import React from 'react';
import { connect } from 'react-redux';
import '../styles/LoginForm.scss';
import validator from "validator";
import loginImg from "../../../public/images/map.svg";
import cookie from 'react-cookies';
import { clear, error, success } from "../../../actions";
import { userActions } from '../../../actions';

class ForgotPW extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submitted: false,
      email: '',
      err_mess: "Email is required",
      validEmail: false
    };
  }

  handleInputEmail = (e) => {
    let value = e.target.value.toLowerCase().trim();
    this.setState({
      email: value
    })
  };

  formIsValid = () => {
    if (validator.isEmail(this.state.email)) {
      this.setState({
        validEmail: true
      })
      return true;
    } else {
      this.setState({
        validEmail: false,
        err_mess: "Not a valid email address"
      })
      return false;
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      submitted: true
    })
    const { email } = this.state;
    const { dispatch } = this.props;

    if (this.formIsValid()) {
      dispatch(userActions.resetPass(email));
    }
  }

  render() {
    const { email, validEmail, err_mess, submitted } = this.state;
    return (
      <div className="page-content">
        <div className="login-form">
          <div className="login-container">
            <div className="login-title">Forgot your password?</div>

            <div className="login-content">
              <div className="login-img">
                <img src={loginImg} />
              </div>
              <form className="form">
                <div className="login-notice">Enter your email to reset your password</div>
                <div className="login-label">Email</div>
                <input type="text" className="login-input" value={email} onChange={this.handleInputEmail} />
                {
                  submitted && !validEmail && <div className="help-block">{err_mess}</div>
                }

                <button className="btn btn-active" onClick={this.handleSubmit}>RESET PASSWORD</button>
                <button className="btn btn-normal" onClick={(e) => this.props.history.push("/Login")}>LOGIN</button>
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

export default connect(mapStateToProps, null)(ForgotPW);