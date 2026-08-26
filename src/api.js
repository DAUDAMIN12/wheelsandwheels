const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export async function api(path, options = {}) {
  const token = localStorage.getItem("ww-admin-token");
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "We could not reach the store server. Please check your connection and try again.",
    );
  }
  const body =
    response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.message || "Request failed");
  return body;
}
