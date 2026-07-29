"use client";

import { useEffect, useState } from "react";
import "../admin/admin.css";

export default function AdminViewUsersPage() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [filter, setFilter] = useState("all");

        useEffect(() => {
        fetchUsers(filter);
    }, [filter]);

    async function fetchUsers(status = filter) {
  try {
    let url = "/api/users";

    if (status === "active") {
      url += "?active=true";
    } else if (status === "inactive") {
      url += "?active=false";
    }

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      setUsers(data);
    } else {
      setMessage(data.message || "Could not load users");
    }
  } catch (error) {
    console.error(error);
    setMessage("Something went wrong while loading users");
  }
}

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
        fetchUsers(filter);
       
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
        
        fetchUsers(filter);
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
                    Display all registerd users.
                </p>
            </section>

            {message && <p className = "login-message">{message}</p>}

            <div className="filter-buttons">
            <button
            onClick={() => setFilter("all")}
            >
            All Users
            </button>

            <button
            onClick={() => setFilter("active")}
            >
            Active Users
            </button>

            <button
            onClick={() => setFilter("inactive")}
            >
            Inactive Users
            </button>
            </div>

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