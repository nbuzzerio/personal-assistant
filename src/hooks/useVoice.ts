import { useEffect, useState } from "react";

const useVoice = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>(
    undefined,
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    const handleVoicesChanged = () => {
      const loadedVoices = window.speechSynthesis.getVoices();
      setVoices(loadedVoices);
      setSelectedVoice(loadedVoices[0]?.name);
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    handleVoicesChanged();

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

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeak = () => {
    window.speechSynthesis.cancel(); // This stops the speech synthesis
    setIsSpeaking(false); // Update the isSpeaking state accordingly
  };

  return {
    voices,
    stopSpeak,
    isSpeaking,
    handleSpeak,
    selectedVoice,
    setSelectedVoice,
  };
};

export default useVoice;
