//firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyCQ79QjJewISdZVHdbdu9KeBfnux9CW7EA",
  authDomain: "timbertrack-b8097.firebaseapp.com",
  projectId: "timbertrack-b8097",
  storageBucket: "timbertrack-b8097.firebasestorage.app",
  messagingSenderId: "592952455380",
  appId: "1:592952455380:web:17b10ce1b1f13fc6618b41"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
