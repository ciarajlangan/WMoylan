"use client";

import { createContext, useContext, useState } from "react";


//Create a global authentication context
const AuthContext = createContext();

export function AuthProvider({ children }) {

    //store the currenlt logged in user
    const [user, setUser] = useState(null);

    //save user information after a successful login
    function login(userData) {
        setUser(userData);
    }

    //clear the logged in user when logging out 
    function logout() {
        setUser(null);
    }

    //make authentication data and functions available to all child components 
    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

//custom hook to allow components to easily access authentication data
export function useAuth() {
    return useContext(AuthContext);
}