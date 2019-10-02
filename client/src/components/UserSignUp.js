import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

//<=========stateful component and setting state of all variables to an empty string to get value passed through
export default class UserSignUp extends Component {
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    errors: []
  }

  //<=========change function , on change (keydown input) the value placed will be typed into textarea

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }
  //<===========handle my submit function ===========================
  //<===========setting variables to this.state to be later used ====

  submit = async () => {
    const { context } = this.props;

    const {
      firstName,
      lastName,
      emailAddress,
      password,
    } = this.state;

    const user = {
      firstName,
      lastName,
      emailAddress,
      password
    };

    const res = await context.data.api(`/users`, "POST", user, true, { emailAddress, password })
    if (res.status === 400) {
      const data = await res.json();
      this.setState({ errors: data.message.split(",") });
    } else if (res.status === 201) {
      context.actions.signIn(emailAddress, password)
      this.props.history.push('/');
    } else {
      this.props.history.push('/error');
    }
  }
  //<==========cancel button function to go back home
  cancel = () => {
    this.props.history.push('/');
  }

  //<=========render will display how the page will be displayed in html and show validation error if form is not filled out completly .

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors
    } = this.state

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>


          <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            elements={() => (
              <React.Fragment>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  placeholder="First Name"
                  onChange={this.change} />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  placeholder="Last Name"
                  onChange={this.change} />
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  value={emailAddress}
                  placeholder="Email Address"
                  onChange={this.change} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={this.change} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  onChange={this.change} />
              </React.Fragment>
            )} />
          <p>
            Already have a user account? <Link to="/signin">Click here</Link> to sign in!
                        </p>

        </div>
      </div>
    )
  }
}