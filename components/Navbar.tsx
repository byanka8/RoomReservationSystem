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
    <nav className="bg-gray-200 p-4 space-x-4">
      {links.map(link => (
        <a key={link} href={`/${link.toLowerCase().replace(" ", "-")}`} className="hover:text-blue-500">
          {link}
        </a>
      ))}
    </nav>
  );
}