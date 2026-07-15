"use client";

import { useState } from "react";


export default function CreateTicket(){

    const [formData,setFormData] = useState({
        title:"",
        description:"",
        priority:"LOW"
    });


    const [message,setMessage] = useState("");


    function handleChange(e){

        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });

    }


    async function handleSubmit(e){

        e.preventDefault();


        const res = await fetch("/api/tickets",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                ...formData,

                // temporary until authentication
                created_by:1

            })

        });


        const data = await res.json();


        if(!res.ok){

            setMessage(data.error);

            return;

        }


        setMessage("Ticket created!");

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