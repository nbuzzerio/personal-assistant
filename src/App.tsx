import { useTheme } from "./components/ThemeContext/ThemeContext";

function App() {
  const theme = useTheme();

  return (
    <div
      className={`theme ${theme ? "bg-gray-700" : "bg-gray-800"} flex min-h-screen flex-col items-center`}
    >
      <h1 className="text py-10 text-7xl font-extrabold uppercase text-red-950 underline 2xl:text-9xl">
        Personal Assistant
      </h1>
    </div>
  );
}

export default App;
