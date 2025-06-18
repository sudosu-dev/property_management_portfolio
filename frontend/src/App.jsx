import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";

import Maintenance from "./pages/Maintenance/Maintenance";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<p>Home page</p>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/maintenance"
          element={
            <PrivateRoute>
              <Maintenance />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}
