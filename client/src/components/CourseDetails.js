import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

//<========set class name CourseDetails and the state of courses to an array to later be used
class CourseDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
    }
  }
//<============fetch my api and the id and set the property of courses to my response data from axios

  componentDidMount() {

    axios.get('http://localhost:5000/api/courses/' + this.props.match.params.id)
      .then(response => {
        this.setState({
          courses: response.data,
        })
      })
      .catch(error => {
        if (error.status === 404) {
          console.log('ohh nooo')
        }
      })
  }
//<===========Delete function/ if course belongs to user and their id ,course will delete
  delete = async (e) => {
    e.preventDefault();
    const { context } = this.props;
    const authUser = context.authenticatedUser;

    axios.delete('http://localhost:5000/api/courses/' + this.props.match.params.id, {
      method: 'DELETE',
      auth: {
        username: `${authUser.emailAddress}`,
        password: `${authUser.password}`
      },
    }).then(() => {
      this.props.history.push("/");
    })
      .catch(err => {
        console.log(err);
        this.props.history.push("/error");
      });
  }

//<==========Render the page that will be displayed . Courses (all my courses in data base will map but return the one with that match id and its info) & display in proper placement in html
  render() {
    const { context } = this.props;
    const authUser = context.authenticatedUser;
    const courses = this.state.courses;
    return (
      <div className="bounds">
        {courses.map(course =>
          <div key={course.id}>
            <div className="actions--bar">
              <div className="bounds">
                <div key={course.id} className="grid-100">
                  {(authUser && authUser.id === course.user.id) &&
                    <span> <Link key="0" className="button" to={'/courses/' + this.props.match.params.id + '/update'}>Update Course</Link>
                      <Link key="1" className="button" to="#" onClick={this.delete}>Delete Course</Link></span>
                  }
                  <Link key="2" className="button button-secondary" to="/">Return to List</Link>
                </div>
              </div>
            </div>
            <div className="bounds course--detail">
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <h3 className="course--title">{course.title}</h3>
                  <p>By: {course.user.firstName} {course.user.lastName}</p>
                </div>
                <div className="course--description">
                  <p>{course.description}</p>
                </div>
              </div>
              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <h3>{course.estimatedTime}</h3>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <ul>
                        <li>{course.materialsNeeded}</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
export default CourseDetails