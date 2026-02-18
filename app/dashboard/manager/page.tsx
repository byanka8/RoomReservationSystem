"use client"

import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import React from "react";

export default function ManagerDashboard() {

    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>Please login</p>;

    return (
        <div>
            <Header user={user} onLogout={() => console.log("logout")} />
            <Navbar role={user.role} />
            <h1>Manager Dashboard</h1>
        </div>
    )
}