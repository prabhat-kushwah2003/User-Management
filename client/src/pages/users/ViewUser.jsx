import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { getUser } from "../../services/userService";
import Button from "../../components/buttons/Button";

/**
 * ViewUser page - displays complete user profile details
 */
const ViewUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser(id);
        setUser(data);
      } catch (err) {
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 text-center text-gray-500">
        Loading user details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate("/")}
          className="mt-4"
        >
          <FaArrowLeft /> Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
        </div>
        <Button variant="primary" onClick={() => navigate(`/edit/${id}`)}>
          <FaEdit /> Edit
        </Button>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Profile Image Section */}
        <div className="bg-gray-50 p-6 flex justify-center border-b border-gray-200">
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${user.profileImage}`}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
          />
        </div>

        {/* User Details */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {user.firstName} {user.lastName}
            </h2>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                user.status === "Active"
                  ? "bg-red-950 text-gray-100"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.status}
            </span>
          </div>

          <div className="space-y-4">
            <DetailRow label="Email" value={user.email} />
            <DetailRow label="Mobile" value={user.mobile} />
            <DetailRow label="Gender" value={user.gender} />
            <DetailRow label="Location" value={user.location} />
            <DetailRow
              label="Created At"
              value={new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * DetailRow - displays a label-value pair
 */
const DetailRow = ({ label, value }) => {
  return (
    <div className="flex items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm font-medium text-gray-500 w-32">{label}:</span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  );
};

export default ViewUser;
