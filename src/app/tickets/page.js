"use client";

import { useEffect, useState } from "react";

export default function TicketsPage() {

    const [tickets, setTickets] = useState([]);
    const [message, setMessage] = useState("Loading tickets...");

    useEffect(() => {

    async function fetchTickets(){

        try {
        const res = await fetch("/api/tickets");

        const data = await res.json();

        if (!res.ok) {
            setMessage("Failed to load tickets")
            return;
        }

        if (data.tickets.length == 0) {
            setMessage("No active Tickets");
            return;
        }

        setTickets(data.tickets);
        setMessage("");

        }catch (err) {
            setMessage("Error loading events");
        }
    }

    fetchTickets();
},[]);


    return (

        <main className = "ticket-container">
            <h1 className= "ticket-title">Tickets</h1>

            

            <h1>Tickets</h1>

        </main>

    );

}