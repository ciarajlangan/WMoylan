"use client"
import { useState} from "react";
//access the global authentication context
import { useAuth } from "@/context/AuthContext";
import "./login.css";
//import dynamic navbar here 

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    //retrieve the login function from the authentication context
    const { login } = useAuth();
    const [message, setMessage] = useState("");

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setMessage("Login successful!");

                //Store the authenticated user's details in a global context
                login(data.user);

                console.log("User:", data.user); ///HAVE TO CREATE USER AUTHENTICATION

                //redirects users to the appropriate dashboard based on their role
                if(data.user.role === "admin") {
                    window.location.href = "/admin";
                }else if (data.user.role === "user") {
                    window.location.href = "/dashboard";
                } else {
                    setMessage("Unknown user role")
                }

            } else {
                setMessage(data.message || "Login failed");
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
                <h1 className = "login-title">Sign In</h1>
                <p className = "login-subtitle">Access your tickets</p>
            </section>

            <form className = "login-form" onSubmit={handleSubmit}>

                <label>
                    Email
                    <input
                    type = "email"
                    name= "email"
                    className="input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    />
                </label>

                <label>
                    password
                    <input
                    type ="password"
                    name = "password"
                    className = "input"
                    value = {formData.password}
                    onChange={handleChange}
                    required
                    />
                </label>

                <button type = "submit" className = "submit-button">
                    Sign In
                </button>
            </form>

            {message && <p className = "login-message">{message}</p>}

            <footer className = "login-footer">
                Login Portal WM
            </footer>
        </main>
        
        </>
    )
}