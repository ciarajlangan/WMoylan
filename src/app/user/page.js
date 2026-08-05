"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "../admin/admin.css"; // reuse your existing styling for now

export default function UserDashboard() {

    const router = useRouter();
    const { user, logout } = useAuth();

    function handleLogout() {
        logout();
        router.push("/login");
    }

    return (
        <main className="admin-container">

            <section className="admin-header">
                <h1 className="admin-title">
                    Welcome, {user?.name}
                </h1>

                <p className="admin-subtitle">
                    Manage your IT support tickets.
                </p>
            </section>

            <section className="admin-card">

                <button
                    className="submit-button"
                    onClick={() => router.push("/tickets/create")}
                >
                    Create Ticket
                </button>

                <button
                    className="submit-button"
                    onClick={() => router.push("/tickets/my")}
                >
                    My Tickets
                </button>

                <button
                    className="submit-button"
                    onClick={() => router.push("/profile")}
                >
                    My Profile
                </button>

                <button
                    className="submit-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </section>

        </main>
    );
}