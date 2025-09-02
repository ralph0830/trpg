# Project Overview

This project is an AI-powered 4-player web-based TRPG (Tabletop Role-Playing Game). It features a Node.js backend that communicates with a React frontend via WebSockets for real-time gameplay. An AI agent, powered by an LLM, acts as the Game Master (GM). All project data is stored in a PostgreSQL database.

# Directory Structure

The project is organized into two main directories:

-   `backend/`: Contains the Node.js server application, responsible for game logic, AI integration, and database management.
-   `frontend/`: Contains the React client application, which provides the user interface for the game.

# Key Files

-   `PRD.md`: The main Product Requirements Document, outlining the project's vision, features, and technical specifications.
-   `TODO.md`: A detailed list of development tasks based on the PRD.
-   `backend/server.js`: The entry point for the backend server.
-   `backend/.env.example`: An example file for the required environment variables for the backend.
-   `frontend/src/App.jsx`: The main React component that structures the application's layout.
-   `frontend/src/components/`: Directory containing the primary UI components for the game (Map, Chat, Status, etc.).

# Getting Started

Follow the instructions below to set up and run the development environments for both the backend and frontend.

## Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Set up environment variables:**
    Copy the example environment file and fill in your specific database credentials, Gemini API key, and n8n webhook URL.
    ```bash
    cp .env.example .env
    # Now, edit the .env file with your details
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    The server will automatically restart when file changes are detected, thanks to `nodemon`.
    ```bash
    npm start
    ```

## Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    This will start the Vite development server, typically on `http://localhost:5173`.
    ```bash
    npm run dev
    ```