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
