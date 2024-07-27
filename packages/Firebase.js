import { initializeApp  } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js'
import { getStorage, ref, uploadBytesResumable } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js'

const firebaseConfig = {
    apiKey: "AIzaSyCr_lREx3D2tFfbCAnSlkq-imQKPlUA_5s",
    authDomain: "muvi-86973.firebaseapp.com",
    databaseURL: "https://muvi-86973-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "muvi-86973",
    storageBucket: "muvi-86973.appspot.com",
    messagingSenderId: "88955528642",
    appId: "1:88955528642:web:8cf9c8d4b73fb960e1625b",
    measurementId: "G-374K5GBKDV"
};

const app = initializeApp(firebaseConfig)
const storage = getStorage()

window.ref = ref
window.uploadBytesResumable = uploadBytesResumable
window.storage = storage