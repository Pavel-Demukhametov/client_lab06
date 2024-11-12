import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const fetchNodes = async () => {
  const response = await axios.get(`${API_BASE_URL}/nodes`);
  return response.data;
};

export const fetchNodeWithRelationships = async (nodeId) => {
  const response = await axios.get(`${API_BASE_URL}/node/${nodeId}`);
  return response.data;
};

export const getToken = async (username, password) => {
  const response = await axios.post(
    `${API_BASE_URL}/token`,
    new URLSearchParams({
      username,
      password,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return response.data.access_token;
};