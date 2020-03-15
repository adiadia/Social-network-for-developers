import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const { name, email, password, password2 } = formData;

  const onChange = async e => setFormData({ ...FormData, [e.target.name]: e.target.value })
  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      console.log('password not match');
    }
    else {
      console.log('password match');
    }
    return;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fa fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" onChange={e => onChange(e)} value={name} required="required" />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" onChange={e => onChange(e)} value={email} required="required" />
          <small className="form-text"
          >This site uses Gravatar so if you want a profile image, use a
            Gravatar email </small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            required="required"
            onChange={e => onChange(e)}
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={password2}
            required="required"
            onChange={e => onChange(e)}
            name="password2"
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  )
}
export default Register;
