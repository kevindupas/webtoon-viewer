/* eslint-disable @typescript-eslint/no-explicit-any */
import { IonLabel, IonToggle } from "@ionic/react";
import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

function DarkModeSwitch({ mode }: any) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  return (
    <div className="w-full flex justify-between items-center">
      <IonLabel className="text-base uppercase text-black dark:text-white">
        Dark mode
      </IonLabel>
      <IonToggle
        enableOnOffLabels={true}
        checked={isDarkMode}
        color="success"
        mode={mode}
        className="bg-slate-300 rounded-full"
        onIonChange={() =>
          toggleTheme({} as React.ChangeEvent<HTMLInputElement>)
        }
        name="darkMode"
      />
    </div>
  );
}

export default DarkModeSwitch;
