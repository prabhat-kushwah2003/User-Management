import { Routes, Route } from "react-router-dom";
import UserList from "../pages/users/UserList";
import AddUser from "../pages/users/AddUser";
import EditUser from "../pages/users/EditUser";
import ViewUser from "../pages/users/ViewUser";

/**
 * AppRoutes - defines all application routes
 */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserList />} />
      <Route path="/add" element={<AddUser />} />
      <Route path="/edit/:id" element={<EditUser />} />
      <Route path="/view/:id" element={<ViewUser />} />
    </Routes>
  );
};

export default AppRoutes;
