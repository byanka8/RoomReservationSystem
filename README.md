# Room Reservation System

A web application for managing room reservations in a school setting, built with **Next.js**, **Tailwind CSS**, and **MongoDB**. This project also serves as a practice ground for applying **secure web practices** in a real-world web application.  

Users, including students, faculty, and staff, can reserve rooms for various purposes, while admins and managers can manage rooms, users, and reservations.  

---
## Contributors
- [Bea Sollesta](https://github.com/MoominHana)
- [Bianca Sollesta](https://github.com/byanka8)

## Table of Contents
- Features
- User Roles
- Technology Stack
- Project Status
- Setup & Installation

---

## Features
- CRUD (Create, Read, Update, Delete) **Rooms**  
- CRUD **Reservations**  
- CRUD **Users**  
- Role-based access control (Admin, Manager, Regular User)  
- Secure login and registration  

---

## User Roles

### 🧑 User (Regular)
- ✅ Register & login  
- ✅ View rooms  
- ✅ Create reservations (book rooms)  
- ✅ View their own reservations  
- ❌ Cannot create/edit rooms  
- ❌ Cannot manage other users’ reservations  

### 🧑‍💼 Manager
- ✅ Login (accounts are created by Admin)  
- ✅ View all rooms and reservations  
- ✅ Approve / cancel reservations
- ❌ Cannot manage user accounts
- ❌ Cannot create/delete other managers/admins  

### 👑 Admin
- ✅ Login  
- ✅ CRUD rooms  
- ✅ CRUD all reservations  
- ✅ CRUD user accounts (create managers, disable users, etc.)  
- ✅ Full access to everything  

---

## Technology Stack
- **Frontend:** Next.js, Tailwind CSS  
- **Backend / Database:** MongoDB

---

## Project Status
This project is currently **ongoing**.  
- ✅ Completed: Login, Registration, CRUD for rooms and users  
- ⚙️ In Progress: CRUD for reservations  
- 🖌 Planned: UI beautification and advanced features  

---

## Setup & Installation
> Instructions will be updated as the project progresses. Currently, the setup involves installing dependencies and running the Next.js development server.

```bash
# Clone the repository
git clone https://github.com/byanka8/RoomReservationSystem.git
cd room-reservation-system

# Install dependencies
npm install

# Run the development server
npm run dev
