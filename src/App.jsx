import { Routes, Route, useLocation } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import PrivateRoute from "./routes/PrivateRoute";
import AdminDashboard from './pages/AdminDashboard';
import AddGame from "./pages/Admin/AddGame";
import AddNews from "./pages/Admin/AddNews";
import AddCategory from "./pages/Admin/AddCategory";
import EditGame from "./pages/Admin/EditGame";
import EditNews from "./pages/Admin/EditNews";

export default function App() {
  const location = useLocation();

  return (
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ADMIN ROUTES (via PrivateRoute) */}
          <Route
            path="/admin/dashboard"element={<PrivateRoute><AdminDashboard /></PrivateRoute>}
          />
          <Route
            path="/admin/add-game"element={<PrivateRoute><AddGame /></PrivateRoute>}
          />
          <Route
            path="/admin/add-news"element={<PrivateRoute><AddNews /></PrivateRoute>}
          />
          <Route
            path="/admin/add-category"element={<PrivateRoute><AddCategory /></PrivateRoute>}
          />
         <Route path="/admin/edit-game/:id" element={<EditGame />} />
         <Route path="/admin/edit-news/:id" element={<EditNews />} />


        </Routes>
  );
}
