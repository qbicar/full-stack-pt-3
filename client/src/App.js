//<========imports=============================================
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import UserSignUp from './components/UserSignUp';
import UpdateCourse from './components/UpdateCourse';
import CourseDetails from './components/CourseDetails';
import Header from './components/Header';
import Courses from './components/Courses';
import UserSignOut from './components/UserSignOut';
import UserSignIn from './components/UserSignIn';
import CreateCourse from './components/CreateCourse';
import './styles/global.css';
import './App.css';
import withContext from './components/Context';
import PrivateRoute from './components/PrivateRoute';
import Error from './components/Error';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';


//<=============variables to use component with context authentication
const CourseDetailsWithContext = withContext(CourseDetails)
const CoursesWithContext = withContext(Courses)
const UpdateCourseWithContext = withContext(UpdateCourse)
const CreateCourseWithContext = withContext(CreateCourse)
const UserSignInWithContext = withContext(UserSignIn);
const HeaderWithContext = withContext(Header);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignOutWithContext = withContext(UserSignOut);


export default class App extends Component {
//<==================render routes and the component it belongs to=====
  render() {
    return (

      <div className="container">
        <BrowserRouter>
          <HeaderWithContext />
          <Switch>
            <Route exact path="/" component={CoursesWithContext} />
            <PrivateRoute path="/courses/create" component={CreateCourseWithContext} />
            <PrivateRoute path="/courses/:id/update" component={UpdateCourseWithContext} />
            <Route path="/courses/:id" component={CourseDetailsWithContext} />
            <Route path="/signin" component={UserSignInWithContext} />
            <Route path="/signup" component={UserSignUpWithContext} />
            <Route path="/signout" component={UserSignOutWithContext} />
            <Route path="/forbidden" component={Forbidden} />
            <Route path="/error" component={Error} />
            <Route component={NotFound} />
            
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}