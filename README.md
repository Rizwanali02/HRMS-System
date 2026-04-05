# HRMS-System

A full-stack Human Resource Management System (HRMS) built with Node.js/Express, MongoDB, and React (Vite).

## Features
- **Employee Directory**: Manage and view all registered employees.
- **Attendance System**: Live tracking of employee clock-ins and clock-outs.
- **Leave Management**: Submit, review, approve, and reject leave requests.
- **Paginated Management Views**: High-performance dashboard with data pagination for optimized control.
- **Role-Based Access Control**: Secure separate views and actions for Administrators and Employees.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS (for styling), Lucide-React (icons), Radix UI (accessible components).
- **Backend**: Node.js, Express, MongoDB with Mongoose ODM.
- **Context API/Global State**: For seamless authentication and user state management.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB connection string

### Backend Setup
1. `cd backend`
2. `npm install`
3. Configure `.env` with `MONGO_URI` and `JWT_SECRET`.
4. `npm start`

### Frontend Setup
1. `cd client`
2. `npm install`
3. `npm run dev`

---
Built with Rizwan Ali for advanced HR management.
