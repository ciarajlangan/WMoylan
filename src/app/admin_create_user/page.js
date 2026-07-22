"use client";

import { useState } from "react";
import "../login/login.css";

//FIGURE OUT HOW ROLE WORKS HERE IF IT IS NOT THE TWO ADMIN THE REST ARE REGUALR USERS?
export default function AdminCreateUserPage() {
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            
            const response = await fetch ("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log("API response: ", data);

            if (response.ok) {
                setMessage("User created successfully!");
            } else {
                if(data.errors) {
                    const errorMessages = Object.values(data.errors).join(",");
                    setMessage(errorMessages); //pulling errors from the api/users
                }else {
                    setMessage(data.message || data.error || "Could not create user");
                }
            }
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong");
        }
    }

    return (
        <> 
        
        <main className = "login-container">
            <section className = "login-header">
                <h1 className = "login-title">Create User</h1>
                <p className = "login-subtitle">
                    Add a new admin or user
                </p>
            </section>

            <form className = "login-form" onSubmit = {handleSubmit}>
                <label>
                    Name
                    <input
                    type = "text"
                    name = "name"
                    className = "input"
                    value = {formData.name}
                    onChange={handleChange}
                    required
                    />
                </label>

                <label>
                    Email
                    <input
                    type= "text"
                    name = "email"
                    className = "input"
                    value = {formData.email}
                    onChange={handleChange}
                    required
                    />
                </label>

                <label>
                    Password
                    <input
                    type = "password"
                    name = "password"
                    className = "input"
                    value = {formData.password}
                    onChange = {handleChange}
                    required
                    />
                </label>

                <button type = "submit" className = "submit-button">
                    Create User
                </button>
            </form>

            {message && <p className = "login-message">{message}</p>}

        </main>
        </>
    )
}