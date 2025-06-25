/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { API } from "../api/ApiContext";

const UsersContext = createContext();

export const usersAPI = API + "/users";

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

  async function putUser(userObj) {
    const result = axios
      .put(usersAPI + "/" + userObj.id, userObj, {
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

  const registerUser = async (credentials) => {
    const response = await fetch(API + "/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const result = await response.json();
    if (!response.ok) throw Error(result.error || "Registration Failed.");
  };

  const value = {
    users,
    loading,
    error,
    getUsers,
    putUser,
    registerUser,
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
