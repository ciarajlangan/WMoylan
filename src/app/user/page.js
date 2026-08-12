import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/libs/authen";
import LogoutButton from "@/components/LogoutButton";
import "../admin/admin.css"; // reuse your existing styling for now

export default async function UserDashboard() {
    
    //Get the currently authenticated user from the session cookie
    const user = await getAuthenticatedUser();

    //If the user is not logged in, send them back to the login page
    if (!user) {
        redirect("/login");
    }

    //Only normal users can access this dashboard
    if (user.role !== "user") {
        redirect("/admin");
    }

    return (
        <main className="admin-container">

            <section className="admin-header">
                <h1 className="admin-title">
                    Welcome, {user?.name}
                </h1>

                <p className="admin-subtitle">
                    Waterman-Moylan IT Ticketing System
                </p>
            </section>

            <section className="admin-card">

                <h2>User Dashboard</h2>
                <p>
                    Select one of the options below.
                </p>

                <div className = "dashboard-buttons">

                <Link
                    href="/tickets/create"        
                    className="submit-button"        
                >
                    Create Ticket
                </Link>

                <Link
                    href="/tickets/my"
                    className="submit-button"
                >
                    My Tickets
                </Link>

                <Link
                    href="/profile"
                    className="submit-button"
                >
                    My Profile
                </Link>

                <LogoutButton />

                </div>

            </section>

        </main>
    );
}