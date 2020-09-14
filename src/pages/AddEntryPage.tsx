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
  IonDatetime,
} from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';

import { firestore, storage } from '../firebase';
import { useAuth } from '../auth';
import { useHistory } from 'react-router';

async function savePicture(blobUrl, userId) {
  console.log(blobUrl, userId);
  const pictureRef = storage.ref(`/users/${userId}/pictures/${Date.now()}`);
  console.log(pictureRef);
  const response = await fetch(blobUrl);
  console.log(response);
  const blob = await response.blob();
  console.log(blob);
  const snapshot = await pictureRef.put(blob);
  console.log(snapshot);

  const url = await snapshot.ref.getDownloadURL();
  console.log('saved url', url)

  return url;
}

const AddEntryPage: React.FC = () => {
  const { userId } = useAuth();

  const history = useHistory();

  const fileInputRef = useRef<HTMLInputElement>();

  const [ date, setDate ] = useState('');
  const [ title, setTitle ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ pictureUrl, setPictureUrl ] = useState('/assets/placeholder.png');

  useEffect(() => () => {
    console.log('revoke', pictureUrl);
    if (pictureUrl.startsWith('blob:')) {
      URL.revokeObjectURL(pictureUrl);
    }
  }, [pictureUrl]);

  const handleSave = async () => {
    const entriesRef = firestore.collection('users').doc(userId).collection('entries');
    // const dateJS = new Date(date);
    // const timestamp = firestore.Timestamp.fromDate(dateJS);
    const entryData = { date, title, pictureUrl, description };

    if (pictureUrl.startsWith('blob:')) {
      entryData.pictureUrl = await savePicture(pictureUrl, userId);
    }

    await entriesRef.add(entryData);
    history.goBack();
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files.length > 0) {
      const file = event.target.files.item(0);
      const pictureUrl = URL.createObjectURL(file);
      console.log('create', pictureUrl);
      setPictureUrl(pictureUrl)
    }
  };

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
            <IonLabel position='stacked'>Date</IonLabel>
            <IonDatetime
              value={date}
              onIonChange={(event) => setDate(event.detail.value)}
            />
          </IonItem>
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
          <IonItem>
            <IonLabel position='stacked'>Picture</IonLabel><br />
            <input
              hidden
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleFileChange}
            />
            <img
              src={pictureUrl}
              alt=""
              onClick={() => fileInputRef.current.click()}
              style={{ cursor: 'pointer' }}
            />
          </IonItem>
        </IonList>
        <IonButton expand='block' onClick={handleSave}>Save</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddEntryPage;
