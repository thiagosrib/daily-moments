import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
  IonList,
  IonItem,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  IonThumbnail,
  IonImg,
} from '@ionic/react';
import React, { useState, useEffect } from 'react';

import { add as addIcon } from 'ionicons/icons';

import { firestore } from '../firebase';
import { Entry, toEntry } from '../models';
import { useAuth } from '../auth';
import { formatDate } from '../date';

const HomePage: React.FC = () => {
  const { userId } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const entriesRef = firestore
      .collection('users')
      .doc(userId)
      .collection('entries');

    return entriesRef
      .orderBy('date', 'desc')
      .limit(7)
      .onSnapshot(({ docs }) => setEntries(docs.map(toEntry)));
    // entriesRef.get().then(({ docs }) => setEntries(docs.map(toEntry)));
  }, [userId]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Daily Moments</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonList>
          {entries.map((entry) => (
            <IonItem
              button
              key={entry.id}
              routerLink={`/my/entries/view/${entry.id}`}
            >
              <IonThumbnail slot='end'>
                <IonImg src={entry.pictureUrl} />
              </IonThumbnail>
              <IonLabel>
                {entry.date && <h2>{formatDate(entry.date)}</h2>}
                <h3>{entry.title}</h3>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        {/* FAB -> Floating Action Button */}
        <IonFab vertical='bottom' horizontal='end'>
          <IonFabButton routerLink='/my/entries/add'>
            <IonIcon icon={addIcon} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
