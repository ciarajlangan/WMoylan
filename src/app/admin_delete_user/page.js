"use client";

import { useState } from "react";
import "../login/login.css";

export default function AdminDeleteUserPage() {
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");

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

      <main className="login-container">
        <section className="login-header">
          <h1 className="login-title">Deactivate User</h1>
          <p className="login-subtitle">
            Deactivate a user account from the database
          </p>
        </section>

        <form className="login-form" onSubmit={deactivateUser}>
          <label>
            User ID
            <input
              type="text"
              className="input"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </label>

          <button 
          type="submit" 
          className="submit-button"
          onClick={() => deactivateUser(id)}>
            Deactivate User
          </button>

          <button 
          type = "submit" 
          className = "submit-button"
          onClick={() => reactivateUser(id)}>
            Reactivate User
        </button>

        </form>

        {message && <p className="login-message">{message}</p>}
      </main>
    </>
  );
}