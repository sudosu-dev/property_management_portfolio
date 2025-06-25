import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Announcements from "./pages/Announcements/Announcements";
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
import AddPropertyForm from "./pages/ManagePropertyInfo/AddPropertyForm";
import EditPropertyForm from "./pages/ManagePropertyInfo/EditPropertyForm";
import ManageSettings from "./pages/ManageUtilities/ManageSettings";
import ManageTenantLedger from "./pages/ManagePayments/ManageTenantLedger";
import AddUnitForm from "./pages/ManageUnits/AddUnitForm";
import EditUnitForm from "./pages/ManageUnits/EditUnitForm";
import AddResidentForm from "./pages/ManageResidents/AddResidentForm";
import EditResidentForm from "./pages/ManageResidents/EditResidentForm";
import ViewResident from "./pages/ManageResidents/ViewResident";
import Contact from "./pages/Contact/Contact";
import Error404 from "./Error404";
import LandingPageLayout from "./layout/LandingPageLayout";
import ManageUsers from "./pages/ManageUsers/ManageUsers";

export default function App() {
  return (
    <Routes>
      <Route element={<LandingPageLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<Layout />}>
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
        <Route
          path="/ledger"
          element={
            <ProtectedRoute>
              <Ledger />
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
        <Route
          path="/announcements"
          element={
            <ProtectedRoute>
              <Announcements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireManager={true}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/propertyinfo"
          element={
            <ProtectedRoute requireManager={true}>
              <ManagePropertyInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/addproperty"
          element={
            <ProtectedRoute requireManager={true}>
              <AddPropertyForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/editproperty/:id"
          element={
            <ProtectedRoute requireManager={true}>
              <EditPropertyForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/units"
          element={
            <ProtectedRoute requireManager={true}>
              <ManageUnits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/addunit"
          element={
            <ProtectedRoute requireManager={true}>
              <AddUnitForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/editunit/:id"
          element={
            <ProtectedRoute requireManager={true}>
              <EditUnitForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/residents"
          element={
            <ProtectedRoute requireManager={true}>
              <ManageResidents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/addresident"
          element={
            <ProtectedRoute requireManager={true}>
              <AddResidentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/editresident/:id"
          element={
            <ProtectedRoute requireManager={true}>
              <EditResidentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/viewresident/:id"
          element={
            <ProtectedRoute requireManager={true}>
              <ViewResident />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute requireManager={true}>
              <ManagePayments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/utilities"
          element={
            <ProtectedRoute requireManager={true}>
              <ManageUtilities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/maintenance"
          element={
            <ProtectedRoute requireManager={true}>
              <ManageMaintenance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <ProtectedRoute requireManager={true}>
              <ManageAnnouncements />
            </ProtectedRoute>
          }
        />
        <Route path="/admin">
          <Route
            path="settings"
            element={
              <ProtectedRoute requireManager={true}>
                <ManageSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="ledger/:userId"
            element={
              <ProtectedRoute requireManager={true}>
                <ManageTenantLedger />
              </ProtectedRoute>
            }
          />
          <Route
            path="maintenance"
            element={
              <ProtectedRoute requireManager={true}>
                <ManageMaintenance />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
}
