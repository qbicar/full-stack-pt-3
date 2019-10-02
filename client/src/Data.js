 //<=============imports =================================
 import config from './Config';

export default class Data {
  //<==========fetching url along with its path and setting the body to empty
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
//<=======options to be used such as POST,PUT,GET in code
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }
//authorization 
    if (requiresAuth) {
      let encodedCredentials = null;
//Checks to see if the credentials passed are the email and password
      if (credentials.emailAddress && credentials.password) {
        encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
      } else {
        encodedCredentials = credentials;
      }
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }
    return fetch(url, options);
  }
//<============fetches the user in my api =======================
  async getUser(emailAddress, password) {
    const response = await this.api(`/users`, 'GET', null, true, { emailAddress, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }
//<===================post will create my user if response is 201 (created)
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

//<====================== Retrieves a specific course
  async getCourse(id) {
    const course = await this.api(`/courses/${id}`);
    if (course.status === 200) {
      return course.json().then(data => data);
    } else if (course.status === 401) {
      return null;
    } else {
      return course.status;
    }
  }

//<================= Updates a specific course
  async updateCourse(data, { emailAddress, password }, id) {
    const response = await this.api(`/courses/${id}`, 'PUT', data, true, { emailAddress, password });
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 401) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      return response.status;
    }
  }
}
