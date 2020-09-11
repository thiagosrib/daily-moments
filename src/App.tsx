import { IonApp, IonLoading } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { AuthContext, useAuthInit } from './auth';

import AppTabs from './AppTabs';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  const { loading, auth } = useAuthInit();

  console.log(`App.loggedIn loading: ${loading} auth: `, auth);
  if (loading) {
    return <IonLoading isOpen />;
  }

  return (
    <IonApp>
      <AuthContext.Provider value={ auth }>
        <IonReactRouter>
          <Switch>
            <Route exact path='/login'>
              <LoginPage />
            </Route>
            <Route exact path='/register'>
              <RegisterPage />
            </Route>
            <Route path='/my' component={AppTabs} />

            <Redirect exact path='/' to='/my/entries' />
            <Route component={NotFoundPage} />
          </Switch>
        </IonReactRouter>
      </AuthContext.Provider>
    </IonApp>
  );
};

export default App;
