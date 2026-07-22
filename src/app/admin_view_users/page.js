"use client";

import { useEffect, useState } from "react";
import "../admin/admin.css";

export default function AdminViewUsersPage() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("/api/users");
                const data = await response.json();
                console.log(data);

                if(response.ok) {
                    setUsers(data);
                } else {
                    setMessage(data.message || "could not load users");
                }
            } catch (error) {
                console.error(error);
                setMessage("Something went wrong while loading users");
            }
        }

        fetchUsers();
    }, []);

    return (
        <>

        <main className = "admin-container">
            <section className = "admin-header">
                <h1 className = "admin-title">View All Users</h1>
                <p className = "admin-subtitle">
                    Display all registers users.
                </p>
            </section>

            {message && <p className = "login-message">{message}</p>}

            <section className = "admin-card">
                {users.length == 0 ? (
                    <p>No users found</p>
                ) : (
                    <table className = "users-table">
                        <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                        </thead>

                        <tbody>
                            {users.map((users) => (
                                <tr key = {users.id}>
                                    <td>{users.id}</td>
                                    <td>{users.name}</td>
                                    <td>{users.email}</td>
                                    <td>{users.role}</td>
                                </tr>

                            ))}
                        </tbody>
                    </table>
                )}
            </section>



        </main>
        </>

    )
}