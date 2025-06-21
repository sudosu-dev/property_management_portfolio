import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Payments from "./pages/Payments/Payments";
import Ledger from "./pages/Payments/Ledger";
import Profile from "./pages/profile/profile";
import Maintenance from "./pages/Maintenance/Maintenance";
import ResidentDashboard from "./pages/ResidentDashboard/ResidentDashboard";
import LandingPage from "./pages/LandingPage/LandingPage";
import About from "./pages/About/About";
import ManagerDashboard from "./pages/ManagerDashboard/ManagerDashboard";
import ManagePropertyInfo from "./pages/ManagePropertyInfo/ManagePropertyInfo";
import ManageUnits from "./pages/ManageUnits/ManageUnits";
import ManageResidents from "./pages/ManageResidents/ManageResidents";
import ManagePayments from "./pages/ManagePayments/ManagePayments";
import ManageUtilities from "./pages/ManageUtilities/ManageUtilities";
import ManageMaintenance from "./pages/ManageMaintenance/ManageMaintenance";
import ManageAnnouncements from "./pages/ManageAnnouncements/ManageAnnouncements";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<ManagerDashboard />} />
        <Route path="/admin/propertyinfo" element={<ManagePropertyInfo />} />
        <Route path="/admin/units" element={<ManageUnits />} />
        <Route path="/admin/residents" element={<ManageResidents />} />
        <Route path="/admin/payments" element={<ManagePayments />} />
        <Route path="/admin/utilities" element={<ManageUtilities />} />
        <Route path="/admin/maintenance" element={<ManageMaintenance />} />
        <Route path="/admin/announcements" element={<ManageAnnouncements />} />
        <Route path="/dashboard">
          <Route
            path="resident"
            element={
              <ProtectedRoute>
                <ResidentDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
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
