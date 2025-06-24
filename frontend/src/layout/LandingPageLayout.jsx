import { Outlet } from "react-router";

import LandingPageNavbar from "./LandingPageNav";

export default function LandingPageLayout() {
  return (
    <>
      <header>
        <LandingPageNavbar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
