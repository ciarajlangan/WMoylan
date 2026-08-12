//for it department

import DynamicNavBar from "@/components/DynamicNavBar";
import "./admin.css";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/libs/authen";
import LogoutButton from "@/components/LogoutButton";


//need to create admin files for this page to work pages to be created = admin_users and ADMIN TICKETS

export default async function AdminPage() {
   
    const user = await getAuthenticatedUser();

    if (!user){
        redirect("/login");
    }

    if (user.role !== "admin") {
        redirect("/user");
    }

    return (
        <> 
        <DynamicNavBar />
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

            <LogoutButton />
        </main>
        
        
        
        </>
    


    )
}