// Configuración de Firebase
// Para obtener estas credenciales:
// 1. Ve a la consola de Firebase (https://console.firebase.google.com)
// 2. Selecciona tu proyecto
// 3. Haz clic en el ícono de configuración (⚙️) junto a "Project Overview"
// 4. Selecciona "Configuración del proyecto"
// 5. En la sección "Tus aplicaciones", haz clic en el ícono de web (</>)
// 6. Registra tu app con un nombre (por ejemplo "playa-juan-web")
// 7. Copia las credenciales que aparecen y reemplázalas abajo

const firebaseConfig = {
  apiKey: "AIzaSyDpVd0jLqj3D6q4VjRjHYPAdrOd5qs_Y54",
  authDomain: "base-datos-ce254.firebaseapp.com",
  projectId: "base-datos-ce254",
  storageBucket: "base-datos-ce254.firebasestorage.app",
  messagingSenderId: "268304492138",
  appId: "1:268304492138:web:1e583f94f6bf013f870c13"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Función para sincronizar el estado de los sunbeds
function syncSunbedState(sunbedId, state) {
  return db.collection('sunbeds').doc(sunbedId).set({
    color: state.color,
    clientName: state.clientName,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// Función para sincronizar el estado de los círculos
function syncCircleState(circleId, state) {
  return db.collection('circles').doc(circleId).set({
    color: state.color,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// Función para sincronizar el registro de la calculadora
function syncCalculatorLog(log) {
  return db.collection('calculatorLogs').add({
    log: log,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// Función para sincronizar la visibilidad de filas y sombrillas
function syncVisibilityState(state) {
  return db.collection('visibility').doc('current').set({
    rows: state.rows,
    umbrellas: state.umbrellas,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// Función para escuchar cambios en tiempo real
function listenToChanges() {
  // Escuchar cambios en sunbeds
  db.collection('sunbeds').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'modified') {
        const data = change.doc.data();
        updateSunbedUI(change.doc.id, data);
      }
    });
  });

  // Escuchar cambios en círculos
  db.collection('circles').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'modified') {
        const data = change.doc.data();
        updateCircleUI(change.doc.id, data);
      }
    });
  });

  // Escuchar cambios en visibilidad
  db.collection('visibility').doc('current').onSnapshot((doc) => {
    if (doc.exists) {
      const data = doc.data();
      updateVisibilityUI(data);
    }
  });
}

// Funciones auxiliares para actualizar la UI
function updateSunbedUI(sunbedId, data) {
  const sunbed = document.getElementById(sunbedId);
  if (sunbed) {
    sunbed.style.backgroundColor = data.color;
    sunbed.querySelector('.client-name').textContent = data.clientName;
  }
}

function updateCircleUI(circleId, data) {
  const circle = document.getElementById(circleId);
  if (circle) {
    circle.style.backgroundColor = data.color;
  }
}

function updateVisibilityUI(data) {
  // Actualizar visibilidad de filas
  data.rows.forEach((row, index) => {
    const rowElement = document.querySelector(`.row-${index}`);
    if (rowElement) {
      rowElement.style.display = row.visible ? 'flex' : 'none';
    }
  });

  // Actualizar visibilidad de sombrillas
  data.umbrellas.forEach((umbrella, index) => {
    const umbrellaElement = document.querySelector(`.umbrella-${index}`);
    if (umbrellaElement) {
      umbrellaElement.style.display = umbrella.visible ? 'block' : 'none';
    }
  });
} 