import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJ3SAgghjoh7XKOHcV0DPR3faiJhxqsBQ",
  authDomain: "supp-li.firebaseapp.com",
  projectId: "supp-li",
  storageBucket: "supp-li.appspot.com",
  messagingSenderId: "1060899543814",
  appId: "1:1060899543814:web:7d0e1bb431ecd2a043dc87",
  measurementId: "G-09M2G3H751"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, analytics, googleProvider };
