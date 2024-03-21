import { useEffect, useState } from "react";
import { useTheme } from "./components/ThemeContext/ThemeContext";
import useSpeechRecognition from "./hooks/useSpeechRecognition";

function App() {
  const theme = useTheme();
  const {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  const [response, setResponse] = useState("");
  console.log("isListening: ", isListening);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3008/api/ai?query=${text}`,
          { signal },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("result::::::::: ", result);
        setResponse(result.message.content);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.log("Fetch error:", error);
        }
      }
    };

    if (text) fetchData();

    return () => {
      controller.abort();
    };
  }, [text]);

  return (
    <div
      className={`theme ${theme ? "bg-gray-700" : "bg-gray-800"} flex min-h-screen flex-col items-center`}
    >
      <h1 className="text p-2 w-full md:w-auto md:text-center text-xl font-extrabold uppercase text-red-950 underline md:py-10 md:text-7xl 2xl:text-9xl">
        Personal Assistant
      </h1>
      <section className="w-full max-w-5xl">
        {hasRecognitionSupport ? (
          <div className="mx-auto flex flex-col items-center justify-center">
            <div className="flex w-full flex-col items-center justify-center gap-2 md:gap-10 md:w-auto md:flex-row">
              <button
                className="w-11/12 rounded-lg border px-10 py-10 text-black transition-all duration-300 hover:border-white hover:bg-black/50 hover:text-white md:w-auto md:py-2"
                onClick={startListening}
              >
                Start Listening
              </button>
              <div
                className={`absolute top-0 right-0 md:relative h-10 w-10 rounded-full border ${isListening ? "bg-red-700" : "bg-black/80"}`}
              ></div>
              <button
                className="w-11/12 rounded-lg border px-10 py-10 text-black transition-all duration-300 hover:border-white hover:bg-black/50 hover:text-white md:w-auto md:py-2"
                onClick={stopListening}
              >
                Stop Listening
              </button>
            </div>
            <p className="w-full px-5 py-10 text-white">User: {text}</p>
          </div>
        ) : (
          <h2 className="text-5xl font-bold text-red-600">
            Speech not supported in browser
          </h2>
        )}
        <p className="w-full px-5 py-10 text-white">Assistant: {response}</p>
      </section>
    </div>
  );
}

export default App;
