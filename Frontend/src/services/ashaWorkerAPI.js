import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/asha-worker';

// Get high risk pregnant ladies count
export const getHighRiskPatientsCount = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/pregnant-ladies/high-risk/count`);
    return response.data;
  } catch (error) {
    console.error('Error fetching high risk patients count:', error);
    throw error.response?.data || error;
  }
};

// Get ASHA worker name by ID
export const getAshaWorkerName = async (ashaId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${ashaId}/name`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ASHA worker name:', error);
    throw error.response?.data || error;
  }
};

// Get ASHA worker verification status
export const getAshaWorkerVerificationStatus = async (ashaId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${ashaId}/verification-status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ASHA worker verification status:', error);
    throw error.response?.data || error;
  }
};

// Get all high risk patients (detailed list)
export const getHighRiskPatients = async () => {
  try {
    // This endpoint might need to be created in backend if it doesn't exist
    const response = await axios.get(`${BASE_URL}/pregnant-ladies/high-risk`);
    return response.data;
  } catch (error) {
    console.error('Error fetching high risk patients:', error);
    throw error.response?.data || error;
  }
};

// Get patients assigned to specific ASHA worker
export const getAshaWorkerPatients = async (ashaId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${ashaId}/patients`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ASHA worker patients:', error);
    throw error.response?.data || error;
  }
};

// Get ASHA worker statistics
export const getAshaWorkerStats = async (ashaId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${ashaId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ASHA worker statistics:', error);
    // Return fallback data for demo purposes
    return {
      assignedPatients: 0,
      highRiskCount: 0,
      missedLogs: 0,
      compliance: "0%"
    };
  }
};
