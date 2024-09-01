import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./theme/index.css";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  // <React.StrictMode>
  <ThemeProvider>
    <AuthProvider>
      {/* <WebtoonProvider> */}
      <App />
      {/* </WebtoonProvider> */}
    </AuthProvider>
  </ThemeProvider>
  // </React.StrictMode>
);
