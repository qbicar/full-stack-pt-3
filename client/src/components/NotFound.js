import React from 'react'
//<===== stateless component to display an NOTFOUND message when a route is not locatable
const NotFound = () => (
  <div className="bounds">
    <h1>Not Found</h1>
    <p>Sorry! We couldn't find the page you're looking for.</p>
  </div>
)
export default NotFound