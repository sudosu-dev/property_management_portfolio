import { API } from "./ApiContext";

export async function fetchRequests(token) {
  try {
    const res = await fetch(`${API}/maintenance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch requests");
    return res.json();
  } catch (err) {
    console.error("Error loading maintenance request:", err);
  }
}

export async function createRequest(formData, token) {
  const res = await fetch(`${API}/maintenance`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Request failed.");
  }
  return res.json();
}
