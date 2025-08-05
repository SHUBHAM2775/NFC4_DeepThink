import axios from 'axios';

const API_URL = 'http://localhost:5000/api/voice/submit'; // Update with actual backend URL/port

export const submitVoiceLog = async (transcript, userId) => {
  try {
    const res = await axios.post(API_URL, {
      transcript,
      userId,
    });
    return res.data;
  } catch (err) {
    console.error('Error submitting voice log:', err);
    throw err;
  }
};
