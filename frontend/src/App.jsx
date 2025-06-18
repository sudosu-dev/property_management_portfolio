import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Profile from "./pages/profile/profile";
import Maintenance from "./pages/Maintenance/Maintenance";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<p>Home page</p>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute>
              <Maintenance />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
