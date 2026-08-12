"use client"

import {useState} from "react";
import "../login/login.css";
import DynamicNavBar from "@/components/DynamicNavBar";

export default function AdminUpdateUserPage() {
    const [id, setId] = useState("");

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        email: "",
        role: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function findUser(e) {
        e.preventDefault();

        //this is now targeted at api/users/[id]
        try {
            const response = await fetch (`/api/users/${id}`);
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setFormData({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    password: "",
                });

                setMessage("User loaded successfully. ");
            } else {
                setMessage(data.message || "User not found");
            }
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong while finding user")
        }
    }

    async function updateUser(e) {
        e.preventDefault();

        const updateData = { ...formData};

        if (!updateData.password) {
            delete updateData.password;
        }

        try {
            const response = await fetch(`/api/users/${formData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            console.log("Status:", response.status);
            console.log("Response:", data);

            if (response.ok) {
                setMessage("User updated successfully!");
            } else {
                setMessage(data.message || "Could not update user");
            }
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong while updating user");
        }
    }

    return (
        <> 
        <DynamicNavBar />
        <main className = "login-container">
            <section className = "login-header">
                <h1 className = "login-title">Update User</h1>
                <p className = "login-subtitle">
                    Search for a user by ID, then update their account details
                </p>
            </section>

            <form className = "login-form" onSubmit = {findUser}>
                <label>
                    User id
                    <input 
                    type = "text"
                    className = "input"
                    value = {id}
                    onChange = {(e) => setId(e.target.value)}
                    required
                    />
                </label>

                <button type="submit" className="submit-button">
                  Find User
                </button>
            </form>

            {formData.id && (
            <form className="login-form" onSubmit={updateUser}>
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
                </label>

                <label>
                    Email
                    <input 
                    type = "text"
                    name = "email"
                    className = "input"
                    value = {formData.email}
                    onChange = {handleChange}
                    required
                    />
                </label>

                <label> 
                    Role
                    <select
                    name="role"
                    className="input"
                    value={formData.role}
                    onChange={handleChange}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>   
                </label>

                <label>
                    New Password
                    <input
                    type = "password"
                    name = "password"
                    className = "input"
                    value = {formData.password}
                    onChange = {handleChange}
                    placeholder = "Leave blank to keep current password"
                    />
                </label>

                <button type = "submit" className = "submit-button">
                    Update User
                </button>
            </form>
            )}

            {message && <p className = "login-message">{message}</p>}
        </main>
        </>
    )
}
