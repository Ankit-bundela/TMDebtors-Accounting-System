/*const BASE_URL = "http://127.0.0.1:8000";

export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  return fetch(BASE_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });
};*/

const BASE_URL = "http://127.0.0.1:8000";

export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(BASE_URL + url, {
    ...options,
    headers,
  });
};