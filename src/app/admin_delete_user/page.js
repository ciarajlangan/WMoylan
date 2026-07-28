"use client";

import { useState } from "react";
import "../login/login.css";

export default function AdminDeleteUserPage() {
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");

  async function deleteUser(e) {
    e.preventDefault();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("User deleted successfully!");
        setId("");
      } else {
        setMessage(data.message || "Could not delete user");
  }

} catch (error) {
  console.error(error);
  setMessage("Something went wrong while deleting user");
}
}
  

  return (
    <>

      <main className="login-container">
        <section className="login-header">
          <h1 className="login-title">Delete User</h1>
          <p className="login-subtitle">
            Remove a user account from the database
          </p>
        </section>

        <form className="login-form" onSubmit={deleteUser}>
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

          <button type="submit" className="submit-button">
            Delete User
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}
      </main>
    </>
  );
}