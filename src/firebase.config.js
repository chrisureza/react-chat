import firebase from "firebase";

const config = {
  apiKey: "AIzaSyDlbnS6aageuoFSWNeSkFvNSQAsjdHm0dM",
  authDomain: "react-chat-8e594.firebaseapp.com",
  databaseURL: "https://react-chat-8e594.firebaseio.com",
  projectId: "react-chat-8e594",
  storageBucket: "react-chat-8e594.appspot.com",
  messagingSenderId: "405469747884",
  appId: "1:405469747884:web:61a43e8e3ad3d8afde1d09",
  measurementId: "G-Y7B4SSRZKN"
};
firebase.initializeApp(config);
firebase.firestore().settings({
  timestampsInSnapshots: true
});

export const appFirebase = firebase;
export const appFirestore = firebase.firestore();
export const appStorage = firebase.storage();
