/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useAuth } from "../auth/AuthContext";

const UsersContext = createContext();

export const usersAPI = "http://localhost:8000/users";

export default function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuth();

  async function getUsers() {
    setLoading(true);
    axios
      .get(usersAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => setError("Error GETTING users:" + err))
      .finally(() => {
        setLoading(false);
      });
  }

  async function postUsers(userObj) {
    const result = axios
      .post(usersAPI, userObj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        return res.status;
      })
      .catch((err) => {
        setError(err);
        console.log(err);
      });

    return result;
  }

  const value = {
    users,
    loading,
    error,
    getUsers,
    postUsers,
  };
  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (!context) throw Error("useUsers must be used within UsersProvider");
  return context;
}
