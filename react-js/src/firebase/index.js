import firebase from "firebase/app";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyCI_049xU8r4E7InrmGwr6PtLgh4sVZn2k",
  authDomain: "storeimages-7444f.firebaseapp.com",
  databaseURL: "https://storeimages-7444f.firebaseio.com",
  projectId: "storeimages-7444f",
  storageBucket: "storeimages-7444f.appspot.com",
  messagingSenderId: "470961240849",
  appId: "1:470961240849:web:3b7b3bed9e28c4a42baab0",
  measurementId: "G-ZVQWZ0GRKD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export { storage, firebase as default };
