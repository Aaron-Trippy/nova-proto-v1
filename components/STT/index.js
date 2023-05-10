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
    const userMessage = { type: "user", message: transcript };

    if (isRecording) {
      recognition.stop();
    } else {
      setLoading(true);
      const response = await askAi(
        [...chatHistory, userMessage].map((item) => item.message).join("\n")
      );
      const aiMessage = { type: "ai", message: response };

      setChatHistory((prevChat) => [...prevChat, userMessage, aiMessage]);
      setTranscript("");
      setLoading(false);
    }
  };

  return (
    <>
      <main className={styles.main}>
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
          <button onClick={toggleRecording} className={styles.recording}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
          <input
            type="text"
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            placeholder="Type your message here"
            className={styles.inputBox}
          />
          <button onClick={handleAskAi} className={styles.send}>
            Send
          </button>
        </div>
        <div>
          <button
            onClick={() => setChatHistory([])}
            className={styles.clearHistory}
          >
            Clear Chat History
          </button>
        </div>
        <div>{loading && <Loader />}</div>
      </main>
    </>
  );
}
