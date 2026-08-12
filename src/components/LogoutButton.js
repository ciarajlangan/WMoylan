"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {

    const router = useRouter();
    const { logout } = useAuth();

    async function handleLogout() {

        try {

            const response = await fetch("/api/logout", {
                method: "POST",
            });

            if (!response.ok) {
                console.error("Logout failed");
                return;
            }
            
            //Clear the user from the client-side AuthContext
            logout();

            //Return to login page
            router.push("/login");

        } catch (error) {

            console.error("Logout failed: ", error);

        }
    }

    return (

        <button 
        className = "submit-button"
        onClick={handleLogout}
        >
            Logout 
        </button>
    )
}