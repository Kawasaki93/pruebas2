// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDpVd0jLqj3D6q4VjRjHYPAdrOd5qs_Y54",
  authDomain: "base-datos-ce254.firebaseapp.com",
  databaseURL: "https://base-datos-ce254-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "base-datos-ce254",
  storageBucket: "base-datos-ce254.firebasestorage.app",
  messagingSenderId: "268304492138",
  appId: "1:268304492138:web:1e583f94f6bf013f870c13"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener una instancia de la base de datos
const database = getDatabase(app);

export { database }; 