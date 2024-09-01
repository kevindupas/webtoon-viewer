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

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const [present] = useIonToast();

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
      present({
        message: "Registered successfully",
        duration: 1500,
        position: "bottom",
      });
      history.push("/tabs");
    } catch (error) {
      present({
        message: "Registration failed",
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
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating">Name</IonLabel>
            <IonInput
              value={name}
              onIonChange={(e) => setName(e.detail.value!)}
            />
          </IonItem>
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
        <IonButton expand="block" onClick={handleRegister}>
          Register
        </IonButton>
        <IonButton expand="block" fill="clear" routerLink="/login">
          Already have an account? Login
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
