import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useContext } from "react";
import DarkModeSwitch from "../components/DarkModeSwitch";
import { ThemeContext } from "../contexts/ThemeContext";

const MyProfile: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen color={theme === "dark" ? "dark" : "light"}>
        <DarkModeSwitch />
      </IonContent>
    </IonPage>
  );
};

export default MyProfile;
