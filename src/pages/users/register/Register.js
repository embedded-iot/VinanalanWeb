import React, { Component } from "react";
import { connect } from 'react-redux';
import { userActions } from '../../../actions';
import "./../styles/LoginForm.scss";
import validator from 'validator';
import loginImg from "../../../public/images/map.svg";

class Register extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: { value: '', isValid: true, message: '' },
      name: { value: '', isValid: true, message: '' },
      password: { value: '', isValid: true, message: '' },
      confirmPassword: { value: '', isValid: true, message: '' },

    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.formIsValid = this.formIsValid.bind(this);
    this.resetValidationStates = this.resetValidationStates.bind(this);
  }

  onChange(e) {
    let state = this.state;
    state[e.target.name].value = e.target.value;

    this.setState(state);
  }

  onSubmit(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    this.resetValidationStates(); //reset states before the validation procedure is run.
    if (this.formIsValid()) {
      let user = {
        password: this.state.password.value,
        email: this.state.email.value,
        userName: this.state.name.value,
      };
      dispatch(userActions.register(user));
    }
  };

  formIsValid() {
    let state = this.state;

    if (!validator.isEmail(state.email.value)) {
      state.email.isValid = false; //this will trigger the has-error class
      state.email.message = 'Not a valid email address'; //will be displayed in the help-block for the email input

      this.setState(state);
      return false;
    }

    if (state.password.value !== state.confirmPassword.value) {
      state.confirmPassword.isValid = false;
      state.confirmPassword.message = 'The password you entered does not match'

      this.setState(state);
      return false;
    }

    return true;
  }

  resetValidationStates(e) {
    let state = this.state;

    Object.keys(state).map(key => {
      if (state[key].hasOwnProperty('isValid')) {
        state[key].isValid = true;
        state[key].message = '';
      }
    });
    this.setState(state);
  }

  render() {
    const { registering } = this.props;
    let { email, name, password, confirmPassword } = this.state;

    return (
      <div className="page-content">
        <div className="login-form">
          <div className="login-container">
            <div className="login-title">Register new account</div>

            <div className="login-content">
              <div className="login-img">
                <img src={loginImg} />
              </div>
              <form className="form">
                <div className="login-notice">Register new account to access vinaland system.</div>
                <div className="login-label">Email</div>
                <input type="text" className="login-input" name="email" value={email.value} onChange={this.onChange} autoFocus />
                <span className="help-block">{email.message}</span>

                <div className="login-label">Username</div>
                <input type="text" className="login-input" name="name" value={name.value} onChange={this.onChange} autoFocus />
                <span className="help-block">{name.message}</span>

                <div className="login-label">Password</div>
                <input type="password" className="login-input" name="password" value={password.value} onChange={this.onChange} />
                <span className="help-block">{password.message}</span>

                <div className="login-label">Re-type password</div>
                <input type="password" className="login-input" name="confirmPassword" value={confirmPassword.value} onChange={this.onChange} />
                <span className="help-block">{confirmPassword.message}</span>

                <button className="btn btn-active" onClick={this.onSubmit}>REGISTER</button>
                {
                  registering && <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                }
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
  const { registering } = state.registration;
  return {
    registering
  };
}

export default connect(mapStateToProps)(Register);