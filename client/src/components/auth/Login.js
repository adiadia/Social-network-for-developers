import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''

  });
  const { email, password } = formData;

  const onChange = async e => setFormData({ ...FormData, [e.target.name]: e.target.value })
  const onSubmit = async e => {
    e.preventDefault();
    console.log('password match');
    return;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Login</h1>
      <p className="lead"><i className="fa fa-user"></i> Login With Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" onChange={e => onChange(e)} value={email} required="required" />
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
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  )
}
export default Login;
