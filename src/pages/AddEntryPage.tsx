import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
} from '@ionic/react';
import React, { useState } from 'react';

import { firestore } from '../firebase';
import { useAuth } from '../auth';
import { useHistory } from 'react-router';

const AddEntryPage: React.FC = () => {
  const { userId } = useAuth();

  const history = useHistory();

  const [ title, setTitle ] = useState('');
  const [ description, setDescription ] = useState('');

  const handleSave = async () => {
    const entriesRef = firestore.collection('users').doc(userId).collection('entries');
    const entryData = { title, description };

    await entriesRef.add(entryData);
    history.goBack();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton />
          </IonButtons>
          <IonTitle>Add Entry</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonList>
          <IonItem>
            <IonLabel position='stacked'>Title</IonLabel>
            <IonInput
              value={title}
              onIonChange={(event) => setTitle(event.detail.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position='stacked'>Description</IonLabel>
            <IonTextarea
              value={description}
              onIonChange={(event) => setDescription(event.detail.value)}
            />
          </IonItem>
        </IonList>
        <IonButton expand='block' onClick={handleSave}>Save</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddEntryPage;
