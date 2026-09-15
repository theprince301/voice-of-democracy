import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b-4 border-primary bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ink">
          Voice of Democracy
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:text-primary transition">
            Home
          </Link>

          {hasRole("admin", "editor") && (
            <Link to="/admin" className="hover:text-primary transition font-medium">
              Dashboard
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-500 hidden sm:inline">
                {user.name} <span className="text-xs">({user.role})</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hover:text-primary transition">
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded bg-primary text-white hover:bg-primary-dark transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
