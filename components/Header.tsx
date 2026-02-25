import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";


export default function Header({ user, onLogout }: { user: { name: string; role: string }; onLogout: () => void }) {
    const { logout } = useAuth();
    const router = useRouter();

    let navLinks: string[] = [];
    if (user.role === "user") {
      navLinks = ["Dashboard", "My Bookings", "Book Room", "Profile"];
    } else if (user.role === "manager") {
      navLinks = ["Dashboard", "All Reservations", "Rooms"];
    } else if (user.role === "admin") {
      navLinks = ["Dashboard", "Profile"];
    }

    const handleLogout = () => {
        logout();
        router.push("/login");
    };
  
    return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* System Name - Left */}
          <h1 className="text-2xl font-bold text-white tracking-wide flex-shrink-0">◬ Room Reservation</h1>
          
          {/* Navigation Bar - Center */}
          <nav className="flex-1 flex justify-end items-center ml-8 pr-6">
            <div className="flex space-x-1">
              {navLinks.map(link => (
                <a 
                  key={link} 
                  href={`/${link.toLowerCase().replace(" ", "-")}`} 
                  className="px-3 py-2 text-white font-medium hover:bg-blue-500 rounded transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </nav>

          {/* User Info + Logout - Right */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-white font-semibold text-sm">{user.name}</span>
              <span className="text-blue-100 text-xs capitalize">{user.role}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded font-medium transition-colors duration-200 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}