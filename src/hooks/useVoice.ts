import { useEffect, useState } from "react";

const useVoice = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState(0);

  useEffect(() => {
    const handleVoicesChanged = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    handleVoicesChanged(); // Initial call in case voices are already loaded

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleSpeak = (AIResponse: string) => {
    if (!window.speechSynthesis) {
      alert("Your browser does not support speech synthesis.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(AIResponse);
    if (voices.length > 0) utterance.voice = voices[selectedVoice];
    window.speechSynthesis.speak(utterance);
  };

  return {
    voices,
    handleSpeak,
    selectedVoice,
    setSelectedVoice,
  };
};

export default useVoice;
