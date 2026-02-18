import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";


export default function Header({ user, onLogout }: { user: { name: string; role: string }; onLogout: () => void }) {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };
  
    return (
    <header className="flex justify-between items-center p-4 bg-gray-100 shadow">
      <h1 className="text-xl font-bold">Room Reservation</h1>
      <div className="flex items-center space-x-4">
        <span>{user.name} ({user.role})</span>
        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}