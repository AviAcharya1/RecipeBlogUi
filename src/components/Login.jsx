import React, { useState } from 'react';
import "../App.css";
import { baseUrl } from '../Url';
import {Link } from "react-router-dom";
import {ToastContainer,toast } from "react-toastify";

const Login = () => {
  const [email, setEmail]=useState("")
  const [password, setPassword]=useState("")
  const [showError,setShowError]=useState(false)
  const Email = email.toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setShowError(true);
      return;
    }
    console.log("Email:", email); // Log the email value
    console.log("Password:", password); // Log the password value

    try {
      let response = await fetch(`${baseUrl}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email , password }),
        }
      );
      response = await response.json();
      console.log("Login response",response);

      if (response.token) {
        toast.success("Login Successful");
        localStorage.setItem("token", response.token);
        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("An Error occurred while registering user:", error);
    }
  };

  return (
    <div className="SignupContainer">
      <form action="" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Enter Your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>

        <Link to="/forgotPassword">Forgot Password</Link>
      </form>
      {showError && (
        <span className="fill-fields-error">Please Fill all the fields</span>
      )}
      <ToastContainer />
    </div>
  )
}

export default Login;
