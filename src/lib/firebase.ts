// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { env } from "../env.js";

const firebaseConfig = {
	apiKey: env.FIREBASE_API_KEY,
	authDomain: "grand-eva-modas.firebaseapp.com",
	projectId: "grand-eva-modas",
	storageBucket: "grand-eva-modas.firebasestorage.app",
	messagingSenderId: "43921467712",
	appId: "1:43921467712:web:f9e7e266ac1751d7bb32a5",
	measurementId: "G-0SPLNV0MWC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
// export const analytics = getAnalytics(app);
