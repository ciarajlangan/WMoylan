"use client";

import { useEffect, useState } from "react";
//import router here later for navigation to delete/ update tickets 
import "../../admin/admin.css";
import DynamicNavBar from "@/components/DynamicNavBar";

export default function MyTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [message, setMessage] = useState("");

           useEffect(() => {
            fetchTickets()
           }, []);

    async function fetchTickets() {

        const response = await fetch("/api/tickets");
        const data = await response.json();

        if(response.ok){
            setTickets(data);
            return data;
        } else {
            setMessage(data.message || "Could not load tickets");
        }
    }

    //NEED TO SORT OUT THE CONNECTION TO THE TICKETS API AND ALSO MOVE THIS PAGE INTO ADMIN_VIEW_TICKETS AND CREATE ADMIN_TICKETS
    //ALSO NEED TO 
    return (

        <>
        <DynamicNavBar />
        <main
        className = "admin-container"
        >
            <section className = "admin-header">
            <h1 className = "admin-title">My Tickets</h1>
            </section>

            {message && <p className = "login-message">{message}</p>}

            <table className = "users-table">
                <thead>
                    <tr>
                        <th>Ticket ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Created By</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                    </tr>
                </thead>

                <tbody>
                    {tickets.map((ticket) => (
                        <tr key = {ticket.id}> 
                        <td>{ticket.id}</td>
                        <td>{ticket.title}</td>
                        <td>{ticket.priority}</td>
                        <td>{ticket.status}</td>
                        <td>{ticket.created_by}</td>
                        <td>{ticket.created_at}</td>
                        <td>{ticket.updated_at}</td>
                        </tr>
                        
                    ))}
                </tbody>
            </table>
        </main>
        </>
    );
}