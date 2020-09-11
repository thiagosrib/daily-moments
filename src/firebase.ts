import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCpngPezt5czQefIwOTxkQLr_nMnLr04iU',
  authDomain: 'daily-moments-6460a.firebaseapp.com',
  databaseURL: 'https://daily-moments-6460a.firebaseio.com',
  projectId: 'daily-moments-6460a',
  storageBucket: 'daily-moments-6460a.appspot.com',
  messagingSenderId: '52516407563',
  appId: '1:52516407563:web:c26b812886f3f7bcbaba0e',
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export const firestore = app.firestore();
