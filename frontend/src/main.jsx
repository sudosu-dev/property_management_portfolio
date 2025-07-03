import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ApiProvider } from "./api/ApiContext.jsx";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import "./index.css";
import AnnouncementsProvider from "./Context/AnnouncementsContext.jsx";
import UsersProvider from "./Context/UsersContext.jsx";
import { NotificationProvider } from "./Context/NotificationContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ApiProvider>
      <UsersProvider>
        <AnnouncementsProvider>
          <NotificationProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </NotificationProvider>
        </AnnouncementsProvider>
      </UsersProvider>
    </ApiProvider>
  </AuthProvider>
);
