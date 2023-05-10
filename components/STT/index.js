import { useState, useEffect } from "react";
import styles from "./STT.module.css";
import gpt from "@/pages/api/gpt";
import Loader from "../Loader";
import { useRef } from "react";

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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAskAi();
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
      const aiMessage = { type: "ai", message: "" };

      setChatHistory((prevChat) => [...prevChat, userMessage, aiMessage]);
      setTranscript("");
      setLoading(false);

      let responseIndex = 0;
      const typingEffectInterval = setInterval(() => {
        if (responseIndex < response.length) {
          aiMessage.message += response[responseIndex];
          setChatHistory((prevChat) => [...prevChat]);
          responseIndex++;
        } else {
          clearInterval(typingEffectInterval);
        }
      }, 27.5);
    }
  };

  const endref = useRef(null);

  const scrollToBottom = () => {
    endref.current.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

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
        <div ref={endref}></div>
        <div className={styles.inputContainer}>
          <div className={styles.messageContainer}>
            <button onClick={toggleRecording} className={styles.recording}>
              {isRecording ? "Stop" : "Rec"}
            </button>
            <input
              type="text"
              value={transcript}
              onChange={(event) => setTranscript(event.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Message Nova"
              className={styles.inputBox}
            />
            <button onClick={handleAskAi} className={styles.send}>
              Send
            </button>
          </div>
          <button
            onClick={() => setChatHistory([])}
            className={styles.clearHistory}
          >
            Clear Chat History
          </button>
        </div>
        <div></div>
        <div className={styles.loader}>{loading && <Loader />}</div>
      </main>
    </>
  );
}
