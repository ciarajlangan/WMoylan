"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
            setMessage("Please fix all the errors above")

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
        <>
        <main className = "signin-container">
          <section className = "signin-header"> 
            <h1 className = "signin-title">Issue a ticket to IT</h1> 
            <p className = "signin-subtitle">Create an account to start</p>
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

            <label>
              Password 
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
            </label>
            <button type = "submit">Create Account</button>

            
            {message && (
              <p className="field-error">
             {message}
            </p>
            )}
          </form>

        </main>
        </>
    );
}