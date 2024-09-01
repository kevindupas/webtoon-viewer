import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
} from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import useMediaQuery from "../hooks/useMediaQuery";

type Theme = "light" | "dark";

interface ThemeProviderInterface {
  theme: Theme;
  toggleTheme: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isMobile: boolean;
}

export const ThemeContext = createContext<ThemeProviderInterface>(
  {} as ThemeProviderInterface
);

export const ThemeProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [theme, setThemeStorage] = useLocalStorage<Theme>(
    "colorTheme",
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  const isMobile = useMediaQuery("(max-width: 899px)", true);

  const toggleTheme = () => {
    setThemeStorage(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    window.document.documentElement.classList.remove("light", "dark");
    window.document.documentElement.classList.add(theme);
    setThemeStorage(theme);
  }, [theme]);

  const providedValues: ThemeProviderInterface = useMemo(
    () => ({ theme, toggleTheme, isMobile }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={providedValues}>
      {children}
    </ThemeContext.Provider>
  );
};
