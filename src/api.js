const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

async function request(path, options = {}) {
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
  return { body, response };
}

export async function api(path, options = {}) {
  const { body } = await request(path, options);
  return body;
}

export async function apiWithMeta(path, options = {}) {
  const { body, response } = await request(path, options);
  const page = Number(response.headers.get("X-Page"));
  const pageSize = Number(response.headers.get("X-Page-Size"));
  return {
    data: body,
    meta: {
      page: Number.isInteger(page) && page > 0 ? page : 1,
      pageSize: Number.isInteger(pageSize) && pageSize >= 0 ? pageSize : 0,
      hasMore: response.headers.get("X-Has-More") === "true",
    },
  };
}
