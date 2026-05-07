import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaFileCsv } from "react-icons/fa";
import { getUsers, deleteUser, exportCSV } from "../../services/userService";
import UserTable from "../../components/table/UserTable";
import Pagination from "../../components/pagination/Pagination";
import Button from "../../components/buttons/Button";

/**
 * UserList page - displays all users in a table with search, pagination, and actions
 */
const UserList = () => {
  const navigate = useNavigate();

  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });
  const limit = 5;

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers(currentPage, limit, search);
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
      setTotalUsers(data.pagination.totalUsers);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch users" });
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  // Handle search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        setMessage({ type: "success", text: "User deleted successfully" });
        fetchUsers();
      } catch (error) {
        setMessage({ type: "error", text: "Failed to delete user" });
      }
    }
  };

  // Handle CSV export
  const handleExportCSV = async () => {
    try {
      await exportCSV();
      setMessage({ type: "success", text: "CSV exported successfully" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to export CSV" });
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Auto-dismiss messages after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User List</h1>
        <p className="text-sm text-gray-500 mt-1">Total Users: {totalUsers}</p>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div
          className={`mb-4 px-4 py-3 rounded-md text-sm ${
            message.type === "success"
              ? "bg-red-950 text-gray-100 border "
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Toolbar - Search, Add, Export */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyPress}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full sm:w-72"
          />
          <Button onClick={handleSearch} variant="primary">
            <FaSearch /> Search
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={() => navigate("/add")} variant="success">
            <FaPlus /> Add User
          </Button>
          <Button onClick={handleExportCSV} variant="secondary">
            <FaFileCsv /> Export CSV
          </Button>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading users...</div>
      ) : (
        <>
          <UserTable
            users={users}
            onDelete={handleDelete}
            currentPage={currentPage}
            limit={limit}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default UserList;
