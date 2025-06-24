import { API } from "./ApiContext";

export async function fetchRequests(token) {
  try {
    const res = await fetch(`${API}/maintenance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch requests");
    }
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
    if (!res.ok) {
      throw new Error("Failed to create request.");
    }
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
    if (!res.ok) {
      throw new Error("Failed to update request.");
    }
    return await res.json();
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
    if (!res.ok) {
      throw new Error("Failed to delete request.");
    }
    return await res.json();
  } catch (err) {
    console.error("Error deleting request:", err);
    throw err;
  }
}
