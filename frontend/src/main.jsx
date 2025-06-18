import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ApiProvider } from "./api/ApiContext.jsx";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import "./index.css";
import AnnouncementsProvider from "./Context/AnnouncementsContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ApiProvider>
      <AnnouncementsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AnnouncementsProvider>
    </ApiProvider>
  </AuthProvider>
);
