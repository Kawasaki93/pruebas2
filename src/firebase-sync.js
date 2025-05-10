import { database } from './firebase-config';
import { ref, set, get, onValue, serverTimestamp } from 'firebase/database';

class StorageSync {
  constructor() {
    this.lastSyncTimestamp = null;
    this.isSyncing = false;
    this.deviceId = this.generateDeviceId();
  }

  // Generar un ID único para este dispositivo
  generateDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  // Obtener timestamp actual
  getCurrentTimestamp() {
    return new Date().getTime();
  }

  // Guardar datos en localStorage con metadata
  saveToLocalStorage(key, value) {
    const data = {
      value: value,
      timestamp: this.getCurrentTimestamp(),
      deviceId: this.deviceId
    };
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Obtener datos de localStorage
  getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Sincronizar un item específico con Firebase
  async syncItem(key) {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const localData = this.getFromLocalStorage(key);
      const dbRef = ref(database, `sync/${key}`);
      const snapshot = await get(dbRef);
      const remoteData = snapshot.val();

      if (!remoteData) {
        // Si no hay datos en Firebase, subir los locales
        if (localData) {
          await set(dbRef, {
            value: localData.value,
            timestamp: localData.timestamp,
            deviceId: localData.deviceId
          });
        }
      } else {
        // Resolver conflicto si existe
        if (localData && localData.timestamp !== remoteData.timestamp) {
          if (localData.timestamp > remoteData.timestamp) {
            // Los datos locales son más recientes
            await set(dbRef, {
              value: localData.value,
              timestamp: localData.timestamp,
              deviceId: localData.deviceId
            });
          } else {
            // Los datos remotos son más recientes
            this.saveToLocalStorage(key, remoteData.value);
          }
        }
      }
    } catch (error) {
      console.error('Error en sincronización:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  // Escuchar cambios en Firebase
  listenToChanges(key, callback) {
    const dbRef = ref(database, `sync/${key}`);
    return onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.deviceId !== this.deviceId) {
        this.saveToLocalStorage(key, data.value);
        if (callback) callback(data.value);
      }
    });
  }

  // Sincronizar todos los items de localStorage
  async syncAll() {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key !== 'deviceId') {
        await this.syncItem(key);
      }
    }
  }

  // Método para guardar datos (actualiza tanto localStorage como Firebase)
  async save(key, value) {
    this.saveToLocalStorage(key, value);
    await this.syncItem(key);
  }

  // Método para obtener datos (primero intenta de localStorage, luego de Firebase)
  async get(key) {
    const localData = this.getFromLocalStorage(key);
    if (localData) {
      return localData.value;
    }

    const dbRef = ref(database, `sync/${key}`);
    const snapshot = await get(dbRef);
    const remoteData = snapshot.val();
    
    if (remoteData) {
      this.saveToLocalStorage(key, remoteData.value);
      return remoteData.value;
    }

    return null;
  }
}

// Crear una instancia única
const storageSync = new StorageSync();

export default storageSync; 