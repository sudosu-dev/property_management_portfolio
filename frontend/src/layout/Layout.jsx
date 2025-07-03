import { Outlet } from "react-router";
import Navbar from "./Navbar";
import NotificationDisplay from "../components/NotificationDisplay";

export default function Layout() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
      <NotificationDisplay />
    </>
  );
}
