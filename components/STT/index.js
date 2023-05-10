import { useState, useEffect } from "react";
import styles from "./STT.module.css";
import gpt from "@/pages/api/gpt";
import Loader from "../Loader";

export default function STT() {
  const [recognition, setRecognition] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

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

  const handleAskAi = async () => {
    if (isRecording) {
      recognition.stop();
    } else {
      setLoading(true);
      const response = await askAi(transcript);
      setChatHistory([...chatHistory, { type: "user", message: transcript }]);
      setChatHistory([...chatHistory, { type: "ai", message: response }]);
      setTranscript("");
      setLoading(false);
    }
  };

  return (
    <>
      <main className={styles.main}>
        <button onClick={toggleRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <div className={styles.chatbox}>
          {chatHistory.map((item, index) => (
            <div
              key={index}
              className={styles.chatMessage + " " + styles[item.type]}
            >
              {item.message}
            </div>
          ))}
        </div>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            placeholder="Type your message here"
          />
          <button onClick={handleAskAi}>Ask AI</button>
        </div>
        <div>
          <button onClick={() => setChatHistory([])}>Clear Chat History</button>
        </div>
        <div>{loading && <Loader />}</div>
      </main>
    </>
  );
}
