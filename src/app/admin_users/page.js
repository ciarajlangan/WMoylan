import Link from "next/link";
import "../admin/admin.css";
//NEED TO CREATE PAGES 
// Create user [done]
// VIEW ALL USERS, 
// UPDATE ALL USERS AND 
// DELETE USER

export default function AdminUsersPage() {
    return(
        <> 

        <main className = "admin-container">
            <section className = "admin-header">
                <h1 className = "admin-title">Manage Users</h1>

                <p className = "admin-subtitle">
                    Create, view, update or delete users.
                </p>

            </section>

            <section className = "admin-grid">
                <Link href = "/admin_create_user" className = "admin-card">
                <h2>Create User</h2>
                <p>Add a new admin or basic user account</p>
                </Link>

            </section>

            <section className = "admin-grid">
                <Link href = "/admin_view_users" className = "admin-card">
                <h2>View Users</h2>
                <p>Display registered users from the database</p>
                </Link>

            </section>


        </main>
        
        
        </>
        
    )
}