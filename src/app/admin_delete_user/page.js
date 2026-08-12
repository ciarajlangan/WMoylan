"use client";
//NEXT STEP TO BRING BACK DELETE USER FUNCTIONALITY BUT HAVE IT HIDDENISH
//TAILWINDCSS FOR BETTER FILTER-BUTTONS AND GENERAL CSS FORMAT
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; //make delete page accept a user ID from the URL
import "../login/login.css";
import DynamicNavBar from "@/components/DynamicNavBar";

export default function AdminDeleteUserPage() {

  const [user, setUser] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userId = searchParams.get("id");

    if (userId) {
        setId(userId);
    }
}, [searchParams]);

   useEffect(() => {
    if (!id) return;

    async function fetchUser() {
        const response = await fetch(`/api/users/${id}`);
        const data = await response.json();

        if (response.ok) {
            console.log(data);
            setUser(data);
        } else {
            setMessage(data.message);
        }
    }
    fetchUser();

   }, [id]);
  

  async function deleteUser(id) {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
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

            setId("");
            setUser(null);

            setTimeout(() => {
            router.push("/admin_view_users");
             }, 1500);
       
      } else {
        setMessage(data.message);
  }

} catch (error) {
  console.error(error);
  setMessage("Something went wrong while deleting user");
}
}
  

  return (
    <>
    <DynamicNavBar />
    
      <main className="login-container">
        <section className="login-header">
          <h1 className="login-title">Delete User</h1>
          <p className="login-subtitle">
            Permanently delete a user account from the database
          </p>
        </section>

        <form className="login-form" >
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

        {user && (
            <div className = "user-preview">
                <h3>User Details</h3>

                <p><strong>Name:</strong> {user.name} </p>
                <p><strong>Email:</strong> {user.email} </p>
                <p><strong>Role:</strong> {user.role} </p>
                <p><strong>Status:</strong> {user.active? "Active" : "Inactive"} </p>

            </div>
        )}

        {user?.ticketCount > 0 && (
            <div className = "warning-box">
                <p>
                    ⚠ This user has <strong>{user.ticketCount}</strong>{" "}
                    ticket{user.ticketCount !== 1 ? "s" : ""}.
                </p>

                <p>
                    Users with associated tickets cannot be permanently deleted. Please deactivate the account instead.
                </p>
            </div>
        )}

          <button 
          type="button" 
          className="submit-button"
          disabled={user?.ticketCount > 0}
          onClick={() => deleteUser(id)}>
            Delete User
          </button>

        </form>
        

        {message && <p className="login-message">{message}</p>}
      </main>
    </>
  );
}