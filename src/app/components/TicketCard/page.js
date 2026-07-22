//Ticket component for reusability only returns tickets 
export default function TicketCard(){

    return (

        //Task for the day is to create a home page with links to log in and make tickets-then role based permissions to duplicate the create read edit delete 
        //also create a ticketcard that shows the users tickets only and allows them to edit delete etc......
        //log- in - role -based permisissions-> dashboard -> view ticket card which will consist of the attributes of the tickets table attributes -> be able to delete, update, search, and create the tickets being stored on the ticket page-> dashboard -> log out 
        //create
        //read
        //edit
        //delete
        <div className = "ticket-card">
            <h2 className = "ticket-title">{tickets.title}</h2>

            <p className = "ticket-description">{tickets.description}</p>

            <p className = "ticket-detail"><strong>Priority</strong></p>
        </div>
    )
}
