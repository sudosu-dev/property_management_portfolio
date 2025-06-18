import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Payments from "./pages/Payments/Payments";
import Ledger from "./pages/Payments/Ledger";
import Profile from "./pages/profile/profile";

export default function App() {
    return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<p>Home page</p>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />
        ;
        <Route
          path="/ledger"
          element={
            <ProtectedRoute>
              <Ledger />
            </ProtectedRoute>
          }
        />
        ;
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
