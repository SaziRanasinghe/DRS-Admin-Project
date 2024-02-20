// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database"; 

// function firebaseConfig() {
//     const firebaseConfig = {
//  apiKey: "AIzaSyDFnwAyXy659zGH_mauDHS1v19Cb4LGT_0",
//  authDomain: "project1-17bbe.firebaseapp.com",
//  databaseURL: "https://project1-17bbe-default-rtdb.firebaseio.com",
//  projectId: "project1-17bbe",
//  storageBucket: "project1-17bbe.appspot.com",
//  messagingSenderId: "985361251436",
//  appId: "1:985361251436:web:f8a34a487f6c970983ec49",
//  measurementId: "G-5SL0Z066JS"
// };


// const app = initializeApp(firebaseConfig);
// return getDatabase(app);
// }

// export default firebaseConfig;

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = { 
    apiKey: "AIzaSyCDZys5Ts5inKEFbIQJfpOyrRwoX-C4pso",
    authDomain: "drs-agro-91d82.firebaseapp.com",
    projectId: "drs-agro-91d82",
    storageBucket: "drs-agro-91d82.appspot.com",
    messagingSenderId: "790036389167",
    appId: "1:790036389167:web:d2f18680f48e7ed33395da",
    measurementId: "G-3V1Y6V730P",
    databaseURL: "https://drs-agro-91d82-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;