"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";


export default function CreateTicket(){

    const [formData,setFormData] = useState({
        title:"",
        description:"",
        priority:"LOW"
    });

    const { user } = useAuth();
    const [message,setMessage] = useState("");
    const router = useRouter();


    function handleChange(e){

        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });

    }


    async function handleSubmit(e){

        e.preventDefault();

        if (!user) {
            setMessage("Please log in first.");

            setTimeout(() => {
                router.push("/login");
            }, 2000);
            return;
        }


        const res = await fetch("/api/tickets",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                ...formData,

                created_by: user.id

            })

        });


        const data = await res.json();


        if(!res.ok){

            setMessage(data.error);

            return;

        }


        setMessage("Ticket created successfully!");
                    
       setTimeout(() => {
            router.push("/user");
        }, 1500);
            

        setFormData({
            title:"",
            description:"",
            priority:"LOW"
        });

    }



    return (

        <main>

            <h1>Create Ticket</h1>


            <form onSubmit={handleSubmit}>


                <label>
                    Title

                    <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    />

                </label>


                <label>

                    Description

                    <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    />

                </label>


                <label>

                    Priority

                    <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    >

                        <option value="LOW">
                            Low
                        </option>

                        <option value="MEDIUM">
                            Medium
                        </option>

                        <option value="HIGH">
                            High
                        </option>

                    </select>


                </label>


                <button type="submit">
                    Create Ticket
                </button>


            </form>


            {message && (
                <p>
                    {message}
                </p>
            )}


        </main>

    );

}