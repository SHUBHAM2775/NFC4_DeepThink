import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Get total non-admin user count
export const getTotalUserCount = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/total-count`);
    return response.data;
  } catch (error) {
    console.error('Error fetching total user count:', error);
    throw error.response?.data || error;
  }
};

// Get pending ASHA workers count
export const getPendingAshaWorkersCount = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/verification/pending-asha-workers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pending ASHA workers count:', error);
    throw error.response?.data || error;
  }
};

// Get verified ASHA workers count
export const getVerifiedAshaWorkersCount = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/verification/verified-asha-workers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching verified ASHA workers count:', error);
    throw error.response?.data || error;
  }
};

// Get pending verifications list
export const getPendingVerifications = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/verification/pending`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pending verifications:', error);
    throw error.response?.data || error;
  }
};

// Update verification status
export const updateVerificationStatus = async (ashaId, status) => {
  try {
    const response = await axios.patch(`${BASE_URL}/verification/${ashaId}/status`, {
      status: status
    });
    return response.data;
  } catch (error) {
    console.error('Error updating verification status:', error);
    throw error.response?.data || error;
  }
};
