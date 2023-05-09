import { useState, useEffect } from 'react';
import styles from './STT.module.css';

export default function STT() {
    const [recognition, setRecognition] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
  
    useEffect(() => {
      if (!('webkitSpeechRecognition' in window)) {
        console.log('Speech recognition not available');
        return;
      }
  
      const newRecognition = new window.webkitSpeechRecognition();
      newRecognition.continuous = true;
      newRecognition.interimResults = true;
      newRecognition.lang = 'en-US';
  
      newRecognition.onstart = () => {
        console.log('Speech recognition started');
        setIsRecording(true);
      };
  
      newRecognition.onresult = (event) => {
        let newTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            newTranscript += result[0].transcript;
          }
        }
        setTranscript((prevTranscript) => prevTranscript + newTranscript);
      };
  
      newRecognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
  
      newRecognition.onend = () => {
        console.log('Speech recognition ended');
        setIsRecording(false);
      };
  
      setRecognition(newRecognition);
    }, []);
  
    const toggleRecording = () => {
      if (isRecording) {
        recognition.stop();
      } else {
        recognition.start();
      }
    };
  
    return (
      <>
        <main className={styles.main}>
            <button onClick={toggleRecording}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <div>{transcript}</div>
        </main>
      </>
    );
  };