"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./register.css"

export default function Home() {

    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
    });

    const router = useRouter();
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({}); //state to hold the errors

    function handleChange(e) {

      const {name, value} = e.target;
      setFormData({ ...formData, [name]: value});

      setErrors({
        ...errors,
        [name]: ""
      })
    }

    async function handleSubmit(e) {

      e.preventDefault();
      setMessage("");

      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        
        console.log("RESPONSE STATUS:", res.status);
        console.log("RESPONSE DATA:", data);

        //If the request failed (validation, regex or duplication email)
        if (!res.ok) {

          //check if the backend returned validation errors
          if(data.errors) {
            setErrors(data.errors);
            setMessage("Please fix all the errors above.")

          }else{

            //otherwise show general backend error message*****************
            setMessage(data.message || "Something went wrong.")
          }
          return;
        }

        setMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => {
            router.push("/login");
        }, 1500);
        
        setFormData({
          name: "",
          email: "",
          password: "",
        });
        setErrors({});

      } catch (err) {
        console.error("FETCH ERROR:", err);
      }

    }

    //Style for line 80, 81 and 82 and check for appropriate text
    return (
        
        <main className = "register-page">

          <section className = "register-card">

          {/* Header */}
          <header className = "register-header">

            <div className = "register-logo">
              IT
            </div>

            <h1 className = "register-title">
              Create your account
              </h1> 

            <p className = "register-subtitle">
              Create an account to submit and track IT support tickets
            </p>

            </header>

          {/* Form */}
          <form 
          className = "register-form" 
          onSubmit = {handleSubmit}
          >

            {/* Name */}
            <div className = "register-form-group">
            <label>
              Full name
              </label>

              <input 
              type = "text"
              name = "name"
              className = "input"
              value = {formData.name}
              onChange = {handleChange}
              required
              />

              {errors.name && (
                <p className = "field-error">{errors.name}</p> //need to create this error message in api
              )}

              </div>
            
            
             {/* Email */}
            <div className="register-form-group">
              <label>
              Email address
              </label>

              <input
              type = "email"
              name = "email"
              className = "input"
              value = {formData.email}
              onChange={handleChange}
              required
              />

              {errors.email && (
                <p className = "field-error">{errors.email}</p> //need to create error message for this also
              )}

            </div>
           
            
            {/* Password */}
            <div className="register-form-group">

              <label>
              Password 
              </label>

              <input
              type = "password"
              name = "password"
              className = "input"
              value = {formData.password}
              onChange={handleChange}
              required
              />

              {errors.password && (
                <p className = "field-error">{errors.password}</p> //need to create error message for this also
              )}

            </div>
           
           {/*Create account button */}
            <button 
            className = "register-button"
            type = "submit">
              Create Account
            </button>

            {/* Message */}
            {message && (
              <p className="input-error">
             {message}
            </p>
            )}

          </form>

          {/* Login link */}
          <div className = "register-footer">

            <span>
              Already have an account?
            </span>

            <button 
            type = "button"
            className = "register-link"
            onClick = {() => router.push("/login")}
            >
              Sign in
              </button>

            </div>

            </section>

        </main>
    );
}