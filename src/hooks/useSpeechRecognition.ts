import { useEffect, useState } from "react";

let recognition: SpeechRecognition | null = null;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";
}

const useSpeechRecognition = () => {
  const [text, setText] = useState("");
  const [isListening, setListening] = useState(false);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      console.log("onResult: ", e);
      setText(e.results[0][0].transcript);
      recognition.stop();
      setListening(false);
    };
  }, []);

  const startListening = () => {
    setText("");
    setListening(true);
    recognition?.start();
  };

  const stopListening = () => {
    setListening(false);
    recognition?.stop();
  };

  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognition,
  };
};

export default useSpeechRecognition;
