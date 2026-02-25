"use client" // this tells Next.js that this component runs in the browser, not on the server.
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Registration() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const router = useRouter()
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const response = await axios.post('/api/register', {name, email, password}) // creates api folder inside register folder
        console.log(response)
        if(response.data.status==201) {
            login(response.data.user);
            if(response.data.user.role == "admin")
                router.push('/dashboard/admin')
            else if(response.data.user.role == "manager")
                router.push('/dashboard/manager')
            else if(response.data.user.role == "user")
                router.push('/dashboard/user')
        } else {
            setError(response.data.error || "Register failed");
            setName("");
            setEmail("");       // clear email field
            setPassword("");    // clear password field
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
            <form 
            onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Us 🎉</h1>
                  <p className="text-gray-600">Create a new account</p>
                </div>
                
                <div className="mb-5">
                    <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value = {name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200"
                      required
                    />
                </div>
                <div className="mb-5">
                    <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                    <input 
                      type="email"
                      placeholder="you@example.com"
                      value = {email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200"
                      required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Password</label>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value = {password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200"
                      required
                    />
                </div>

                {error && <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">{error}</div>}

                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg">
                    Register
                </button>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-green-600 font-semibold hover:text-green-700 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}