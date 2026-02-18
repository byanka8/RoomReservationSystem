"use client" // this tells Next.js that this component runs in the browser, not on the server.
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null);

        const response = await axios.post('/api/login', {email, password}) // creates api folder inside register folder
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
            setError(response.data.error || "Login failed");
            setEmail("");       // clear email field
            setPassword("");    // clear password field
        }
    }

    return(
        <div className="flex justify-center items-center h-screen">
            <form 
            onSubmit={handleSubmit}
                className="big-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6">Log In</h1>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input 
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input 
                      type="password"
                      placeholder="Enter Password"
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                </div>

                {error && <p className="text-red-600">{error}</p>}
                
                {/* Register or submit button will be passed to the server side. */}
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                    Log In
                </button>

                <p className="py-2">
                    New to Roser?{" "}
                    <Link href="/register" className="text-blue-600 underline hover:text-blue-800">
                        Create New Account
                    </Link>
                </p>
                
            </form>
        </div>
    
    )
}

// const LoginPage = () => {
//     return (
//         <div className='text-3xl'>Login Page</div>
//     )
// }

// export default LoginPage

// ------ OR ------