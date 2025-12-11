# PassOP - Password Manager

PassOP is a secure and modern Password Manager application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to store, manage, and retrieve their credentials securely. The application features a responsive frontend built with Vite and Tailwind CSS, and a robust backend API handling authentication and database operations.

## Features

* **Secure Storage:** Safely store website credentials (URLs, usernames, and passwords).
* **User Authentication:**
    * Local User Login/Register (using BCrypt for password hashing).
    * Google OAuth Integration (via Passport.js).
* **Modern UI/UX:** Built with React 19 and styled with Tailwind CSS v4.
* **Security Best Practices:**
    * Rate limiting to prevent abuse.
    * Helmet for secure HTTP headers.
    * JWT (JSON Web Token) based session management.
    * Client-side encryption utilities (using crypto-js).
* **Interactive Notifications:** User feedback using react-toastify.

## Tech Stack

### Frontend
* **Framework:** React 19 (via Vite)
* **Styling:** Tailwind CSS 4
* **HTTP Client:** Axios
* **Encryption:** Crypto-js
* **State Management:** React Hooks (useState, useEffect)

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via Mongoose ODM)
* **Authentication:** Passport.js (Google Strategy), JSON Web Tokens (JWT), BCrypt
* **Security:** Helmet, Express-Rate-Limit, CORS

## Project Structure

PassOP/
├── backend/            # Express Server and API routes
│   ├── auth/           # Passport configuration
│   ├── models/         # Mongoose Schemas (User, Secret)
│   ├── routes/         # API endpoints (Auth, Secrets, OAuth)
│   └── server.js       # Entry point
│
└── frontend/           # React Client Application
    ├── src/
    │   ├── components/ # UI Components (Navbar, Manager, Footer, etc.)
    │   └── utils/      # Helper functions (crypto.js)
    └── package.json

## Installation & Setup

You will need Node.js and MongoDB installed on your machine.

### 1. Clone the Repository
git clone <your-repo-url>
cd PassOP

### 2. Backend Setup
Navigate to the backend folder and install dependencies.

cd backend
npm install

Configuration (.env):
Create a .env file in the backend directory with the following variables:

PORT=3000
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
# JWT / Session Secrets
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret

# Google OAuth (If using Google Login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies.

cd frontend
npm install

## Running the Application

To run the full stack application, you need to have both servers running simultaneously (in separate terminal windows).

Start the Backend Server:
cd backend
npm start
# Server usually runs on http://localhost:3000

Start the Frontend Client:
cd frontend
npm run dev
# Vite usually runs on http://localhost:5173

## Security Details

* **Passwords:** User login passwords are salted and hashed using bcrypt before storage.
* **API Security:** The backend implements cors to only allow requests from the frontend, helmet to set secure HTTP headers, and express-rate-limit to prevent brute-force attacks on the API.
* **Secrets:** Stored password data is managed via the Secret model and accessed via authenticated routes.

## License

This project is licensed under the ISC License.
