import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './Context';
//<======================Private Route so if a user wants to create a course it will send them to a sign in screen
export default ({ component: Component, ...rest }) => {
  return (
    <Consumer>
      {context => (
        <Route
          {...rest}
          render={props => context.authenticatedUser ? (
            <Component {...props} />
          ) : (
              <Redirect to={{
                pathname: '/signin',
                state: { from: props.location }
              }} />
            )
          }
        />
      )}
    </Consumer>
  );
};