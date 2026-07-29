"use client";

import { useEffect, useState } from "react";
import "../admin/admin.css";

export default function AdminViewUsersPage() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");

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

    useEffect(() => {
        fetchUsers();
    }, []);

      async function deactivateUser(id) {

    const confirmDelete = window.confirm(
      "Are you sure you want to deactivate this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); //pulls message from the backend better design avoid duplication

        //refresh list of users
        fetchUsers();
       
      } else {
        setMessage(data.message);
  }

} catch (error) {
  console.error(error);
  setMessage("Something went wrong while deactivating user");
}
}

async function reactivateUser(id) {

    const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
    });

    const data = await response.json();

    if (response.ok) {
        setMessage(data.message);
        
        fetchUsers();
    } else {
        setMessage(data.message);
    }

    console.log(data);
}

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
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key = {user.id}>
                                      <td>{user.id}</td>
                                      <td>{user.name}</td>
                                      <td>{user.email}</td>
                                      <td>{user.role}</td>
                                      <td>
                                        {user.active ? "Active" : "Inactive"}
                                      </td>
                                      <td>
                                        {user.active ? (
                                            <button 
                                                onClick={() => deactivateUser(user.id)}
                                            >
                                                Deactivate
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => reactivateUser(user.id)}
                                            >
                                                Reactivate
                                            </button>
                                        )}
                                        </td>
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