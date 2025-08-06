import axios from 'axios';

const API_URL = 'http://localhost:5000/api/voice'; // Backend API URL

export const submitVoiceLog = async (transcript, userId, week = null, language = null) => {
  try {
    const res = await axios.post(`${API_URL}/submit`, {
      transcript,
      userId,
      week,
      language
    });
    return res.data;
  } catch (err) {
    console.error('Error submitting voice log:', err);
    throw err;
  }
};

export const getVoiceLogHistory = async (userId, limit = 10) => {
  try {
    const res = await axios.get(`${API_URL}/history/${userId}?limit=${limit}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching voice log history:', err);
    throw err;
  }
};

export const getAIGuidance = async (dailyLog, userId, week, userProfile = {}, language = null) => {
  try {
    const res = await axios.post(`${API_URL}/guidance`, {
      dailyLog,
      userId,
      week,
      userProfile,
      language
    });
    return res.data;
  } catch (err) {
    console.error('Error getting AI guidance:', err);
    throw err;
  }
};

export const getChatGuidance = async (message, userId, language = null) => {
  try {
    const res = await axios.post(`${API_URL}/chat`, {
      message,
      userId, 
      language
    });
    return res.data;
  } catch (err) {
    console.error('Error getting chat guidance:', err);
    throw err;
  }
};
