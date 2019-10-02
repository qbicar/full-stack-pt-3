import React from 'react'
import {Redirect} from 'react-router-dom'
//<=========Signout will sign user out and go back home
export default ({context}) => {
  context.actions.signOut();
  return(
    <Redirect to ='/' />
  )
}