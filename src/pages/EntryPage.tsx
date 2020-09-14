import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router';

import { trash as trashIcon } from 'ionicons/icons';

import { firestore } from '../firebase';

import { Entry, toEntry } from '../models';
import { useAuth } from '../auth';
import { formatDate } from '../date';

interface RouteParams {
  id: string;
}

const EntryPage: React.FC = () => {
  const { userId } = useAuth();

  const history = useHistory();

  const match = useRouteMatch<RouteParams>();
  const { id } = match.params;

  const [entry, setEntry] = useState<Entry>();

  useEffect(() => {
    const entryRef = firestore.collection('users').doc(userId).collection('entries').doc(id);
    entryRef.get().then((doc) => {
      setEntry(toEntry(doc));
    });
  }, [id, userId]);

  const handleDelete = async () => {
    const entryRef = firestore.collection('users').doc(userId).collection('entries').doc(id);
    await entryRef.delete();
    history.goBack();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton />
          </IonButtons>
          <IonTitle>{formatDate(entry?.date)}</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={handleDelete}>
              <IonIcon icon={trashIcon} slot='icon-only' />
            </IonButton>
          </IonButtons>
          {/* <IonTitle>{ entry?.title }</IonTitle> */}
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <h2>{entry?.title}</h2>
        <img src={entry?.pictureUrl} alt={entry?.title}/>
        <p>{entry?.description}</p>
      </IonContent>
    </IonPage>
  );
};

export default EntryPage;
