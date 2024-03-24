import { useEffect, useState } from "react";
import { useTheme } from "./components/ThemeContext/ThemeContext";
import useSpeechRecognition from "./hooks/useSpeechRecognition";
import useVoice from "./hooks/useVoice";
import getTranslation from "./utils/translate";
import * as wanakana from "wanakana";

import { PiSpeakerHighFill } from "react-icons/pi";
import { PiSpeakerNoneFill } from "react-icons/pi";

const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3008";

function App() {
  const theme = useTheme();
  const [AIResponse, setAIResponse] = useState("");
  const [typeUser, setTypeUser] = useState("");
  const [typeResponse, setTypeResponse] = useState("");
  const {
    text,
    lang,
    inputText,
    changeLang,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  const [userTranslation, setUserTranslation] = useState("");
  const [AIResponseTranslation, setAIResponseTranslation] = useState("");
  const [userRomanji, setUserRomanji] = useState("");
  const [AIResponseRomanji, setAIResponseRomanji] = useState("");

  const {
    voices,
    stopSpeak,
    isSpeaking,
    handleSpeak,
    selectedVoice,
    setSelectedVoice,
  } = useVoice();

  useEffect(() => {
    if (lang === "ja-JP") {
      setUserRomanji(wanakana.toRomaji(text));
    }
  }, [userTranslation]);

  useEffect(() => {
    if (lang === "ja-JP") {
      setAIResponseRomanji(wanakana.toRomaji(AIResponse));
    }
  }, [AIResponseTranslation]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/api/ai?query=${text}`, {
          signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setAIResponse(result.message.content);
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.log("Fetch error:", error);
        }
      }
    };

    if (lang !== "en-US") {
      (async () => {
        const translation = await getTranslation(text, lang);
        setUserTranslation(translation);
      })();
    }
    setUserRomanji("");

    if (text) fetchData();

    return () => {
      controller.abort();
    };
  }, [text]);

  useEffect(() => {
    handleSpeak(AIResponse, lang);
    setAIResponseRomanji("");
    if (lang !== "en-US") {
      (async () => {
        const translation = await getTranslation(AIResponse, lang);
        setAIResponseTranslation(translation);
      })();
    }
  }, [AIResponse]);

  const handleTypeUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    inputText(typeUser);
    setTypeUser("");
  };
  const handleTypeResponse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAIResponse(typeResponse);
    setTypeResponse("");
  };

  return (
    <div
      className={`theme ${theme ? "bg-black/80" : "bg-gray-800"} flex min-h-screen flex-col items-center`}
    >
      <h1 className="text z-10 w-full p-3 text-xl font-extrabold uppercase text-red-700/70 underline md:w-auto md:py-10 md:text-center md:text-7xl 2xl:text-9xl">
        Personal Assistant
      </h1>
      <section className="flex h-full w-full max-w-5xl flex-grow flex-col justify-between">
        <div className="py-5">
          {hasRecognitionSupport ? (
            <div className="mx-auto flex flex-col items-center justify-center gap-5">
              <div className="flex w-full flex-col items-center justify-center gap-2 md:w-auto md:flex-row md:gap-10">
                <button
                  className="w-11/12 rounded-lg border px-10 py-10 text-white/80 transition-all duration-300 hover:border-white hover:bg-black/50 hover:text-white active:text-red-700 md:w-auto md:py-2"
                  onClick={startListening}
                >
                  Start Listening
                </button>
                <div
                  className={`absolute right-1 top-1 h-10 w-10 rounded-full border md:relative ${isListening ? "bg-red-700" : "bg-black/80"}`}
                ></div>
                <button
                  className="w-11/12 rounded-lg border px-10 py-10 text-white/80 transition-all duration-300 hover:border-white hover:bg-black/50 hover:text-white active:text-red-700 md:w-auto md:py-2"
                  onClick={stopListening}
                >
                  Stop Listening
                </button>
              </div>
              <div className="w-full px-5">
                <p className="w-full text-white">User: {text}</p>
                {userRomanji && (
                  <p className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-white hover:whitespace-normal">
                    Romanji: {userRomanji}
                  </p>
                )}
                {userTranslation && (
                  <p className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-white hover:whitespace-normal">
                    Translation: {userTranslation}
                  </p>
                )}
              </div>
              <div className="w-full px-5">
                <p className="flex w-full items-start justify-start gap-2 text-white">
                  Assistant
                  <button
                    className="translate-y-1/3"
                    onClick={() =>
                      isSpeaking ? stopSpeak() : handleSpeak(AIResponse, lang)
                    }
                  >
                    {isSpeaking ? (
                      <PiSpeakerHighFill className="fill-red-700" />
                    ) : (
                      <PiSpeakerNoneFill className="fill-black" />
                    )}
                  </button>
                  : {AIResponse}
                </p>
                {AIResponseRomanji && (
                  <p className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-white hover:whitespace-normal">
                    Romanji: {AIResponseRomanji}
                  </p>
                )}
                {AIResponseTranslation && (
                  <p className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-white hover:whitespace-normal">
                    Translation: {AIResponseTranslation}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <h2 className="text-5xl font-bold text-red-600">
              Speech not supported in browser
            </h2>
          )}
        </div>
        <div className="flex flex-col gap-2 px-5 pb-10 text-white">
          <form
            onSubmit={handleTypeUser}
            className="flex w-full flex-col gap-2"
          >
            Type Question:
            <div className="flex w-full flex-col gap-5 sm:flex-row">
              <input
                type="text"
                value={typeUser}
                onChange={(e) => setTypeUser(e.target.value)}
                className="grow bg-black/40"
              />
              <input
                type="submit"
                className="rounded-sm border bg-black/40 px-5"
              />
            </div>
          </form>
          <form
            onSubmit={handleTypeResponse}
            className="flex w-full flex-col gap-2"
          >
            Type Response:
            <div className="flex w-full flex-col gap-5 sm:flex-row">
              <input
                type="text"
                value={typeResponse}
                onChange={(e) => setTypeResponse(e.target.value)}
                className="grow bg-black/40"
              />
              <input
                type="submit"
                className="rounded-sm border bg-black/40 px-5"
              />
            </div>
          </form>
          Choose Lang:
          <select
            className="w-full bg-black/40"
            onChange={(e) => changeLang(e.target.value)}
          >
            <option value="en-US">English</option>
            <option value="ja-JP">Japanese</option>
            <option value="it-IT">Italiano</option>
          </select>
          Choose Voice:
          <select
            className="w-full bg-black/40"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            {voices &&
              voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {`${voice.name} (${voice.lang})`}
                </option>
              ))}
          </select>
        </div>
      </section>
    </div>
  );
}

export default App;
