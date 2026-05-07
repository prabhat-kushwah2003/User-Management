import { Link } from "react-router-dom";
import { FaUsers } from "react-icons/fa";

/**
 * Navbar component - displayed at the top of every page
 */
const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-red-950"
          >
            <span>User Management</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
