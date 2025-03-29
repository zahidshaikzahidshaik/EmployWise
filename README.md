# EmployWise User Management Application

This React-based application integrates with the Reqres API for user management, providing authentication, user listing, editing, and deletion capabilities.

## Features

- **Authentication**: Secure login using JWT tokens
- **User Management**: View, edit, and delete users
- **Responsive UI**: Modern interface built with Material UI
- **Client-side Search**: Filter users by name or email
- **Pagination**: Browse users with pagination support

## Technologies Used

- React with TypeScript
- React Router for navigation
- Axios for API requests
- Material UI for the user interface
- Local Storage for token persistence

## Getting Started

### Prerequisites

- Node.js (version 14 or later recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/employwise.git
   cd employwise
   ```

2. Install dependencies:
   ```
   npm install
   ```
   
3. Start the development server:
   ```
   npm start
   ```

4. The application will open in your browser at `http://localhost:3000`

## Usage

### Login

- Use the following credentials to log in:
  - Email: `eve.holt@reqres.in`
  - Password: `cityslicka`

### User Management

- View the list of users after login
- Use the search box to filter users
- Click on the edit icon to modify user information
- Click on the delete icon to remove a user
- Navigate between pages using the pagination controls

## API Integration

This application uses the Reqres API for demonstration purposes:

- Login: `POST https://reqres.in/api/login`
- Get Users: `GET https://reqres.in/api/users?page=1`
- Edit User: `PUT https://reqres.in/api/users/{id}`
- Delete User: `DELETE https://reqres.in/api/users/{id}`

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Main application pages
├── services/         # API and other services
├── utils/            # Utility functions
├── App.tsx           # Main application component
└── index.tsx         # Application entry point
```

## License

This project is licensed under the MIT License.
