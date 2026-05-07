import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { getUser, updateUser } from "../../services/userService";
import TextInput from "../../components/form/TextInput";
import SelectInput from "../../components/form/SelectInput";
import RadioGroup from "../../components/form/RadioGroup";
import ImageUpload from "../../components/form/ImageUpload";
import Button from "../../components/buttons/Button";

/**
 * EditUser page - form to edit an existing user
 */
const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
    status: "",
    location: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser(id);
        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
          gender: user.gender,
          status: user.status,
          location: user.location,
        });
        setImagePreview(`/uploads/${user.profileImage}`);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load user data" });
      } finally {
        setPageLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
      if (errors.profileImage) {
        setErrors((prev) => ({ ...prev, profileImage: "" }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);
      data.append("mobile", formData.mobile);
      data.append("gender", formData.gender);
      data.append("status", formData.status);
      data.append("location", formData.location);

      // Only append image if a new one was selected
      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      await updateUser(id, data);
      setMessage({ type: "success", text: "User updated successfully!" });

      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to update user";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  // Options
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  if (pageLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 text-center text-gray-500">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/")}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Edit User</h1>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`mb-4 px-4 py-3 rounded-md text-sm ${
            message.type === "success"
              ? "bg-red-950 text-gray-100 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <TextInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            error={errors.firstName}
          />
          <TextInput
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            error={errors.lastName}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            error={errors.email}
          />
          <TextInput
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter 10-digit mobile number"
            error={errors.mobile}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <RadioGroup
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={genderOptions}
            error={errors.gender}
          />
          <SelectInput
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
            error={errors.status}
          />
        </div>

        <ImageUpload
          label="Profile Image"
          name="profileImage"
          onChange={handleImageChange}
          preview={imagePreview}
          error={errors.profileImage}
        />

        <TextInput
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter location"
          error={errors.location}
        />

        <div className="mt-6 flex gap-3">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
          <Button variant="secondary" onClick={() => navigate("/")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
