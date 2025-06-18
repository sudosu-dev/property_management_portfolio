import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Payments from "./pages/Payments/Payments";
import Ledger from "./pages/Payments/Ledger";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<p>Home page</p>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payments" element={<Payments />} />;
        <Route path="/ledger" element={<Ledger />} />;
      </Route>
    </Routes>
  );
}
