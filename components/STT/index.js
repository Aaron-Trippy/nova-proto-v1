import { useState, useEffect } from "react";
import styles from "./STT.module.css";
import gpt from "@/pages/api/gpt";
import Loader from "../Loader";

export default function STT() {
  const [recognition, setRecognition] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const { askAi } = gpt();

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.log("Speech recognition not available");
      return;
    }

    const newRecognition = new window.webkitSpeechRecognition();
    newRecognition.continuous = true;
    newRecognition.interimResults = true;
    newRecognition.lang = "en-US";

    newRecognition.onstart = () => {
      console.log("Speech recognition started");
      setIsRecording(true);
    };

    newRecognition.onresult = (event) => {
      let newTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          newTranscript += result[0].transcript;
        }
      }
      setTranscript((prevTranscript) => prevTranscript + newTranscript);
    };

    newRecognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    newRecognition.onend = () => {
      console.log("Speech recognition ended");
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
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <div>{transcript}</div>
        <div className={styles.askai}>
          <button
            onClick={async () => {
              if (isRecording == true) {
                recognition.stop();
              } else {
                setLoading(true);
                const response = await askAi(transcript);
                setTranscript(response);
                setLoading(false);
              }
            }}
          >
            Ask AI
          </button>
        </div>
        <div>
          <button onClick={() => setTranscript("")}>Clear Transcript</button>
        </div>
        <div>{loading && <Loader />}</div>
      </main>
    </>
  );
}
