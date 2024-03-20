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

  return (
    <div
      className={`theme ${theme ? "bg-gray-700" : "bg-gray-800"} flex min-h-screen flex-col items-center`}
    >
      <h1 className="text py-10 text-7xl font-extrabold uppercase text-red-950 underline 2xl:text-9xl">
        Personal Assistant
      </h1>
      <section className="w-full max-w-5xl">
        {hasRecognitionSupport ? (
          <div className="mx-auto flex flex-col items-center justify-center">
            <div className="flex gap-10">
              <button
                className="rounded-lg border px-10 py-2 text-black transition-all duration-300 hover:border-white hover:bg-black/50 hover:text-white"
                onClick={startListening}
              >
                Start Listening
              </button>
              <div
                className={`h-10 w-10 rounded-full border ${isListening ? "bg-red-700" : "bg-black/80"}`}
              ></div>
              <button
                className="rounded-lg border px-10 py-2 text-black transition-all duration-300 hover:border-white hover:bg-black/50 hover:text-white"
                onClick={stopListening}
              >
                Stop Listening
              </button>
            </div>
            <p className="w-full py-10 text-white">Speech: {text}</p>
          </div>
        ) : (
          <h2 className="text-5xl font-bold text-red-600">
            Speech not supported in browser
          </h2>
        )}
      </section>
    </div>
  );
}

export default App;
