import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg py-4 flex justify-around text-xl border-t">
      <Link to="/dashboard" className="hover:text-blue-600">🏠</Link>
      <Link to="/feed" className="hover:text-blue-600">📢</Link>
      <Link to="/create-workout" className="hover:text-blue-600">➕</Link>
      <Link to="/profile" className="hover:text-blue-600">👤</Link>
    </nav>
  );
}
