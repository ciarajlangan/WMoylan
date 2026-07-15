//Ticket component for reusability only returns tickets 
export default function TicketCard(){

    return (

        //delete
        //edit
        //delete
        <div className = "ticket-card">
            <h2 className = "ticket-title">{tickets.title}</h2>

            <p className = "ticket-description">{tickets.description}</p>

            <p className = "ticket-detail"><strong>Priority</strong></p>
        </div>
    )
}
