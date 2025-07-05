import { Outlet } from "react-router";
import LandingPageNavbar from "./LandingPageNav";

export default function LandingPageLayout() {
  return (
    <>
      <LandingPageNavbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
