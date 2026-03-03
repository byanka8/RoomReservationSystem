"use client"

import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React from "react";

export default function UserDashboard() {

    const router = useRouter();
    const { user, loading } = useAuth();
    
    if (loading) return <p>Loading...</p>;
    if (!user) return <p>Please login</p>;

    return (
        <div>
            <Header user={user} onLogout={() => console.log("logout")} />
            <Navbar role={user.role} />
            
            
            <h1 className="text-2xl font-bold mb-4 mt-4">Welcome {user.name}!</h1>

            <h2>Reservations</h2>
            <button
                onClick={() => router.push("/reservations")}
                className="px-2 py-1 mb-2 bg-blue-500 text-white rounded"
                >
                Manage Reservations
            </button>
        </div>
    )
}