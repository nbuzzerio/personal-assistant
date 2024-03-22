import { useEffect, useState } from "react";

let recognition: SpeechRecognition | null = null;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";
}

const useSpeechRecognition = () => {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("en-US");
  const [isListening, setListening] = useState(false);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      setText(e.results[0][0].transcript);
      setListening(false);
      recognition?.stop();
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

  const changeLang = (lang: string) => {
    if (!recognition) return null;
    recognition.lang = lang;
    setLang(lang);
  };

  const inputText = (text: string) => {
    setText(text);
  };

  return {
    text,
    lang,
    inputText,
    changeLang,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognition,
  };
};

export default useSpeechRecognition;
