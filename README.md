# Waterman-Moylan IT Ticketing System

A web-based IT ticketing system developed using Next.js, React and MySQL.

The system allows users to create and manage IT support tickets, while administrators can manage users and tickets through a separate administrative interface.

## Features

### User Features

- User registration and login
- Cookie-based authentication
- User role-based access
- User dashboard
- Create IT support tickets
- View personal tickets
- View user profile
- Logout functionality

### Administrator Features

- Administrator login
- Separate administrator dashboard
- User management
- View users
- Create users
- Update users
- Deactivate users
- Reactivate users
- Ticket management
- Role-based access control

### Ticket Management

- Create tickets
- Assign ticket creator
- Set ticket priority
- Track ticket status
- View ticket information
- Update tickets
- Delete tickets
- Display the user who created each ticket

## Authentication and Security

The application uses cookie-based authentication to maintain user sessions.

Authentication checks are performed when accessing protected pages to ensure that users are logged in and have the appropriate role.

Two user roles are currently supported:

- `user`
- `admin`

Passwords are securely hashed using `bcrypt` rather than being stored as plain text.

Database credentials are stored in environment variables and are not included in the repository.

## Technologies Used

- **Next.js**
- **React**
- **JavaScript**
- **MySQL**
- **mysql2**
- **bcrypt**
- **Tailwind CSS**
- **Git / GitHub**

## Project Structure

The project uses the Next.js App Router.

```text
src/
├── app/
│   ├── admin/
│   ├── admin_users/
│   ├── admin_create_user/
│   ├── admin_delete_user/
│   ├── admin_update_user/
│   ├── admin_view_users/
│   ├── login/
│   ├── tickets/
│   │   ├── create/
│   │   └── my/
│   ├── profile/
│   └── user/
│
├── components/
│   ├── AuthProvider.js
│   ├── LogoutButton.js
│   └── DynamicNavBar.js
│
├── context/
│   └── AuthContext.js
│
└── libs/
    ├── authen.js
    └── db.js