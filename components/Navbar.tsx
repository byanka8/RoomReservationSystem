type Props = { role: string };

export default function Navbar({ role }: Props) {
  let links: any[] = [];

  if (role === "user") {
    links = ["Dashboard", "My Bookings", "Book Room", "Profile"];
  } else if (role === "manager") {
    links = ["Dashboard", "All Reservations", "Rooms"];
  } else if (role === "admin") {
    links = ["Dashboard", "Manage Users", "Manage Rooms", "All Reservations", "Profile"];
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-0">
        <div className="flex space-x-1">
          {links.map(link => (
            <a 
              key={link} 
              href={`/${link.toLowerCase().replace(" ", "-")}`} 
              className="px-4 py-3 text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 border-b-2 border-transparent hover:border-blue-600"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}