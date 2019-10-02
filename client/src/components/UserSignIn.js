import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class UserSignIn extends Component {
  state = {
    emailAddress: '',
    password: '',
    errors: []
  }
  //<=============how webpage will be displayed =============
  render() {
    const {
      emailAddress,
      password,
      errors,
    } = this.state;
    //<=========return html page template===============
    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <div>
            <Form
              cancel={this.cancel}
              errors={errors}
              submit={this.submit}
              submitButtonText="Sign In"
              elements={() => (
                <React.Fragment>
                  <input
                    id="emailAddress"
                    name="emailAddress"
                    type="text"
                    value={emailAddress}
                    onChange={this.change}
                    placeholder="Email Address" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={this.change}
                    placeholder="Password" />
                </React.Fragment>
              )} />
          </div>
          <p>&nbsp;</p>
          <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
        </div>
      </div>
    );
  }
  //<=============on input it will change value===========
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(() => {
      return {
        [name]: value
      };
    });
  }
  //<=========submit function to handle submit action to sign user in
  submit = () => {
    const { context } = this.props;
    const { emailAddress, password } = this.state;
    const { from } = this.props.location.state || { from: { pathname: '/signin' } };

    context.actions.signIn(emailAddress, password)

      .then(user => {
        if (user === null) {
          this.setState(() => {
            return { errors: ['Sign-in was unsuccessful'] };
          })
        } else {
          this.props.history.push(from);
          window.location.href = '/'
        }
      })

      .catch((error) => {
        console.error(error);
        this.props.history.push('/error');
      });
  }

  //<=======cancel button function to go home
  cancel = () => {
    this.props.history.push('/');
  }
}