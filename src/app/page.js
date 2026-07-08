"use client";
import { useState } from "react";

export default function Home() {

    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      role: "",
      created_at: ""
    });

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

        //If the request failed (validation, regex or duplication email)
        if (!res.ok) {

          //check if the backend returned validation errors
          if(data.errors) {
            setErrors(data.errors);
            setMessage("Please fix all the errors above")

          }else{

            //otherwise show general backend error message*****************
            setMessage(data.message || "Something went wrong.")
          }
          return;
        }

        setMessage("Login Successful");
        setFormData({
          name: "",
          email: "",
          //ID????
          password: "",
          role: "",
          created_at: ""
        });
        setErrors({});

      } catch (err) {
        setMessage("Something went wrong.")
      }

    }

    //Style for line 80, 81 and 82 and check for appropriate text
    return (
        <>
        <main className = "signin-container">
          <section className = "signin-header"> 
            <h1 className = "signin-title">Log In</h1> 
            <p className = "signin-subtitle">Create an enquiry</p>
          </section>

          <form className = "signin-form" onSubmit = {handleSubmit}>

            <label>
              Name
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
            </label>

            <label>
              Email 
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
            </label>
          </form>

        </main>
        </>
    );
}