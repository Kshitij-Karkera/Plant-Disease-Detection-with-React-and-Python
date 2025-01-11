import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBk-ny5Hu3vZSDhB62xHcWwPDrFFyxAVuU",
    authDomain: "sapling-1bf9f.firebaseapp.com",
    projectId: "sapling-1bf9f",
    storageBucket: "sapling-1bf9f.appspot.com",
    messagingSenderId: "494773261290",
    appId: "1:494773261290:web:0828d6a8c0e56d1ea75893",
    measurementId: "G-XCLQ90LDZ3"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage }
