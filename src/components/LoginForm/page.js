import {useState, useEffect} from "react";

export default function Form() {
    //states
    const [id, setId] = useState("");
    const [name, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [created_at, setCreated_at] = useState("");
    const[ticketSubmissionMessage, setTicketSubmissionMessage] = useState("");
    
    //list of users
    const [users, setUsers] = useState([]);

    //fetch all users ???/
    useEffect(() => {
        const fetchUsers = async () => {
            //NEED TO IMPLEMENT THIS API ROUTE FOR GET
            const res = await fetch("/api.users");
            //pares the response to a javascript object
            const data = await res.json();
            //saves the user list into a state
            setUsers(data);
        };
        //calls the method above
        fetchUsers();
    })

    //submits a new user
    const handleUserSubmit = (event) => {
        //prevents automatic default actions
        event.preventDefault();
        //sends the listed data to the API called 'users' with the POST
        fetch("/api/users", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name: name, email: email})
        })
        .then((res) => res.json())
        .then((newUser) => {
            //clear the form
            setUsername("");
            setEmail("");
            //Add the new user directly to the dropdown. Makes use of spread syntax
            setUsers((prevUsers)=> [...prevUsers, newUser]);
        });
    };

    //submits a new post (TICKET)
    const handleTicketSubmit = (event) => {
        event.preventDefault();

        //creates a message after submit (NEED VALIDATION)
        setTicketSubmissionMessage("Ticket submitted successfully");
        fetch("/api/tickets", {
            method: POST,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: id, title, content}),
        })
        .then((res)=> res.json())
        .then(()=> {
            setId("");
            setTitle("");
            setDescription("");
        });
    };

    return (
        <div>
            {/*Form for creating a new user (LOGGING IN) */}
            <form on submit = {handleUserSubmit}>
                <h2>User Log In</h2>
                <input
                type = "text"
                placeholder = "Name"
                value = {name}
                onChange ={(e)=> setUsername(e.target.value)}
                />
                <button type = "submit">Submit</button>
            </form>

            {/*Form for creating a new ticket */}
            <form onSubmit = {handleTicketSubmit}>
                <h2>Create Ticket</h2>
                <select value = {id} onChange = {(e)=> setId(e.target.value)}>
                    <option key ="default">Select User</option>
                    {users.map((users)=> (
                        <option key = {users.id} value = {users.id}>
                            {users.name}
                        </option>
                    ))}
                </select>

                <input
                type = "text"
                placeholder = "Title"
                value = {title}
                onChange = {(e) => setTitle(e.target.value)}
                />

                <input
                type = "text"
                placeholder = "Description"
                value = {description}
                onChange = {(e) => setDescription(e.target.value)}
                />

            </form>
        </div>
    )
}