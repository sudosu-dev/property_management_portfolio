import { API } from "./ApiContext";

export async function fetchRequests(token) {
  try {
    const res = await fetch(`${API}/maintenance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch requests");
    return await res.json();
  } catch (err) {
    console.error("Error loading request:", err);
    throw err;
  }
}

export async function createRequest(formData, token) {
  try {
    const res = await fetch(`${API}/maintenance`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to create request.");
    return await res.json();
  } catch (err) {
    console.error("Error creating request:", err);
    throw err;
  }
}

export async function updateRequest(id, data, token) {
  try {
    const res = await fetch(`${API}/maintenance/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    const result = await res.json();
    if (!res.ok) throw new Error("Failed to update request.");
    return result;
  } catch (err) {
    console.error("Error updating request:", err);
    throw err;
  }
}

export async function deleteRequest(id, token) {
  try {
    const res = await fetch(`${API}/maintenance/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete request.");
    return await res.json();
  } catch (err) {
    console.error("Error deleting request:", err);
    throw err;
  }
}

export async function markRequestComplete(id, token) {
  try {
    const res = await fetch(`${API}/maintenance/${id}/completion`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: true }),
    });
    if (!res.ok) throw new Error("Failed to mark complete.");
    return await res.json();
  } catch (err) {
    console.error("Error marking complete:", err);
    throw err;
  }
}

export async function fetchUserWithUnitNumber(id, token) {
  try {
    const res = await fetch(`${API}/users/${id}/unit`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch user with unit.");
    return await res.json();
  } catch (err) {
    console.error("Errorfetching user with unit:", err);
    throw err;
  }
}

export async function fetchUnits(token) {
  try {
    const res = await fetch(`${API}/units`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch units.");
    return await res.json();
  } catch (err) {
    console.error("Errorfetching user with unit:", err);
    throw err;
  }
}
