import { useState, useEffect } from 'react';
import annyang from 'annyang';
import styles from './STT.module.css';

export default function STT() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (annyang) {
      const commands = {
        '*text': (text) => setTranscript(text)
      };
      annyang.addCommands(commands);
    }

    return () => {
      if (annyang) {
        annyang.abort();
      }
    };
  }, []);

  const startListening = () => {
    if (annyang) {
      annyang.start({ autoRestart: false });
      setListening(true);
    }
  };

  const stopListening = () => {
    if (annyang) {
      annyang.abort();
      setListening(false);
    }
  };

  return (
    <main className={styles.main}>
      <h1>Speech-to-Text</h1>
      <div className={styles.buttonContainer}>
        {!listening && <button onClick={startListening}>Start Recording</button>}
        {listening && <button onClick={stopListening}>Stop Recording</button>}
      </div>
      <div className={styles.transcriptContainer}>
        <p>{transcript}</p>
      </div>
    </main>
  );
}
