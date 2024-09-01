import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { ellipse, home, square } from "ionicons/icons";
import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
import Genres from "./Genres";
import Home from "./Home";
import MyProfile from "./MyProfile";

const TabsContainer: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/home" component={Home} />
        <Route exact path="/tabs/genres" component={Genres} />
        <Route exact path="/tabs/myprofile" component={MyProfile} />
        <Route exact path="/tabs">
          <Redirect to="/tabs/home" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom" color={theme === "dark" ? "dark" : "light"}>
        <IonTabButton tab="home" href="/tabs/home">
          <IonIcon icon={home} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="genres" href="/tabs/genres">
          <IonIcon icon={ellipse} />
          <IonLabel>Genres</IonLabel>
        </IonTabButton>
        <IonTabButton tab="myprofile" href="/tabs/myprofile">
          <IonIcon icon={square} />
          <IonLabel>My Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsContainer;
