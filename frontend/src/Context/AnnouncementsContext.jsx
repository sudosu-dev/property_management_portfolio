/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useAuth } from "../auth/AuthContext";

const AnnouncementsContext = createContext();

export const announcementsAPI = "http://localhost:8000/announcements";

export default function AnnouncementsProvider({ children }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState();

  const { token } = useAuth();

  async function getAnnouncements() {
    setLoading(true);
    axios
      .get(announcementsAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAnnouncements(res.data.slice(0, 15));
      })
      .catch((err) => setError(err))
      .finally(() => {
        setLoading(false);
      });
  }

  async function postNewAnnouncement(announcementObj) {
    const result = axios
      .post(announcementsAPI, announcementObj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStatus(res.status);
        return res.status;
      })
      .catch((err) => {
        setError(err);
        console.log(err);
      });

    return result;
  }

  const value = {
    announcements,
    loading,
    error,
    getAnnouncements,
    status,
    postNewAnnouncement,
  };
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
