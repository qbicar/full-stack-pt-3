import React from 'react';
import { Link } from 'react-router-dom';
//<===== stateless component to display an error message when and error is found
const Error = () => {
  return (
    <div className="bounds">
      <h1>Error</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <Link className="button button-secondary" to="/">Return to Course List</Link>
    </div>
  );
}

export default Error;