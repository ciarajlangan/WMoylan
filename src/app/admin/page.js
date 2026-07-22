//for it department
import Link from "next/link";
//import DynamicNavBar from "../components/DynamicNavBar";
//do an import here for an uncreated admin css file

//need to create admin files for this page to work pages to be created = admin_users and ADMIN TICKETS

export default function AdminUsersPage() {
    return (
        <> 
        
        <main className = "admin-container">
            <section className = "admin-header">
                <h1 className = "admin-title">Admin Dashboard</h1>
                <p className = "admin-subtitle">
                    Manage users and tickets 
                </p>
            </section>

            
            <section className = "admin-grid">
                <Link href = "/admin_users" className = "admin-card"> 
                <h2>Manage Users</h2>
                <p>Create, view, update or delete user accounts</p>
                </Link>


            </section>
        </main>
        
        
        
        </>
    


    )
}