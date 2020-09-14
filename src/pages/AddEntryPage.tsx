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
  isPlatform
} from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';

import { CameraResultType, CameraSource, Plugins } from '@capacitor/core';

import { firestore, storage } from '../firebase';
import { useAuth } from '../auth';
import { useHistory } from 'react-router';

const { Camera } = Plugins;

async function savePicture(blobUrl, userId) {
  const pictureRef = storage.ref(`/users/${userId}/pictures/${Date.now()}`);
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const snapshot = await pictureRef.put(blob);

  const url = await snapshot.ref.getDownloadURL();

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
    if (pictureUrl.startsWith('blob:')) {
      URL.revokeObjectURL(pictureUrl);
    }
  }, [pictureUrl]);

  const handleSave = async () => {
    const entriesRef = firestore.collection('users').doc(userId).collection('entries');
    // const dateJS = new Date(date);
    // const timestamp = firestore.Timestamp.fromDate(dateJS);
    const entryData = { date, title, pictureUrl, description };

    if (!pictureUrl.startsWith('/assets')) {
      entryData.pictureUrl = await savePicture(pictureUrl, userId);
    }

    await entriesRef.add(entryData);
    history.goBack();
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files.length > 0) {
      const file = event.target.files.item(0);
      const pictureUrl = URL.createObjectURL(file);

      setPictureUrl(pictureUrl);
    }
  };

  const handlePictureClick = async () => {
    if (isPlatform('capacitor')) {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          source: CameraSource.Prompt,
          width: 600,
        });

        setPictureUrl(photo.webPath);
      } catch (error) {
        console.log('handlePictureClick - error', error);
      }
    } else {
      fileInputRef.current.click()
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
              onClick={handlePictureClick}
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
