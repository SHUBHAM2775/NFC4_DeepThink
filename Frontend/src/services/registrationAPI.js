import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/register';

// Register Admin
export const registerAdmin = async (userData) => {
  try {
    const cleanPhone = userData.phone.replace(/\s/g, '').replace(/\+91/g, '');
    const response = await axios.post(`${BASE_URL}/admin`, {
      name: userData.name,
      phoneNumber: cleanPhone
    });
    return response.data;
  } catch (error) {
    console.error('Error registering admin:', error);
    
    // Extract detailed error information
    const errorResponse = error.response?.data;
    const errorMessage = errorResponse?.error || error.message || "Registration failed";
    const errorDetails = errorResponse?.details || null;
    
    throw {
      message: errorMessage,
      details: errorDetails,
      status: error.response?.status || 500,
      originalError: errorResponse || error
    };
  }
};

// Register ASHA Worker
export const registerAshaWorker = async (userData, questionnaireData) => {
  try {
    console.log("Frontend sending ASHA worker data:", {
      userData,
      questionnaireData
    });

    // Validate required fields before sending
    if (!userData?.name) {
      console.error("Validation failed: User name is missing");
      throw new Error("User name is required");
    }
    if (!userData?.phone) {
      console.error("Validation failed: User phone is missing");
      throw new Error("User phone number is required");
    }
    if (!questionnaireData?.ashaId) {
      console.error("Validation failed: ASHA ID is missing");
      throw new Error("ASHA ID is required");
    }

    // Clean and validate phone number
    const cleanPhone = userData.phone.replace(/\s/g, '').replace(/\+91/g, '');
    console.log("Cleaned phone number:", cleanPhone);

    const payload = {
      ashaId: questionnaireData.ashaId.trim(),
      name: userData.name.trim(),
      phoneNumber: cleanPhone,
      documents: questionnaireData.documents || [],
      phc: questionnaireData.phc || '',
      village: questionnaireData.village || '',
      district: questionnaireData.district || '',
      state: questionnaireData.state || ''
    };

    console.log("Final payload being sent to backend:", payload);
    console.log("Payload validation:");
    console.log("- ashaId:", payload.ashaId, "Length:", payload.ashaId.length);
    console.log("- name:", payload.name, "Length:", payload.name.length);
    console.log("- phoneNumber:", payload.phoneNumber, "Length:", payload.phoneNumber.length);

    const response = await axios.post(`${BASE_URL}/asha`, payload);
    return response.data;
  } catch (error) {
    console.error('Error registering ASHA worker:', error);
    console.error('Error response:', error.response?.data);
    console.error('Status code:', error.response?.status);
    console.error('Full error object:', error);
    
    // Return detailed error information
    const errorMessage = error.response?.data?.error || error.message || "Unknown error occurred";
    const errorDetails = error.response?.data?.details || null;
    
    throw {
      message: errorMessage,
      details: errorDetails,
      status: error.response?.status,
      originalError: error.response?.data || error
    };
  }
};

// Register Pregnant Lady/Patient
export const registerPregnantLady = async (userData, questionnaireData) => {
  try {
    console.log("Frontend sending pregnant lady data:", {
      userData,
      questionnaireData
    });

    const cleanPhone = userData.phone.replace(/\s/g, '').replace(/\+91/g, '');
    const payload = {
      name: userData.name,
      phoneNumber: cleanPhone,
      village: questionnaireData.village || '',
      district: questionnaireData.district || '',
      state: questionnaireData.state || '',
      currentlyPregnant: questionnaireData.isPregnant || false,
      firstPregnancy: questionnaireData.isFirstPregnancy || false,
      visitedDoctorOrASHA: questionnaireData.hasVisitedDoctor || false,
      monthsPregnant: questionnaireData.monthsAlong || 1,
      knownHealthIssues: questionnaireData.hasHealthIssues || false, // This can be 'true', 'false', or 'unsure'
      recentSymptoms: questionnaireData.hasRecentSymptoms || false,
      takingSupplements: questionnaireData.takingVitamins || false,
      hasMobileInEmergency: questionnaireData.hasMobileAccess || false
    };

    console.log("Final payload being sent to backend:", payload);

    const response = await axios.post(`${BASE_URL}/lady`, payload);
    return response.data;
  } catch (error) {
    console.error('Error registering pregnant lady:', error);
    console.error('Error response:', error.response?.data);
    console.error('Status code:', error.response?.status);
    
    // Extract detailed error information
    const errorResponse = error.response?.data;
    const errorMessage = errorResponse?.error || error.message || "Registration failed";
    const errorDetails = errorResponse?.details || null;
    
    throw {
      message: errorMessage,
      details: errorDetails,
      status: error.response?.status || 500,
      originalError: errorResponse || error
    };
  }
};
