import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

/**
 * Get all users with optional search and pagination
 * @param {number} page - Current page number
 * @param {number} limit - Number of users per page
 * @param {string} search - Search query string
 */
export const getUsers = async (page = 1, limit = 5, search = "") => {
  const response = await axios.get(
    `${API_URL}?page=${page}&limit=${limit}&search=${search}`,
  );
  return response.data;
};

/**
 * Get a single user by ID
 * @param {string} id - User ID
 */
export const getUser = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

/**
 * Add a new user
 * @param {FormData} userData - Form data containing user details and profile image
 */
export const addUser = async (userData) => {
  const response = await axios.post(API_URL, userData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Update an existing user
 * @param {string} id - User ID
 * @param {FormData} userData - Form data containing updated user details
 */
export const updateUser = async (id, userData) => {
  const response = await axios.put(`${API_URL}/${id}`, userData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Delete a user by ID
 * @param {string} id - User ID
 */
export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

/**
 * Export all users as CSV - triggers file download
 */
export const exportCSV = async () => {
  const response = await axios.get(`${API_URL}/export/csv`, {
    responseType: "blob",
  });

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", "users.csv");

  document.body.appendChild(link);

  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};
