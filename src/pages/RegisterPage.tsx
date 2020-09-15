import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
  IonButton,
  IonList,
  IonLabel,
  IonInput,
  IonItem,
  IonText,
  IonLoading,
} from '@ionic/react';
import React, { useState } from 'react';
import { Redirect } from 'react-router';

import { useAuth } from '../auth';

import { auth } from '../firebase';

const RegisterPage: React.FC = () => {
  const { loggedIn } = useAuth();
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ status, setStatus ] = useState({ isLoading: false, isError: false, msg: '' });

  const handleRegister = async () => {
    try {
      setStatus({ isLoading: true, isError: false, msg: '' });
      await auth.createUserWithEmailAndPassword(email, password);
    } catch (err) {
      setStatus({ isLoading: false, isError: true, msg: err.message });
      console.log('LoginPage.handleRegister.error', err);
    }
  };

  if (loggedIn) {
    return <Redirect to='/my/entries' />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonList>
          <IonItem>
            <IonLabel position='stacked'>Email</IonLabel>
            <IonInput
              type='email'
              value={email}
              onIonChange={(event) => setEmail(event.detail.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position='stacked'>Password</IonLabel>
            <IonInput
              type='password'
              value={password}
              onIonChange={(event) => setPassword(event.detail.value)}
            />
          </IonItem>
        </IonList>
        { status.isError && <IonText color='danger'>{status.msg}</IonText> }
        <IonLoading isOpen={status.isLoading} />
        <IonButton expand='block' onClick={handleRegister}>CREATE ACCOUNT</IonButton>
        <IonButton
          fill='clear'
          expand='block'
          routerLink='/login'
        >
          Already have an account?
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
 