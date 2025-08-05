import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/pregnant-lady';

// Get nearby ASHA workers for a pregnant lady
export const getNearbyAshaWorkers = async (pregnantLadyId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${pregnantLadyId}/nearby-asha-workers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby ASHA workers:', error);
    throw error.response?.data || error;
  }
};

// Assign ASHA worker to pregnant lady
export const assignAshaWorker = async (assignmentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/assigned`, assignmentData);
    return response.data;
  } catch (error) {
    console.error('Error assigning ASHA worker:', error);
    throw error.response?.data || error;
  }
};
