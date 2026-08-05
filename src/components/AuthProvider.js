"use client";

import { AuthProvider } from "@/context/AuthContext";

//wrap the application with the authentication provider
//so every page has access to the logged in user.
export default function Providers({children}) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}