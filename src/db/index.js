import { initializeApp } from "firebase/app";
import { getDatabase, ref ,set, onValue,remove  } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDOWeXrRIBL8bOTizuZYuhmNJ1CEA1GhZg",
  authDomain: "airforshare-45bb1.firebaseapp.com",
  databaseURL: "https://airforshare-45bb1-default-rtdb.firebaseio.com",
  projectId: "airforshare-45bb1",
  storageBucket: "airforshare-45bb1.appspot.com",
  messagingSenderId: "122443019143",
  appId: "1:122443019143:web:ec9ec3e27f91ed026dd922"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase();
const storage = getStorage();


export {
    app,
    db,
    ref,
    set,
    onValue,
    remove,
    storage,
    storageRef,
    uploadBytesResumable,
    getDownloadURL
}