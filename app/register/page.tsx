"use client" // this tells Next.js that this component runs in the browser, not on the server.
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const isValidPassword = (password: string): boolean => {
    // Check length
    if (password.length < 8) return false;
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) return false;
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) return false;
    
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
    
    return true;
};

export default function Registration() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const router = useRouter()
    const { refreshUser } = useAuth(); 
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Password validation
        if (!isValidPassword(password)) {
            setError("Please input a valid password.");
            return;
        }

        const response = await axios.post('/api/register', {name, email, password, securityQuestion, securityAnswer}) // creates api folder inside register folder
        console.log(response)
        if(response.data.status==201) {
            await refreshUser();

            // small delay ensures cookie is ready
            setTimeout(() => {
                const role = response.data.user.role;

                if (role === "admin") router.push('/dashboard/admin');
                else if (role === "manager") router.push('/dashboard/manager');
                else router.push('/dashboard/user');
            }, 100);
        } else {
            setError(response.data.error || "Register failed");
            setName("");
            setEmail("");       // clear email field
            setPassword("");    // clear password field
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <form 
            onSubmit={handleSubmit}
                className="big-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6">Register</h1>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter Name"
                      value = {name}
                      onChange={(e) => setName(e.target.value)} // arrow function. store input inside the variable
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input 
                      type="email"
                      placeholder="Enter Email"
                      value = {email}
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
                      value = {password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                    <p className="text-sm text-gray-500">
                        Password must contain:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-500">
                        <li>At least 8 characters long</li>
                        <li>At least one uppercase letter</li>
                        <li>At least one lowercase letter</li>
                        <li>At least one special character</li>
                    </ul>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Security Question</label>
                    <select
                        value={securityQuestion}
                        onChange={(e) => setSecurityQuestion(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    >
                        <option value="">Select a question</option>
                        <option>What is your first pet's name?</option>
                        <option>What was the name of your first school?</option>
                        <option>What city were you born in?</option>
                        <option>What is your favorite food?</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Answer</label>
                    <input
                        type="text"
                        placeholder="Enter your answer"
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                    <p className="text-sm text-gray-500">Use an answer only you know. Avoid common answers.</p>
                </div>

                {error && <p className="text-red-600">{error}</p>}

                {/* Register or submit button will be passed to the server side. */}
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                    Register
                </button>

                <p className="py-2">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 underline hover:text-blue-800">
                        Log in
                    </Link>
                </p>
                
            </form>
        </div>
    )
}