import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { submitVoiceLog } from '../../services/voiceLogAPI';

const VoiceLog = ({ user, onNavigateBack }) => {
  const [isListening, setIsListening] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Get user ID - prioritize user.id, then user._id, then fallback to hardcoded demo ID
  const getUserId = () => {
    if (user?.id) {
      return user.id;
    }
    if (user?._id) {
      return user._id;
    }
    if (user?.refId && user.refId !== "demo_ref_" + user.refId) {
      return user.refId;
    }
    // Fallback to demo ID for testing
    console.warn('No valid user ID found in VoiceLog, using demo ID');
    return "6892683647b1656bc9d5f7ea";
  };

  // Toggle listening
  const handleToggle = async () => {
    if (!listening) {
      // Start recording
      resetTranscript();
      setIsListening(true);
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    } else {
      // Stop recording
      SpeechRecognition.stopListening();
      setIsListening(false);
      
      // Submit transcript to backend here
      if (transcript.trim()) {
        try {
          const userId = getUserId();
          console.log('Submitting voice log for user:', userId);
          const res = await submitVoiceLog(transcript, userId);
          alert('Voice log submitted successfully!');
          console.log('Server response:', res);
          resetTranscript(); // Clear transcript after successful submission
        } catch (error) {
          console.error('Error submitting voice log:', error);
          alert('Failed to submit voice log. Please try again.');
        }
      }
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <div style={styles.container}>
      {/* Header with Back Button */}
      <div style={styles.header}>
        <button onClick={onNavigateBack} style={styles.backButton}>
          ← Back to Dashboard
        </button>
      </div>
      
      <h2>🎙 Daily Voice Log</h2>
      <button 
        onClick={handleToggle} 
        style={{
          ...styles.button,
          backgroundColor: listening ? '#ef4444' : '#4CAF50'
        }}
      >
        {listening ? '🛑 Stop Recording' : '🎤 Start Recording'}
      </button>
      <div style={styles.transcriptBox}>
        <h4>Transcript:</h4>
        <p>{transcript || 'Speak now...'}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: 'auto',
    marginTop: '40px',
    textAlign: 'center'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    justifyContent: 'flex-start'
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '18px',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '20px'
  },
  transcriptBox: {
    border: '1px solid #eee',
    padding: '15px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    textAlign: 'left'
  }
};

export default VoiceLog;
