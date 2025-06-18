/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
// import { useApi } from "../api/ApiContext";

const AnnouncementsContext = createContext();

export const announcementsAPI = "http://localhost:8000/announcements";

export default function AnnouncementsProvider({ children }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const { request } = useApi();

  // const result = request();
  const { token } = useAuth();

  async function getAnnoucements() {
    // const result = request("/announcements");
    // setAnnouncements(result);

    setLoading(true);
    axios
      .get(announcementsAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setAnnouncements(res.data);
      })
      .catch((err) => setError(err))
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getAnnoucements();
  }, []);

  const value = { announcements, loading, error, getAnnoucements };
  return (
    <AnnouncementsContext.Provider value={value}>
      {children}
    </AnnouncementsContext.Provider>
  );
}

export function useAnnouncements() {
  const context = useContext(AnnouncementsContext);
  if (!context)
    throw Error("useAnnoucements must be used within AnnoucementsProvider");
  return context;
}
