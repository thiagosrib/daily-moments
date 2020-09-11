import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/react';
import { home as homeIcon, settings as settingsIcon } from 'ionicons/icons'
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import EntryPage from './pages/EntryPage';

import { useAuth } from './auth';
import AddEntryPage from './pages/AddEntryPage';

const AppTabs: React.FC = () => {
  const { loggedIn } = useAuth();

  if (!loggedIn) {
    return <Redirect to='/login' />;
  }

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path='/my/entries' component={HomePage} />
        <Route exact path='/my/settings' component={SettingsPage} />
        <Route exact path='/my/entries/view/:id' component={EntryPage} />
        <Route exact path='/my/entries/add' component={AddEntryPage} />
      </IonRouterOutlet>
      <IonTabBar slot='bottom'>
        <IonTabButton tab='home' href='/my/entries'>
          <IonIcon icon={homeIcon} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab='settings' href='/my/settings'>
          <IonIcon icon={settingsIcon} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppTabs;
