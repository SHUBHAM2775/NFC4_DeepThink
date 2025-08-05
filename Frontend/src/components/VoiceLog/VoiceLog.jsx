import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { submitVoiceLog } from '../../services/voiceLogAPI';


const VoiceLog = () => {
  const [isListening, setIsListening] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Toggle listening
  const handleToggle = async () => {
  if (!isListening) {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  } else {
    SpeechRecognition.stopListening();

    // Submit transcript to backend here
    if (transcript.trim()) {
      try {
        const dummyUserId = '64cbe981e458d243b5c1e7ab'; // Replace with actual logged-in user ID
        const res = await submitVoiceLog(transcript, dummyUserId);
        alert('Voice log submitted!');
        console.log('Server response:', res);
      } catch (error) {
        alert('Failed to submit voice log');
      }
    }
  }

  setIsListening(!isListening);
};


  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <div style={styles.container}>
      <h2>🎙 Daily Voice Log</h2>

      <button onClick={handleToggle} style={styles.button}>
        {isListening ? '🛑 Stop Recording' : '🎤 Start Recording'}
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
  button: {
    padding: '10px 20px',
    fontSize: '18px',
    backgroundColor: '#4CAF50',
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
