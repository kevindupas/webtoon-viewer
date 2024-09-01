import { IonContent, IonMenu } from "@ionic/react";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import DarkModeSwitch from "./DarkModeSwitch";

function Menu() {
  const { theme } = useContext(ThemeContext);
  return (
    <IonMenu
      side="end"
      contentId="main-content"
      color={theme === "dark" ? "dark" : "light"}
    >
      <IonContent
        className="ion-padding"
        scrollY={false}
        color={theme === "dark" ? "dark" : "light"}
      >
        <div className="space-y-5">
          <DarkModeSwitch />
        </div>
      </IonContent>
    </IonMenu>
  );
}

export default Menu;
