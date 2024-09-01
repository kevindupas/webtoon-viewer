import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const [present] = useIonToast();
  // const [storage, setStorage] = useState<Storage | null>(null);

  // useEffect(() => {
  //   const initStorage = async () => {
  //     const newStorage = new Storage({
  //       name: "webtoon-db",
  //       storeName: "_ionicstorage",
  //       driverOrder: [Drivers.IndexedDB],
  //     });
  //     await newStorage.create();
  //     setStorage(newStorage);
  //   };

  //   initStorage();
  // }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      await login(response.data.access_token);

      present({
        message: "Logged in successfully",
        duration: 1500,
        position: "bottom",
      });

      console.log("Redirecting to /tabs");
      history.push("/tabs");
    } catch (error) {
      present({
        message: "Login failed",
        duration: 1500,
        position: "bottom",
        color: "danger",
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
            />
          </IonItem>
        </IonList>
        <IonButton expand="block" onClick={handleLogin}>
          Login
        </IonButton>
        <IonButton expand="block" fill="clear" routerLink="/register">
          Register
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
