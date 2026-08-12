"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function DynamicNavBar() {

    const { user } = useAuth();

    // Don't show the navbar if nobody is logged in
    if (!user) {
        return null;
    }

    return (
        <nav className="navbar">

            <div className="navbar-brand">
                <Link href="/">
                    Waterman-Moylan
                </Link>
            </div>

            <div className="navbar-links">

                {/* Links available to normal users */}
                {user.role === "user" && (
                    <>
                        <Link href="/user">
                            Dashboard
                        </Link>

                        <Link href="/tickets/create">
                            Create Ticket
                        </Link>

                        <Link href="/tickets/my">
                            My Tickets
                        </Link>

                        <Link href="/profile">
                            My Profile
                        </Link>
                    </>
                )}

                {/* Links available to administrators */}
                {user.role === "admin" && (
                    <>
                        <Link href="/admin">
                            Dashboard
                        </Link>

                        <Link href="/admin_users">
                            Manage Users
                        </Link>

                        <Link href="/admin_tickets">
                            Manage Tickets
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
}