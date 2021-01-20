import firebase from 'firebase';


const config = {
  apiKey: "AIzaSyBrwePcLFA_fant-X0L8t7PriEtjS6OZJQ",
  authDomain: "quicklearn-d04f4.firebaseapp.com",
  databaseURL: "https://quicklearn-d04f4.firebaseio.com",
  projectId: "quicklearn-d04f4",
  storageBucket: "quicklearn-d04f4.appspot.com",
  messagingSenderId: "46472363548",
  appId: "1:46472363548:web:8df1d293745163441f69d9",
  measurementId: "G-VG4KT0CPB7"
};;

firebase.initializeApp(config);

export const db = firebase.firestore();
export const functions = firebase.functions();

export default firebase;