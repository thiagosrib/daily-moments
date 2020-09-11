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
} from '@ionic/react';
import React, { useState, useEffect } from 'react';

import { add as addIcon } from 'ionicons/icons';

import { firestore } from '../firebase';
import { Entry, toEntry } from '../models';
import { useAuth } from '../auth';

const HomePage: React.FC = () => {
  const { userId } = useAuth();
  const [ entries, setEntries ] = useState<Entry[]>([]);

  useEffect(() => {
    const entriesRef = firestore.collection('users').doc(userId).collection('entries');

    return entriesRef.onSnapshot(({ docs }) => setEntries(docs.map(toEntry)));
    // entriesRef.get().then(({ docs }) => setEntries(docs.map(toEntry)));
  }, [userId]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonList>
          {entries.map((entry) => 
            <IonItem
              button
              key={entry.id}
              routerLink={`/my/entries/view/${entry.id}`}
            >
              {entry.title}
            </IonItem>
          )}
        </IonList>
        {/* FAB -> Floating Action Button */}
        <IonFab vertical='bottom' horizontal='end'>
          <IonFabButton routerLink='/my/entries/add'>
            <IonIcon icon={ addIcon } />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;