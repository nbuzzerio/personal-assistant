import { useEffect, useState } from "react";

const useVoice = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const handleVoicesChanged = () => {
      const loadedVoices = window.speechSynthesis.getVoices();
      setVoices(loadedVoices);
      setSelectedVoice(loadedVoices[0]?.name);
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    handleVoicesChanged(); // Initial call in case voices are already loaded

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleSpeak = (AIResponse: string, lang: string) => {
    if (!window.speechSynthesis) {
      alert("Your browser does not support speech synthesis.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(AIResponse);
    utterance.lang = lang;
    utterance.voice =
      voices.find((voice) => voice.name === selectedVoice) || null;

    if (
      selectedVoice &&
      voices.find((voice) => voice.name === selectedVoice)?.lang !== lang
    ) {
      const detectedVoice = voices.find((voice) => voice.lang === lang);

      if (detectedVoice) {
        utterance.voice = detectedVoice;
        console.log("voice seleceted :", detectedVoice.name, selectedVoice);

        setSelectedVoice(detectedVoice.name);
      }
    }
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
