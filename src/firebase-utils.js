import { database } from './firebase-config';
import { ref, set, get, update, remove, onValue } from 'firebase/database';

// Función para escribir datos
export const writeData = async (path, data) => {
  try {
    const reference = ref(database, path);
    await set(reference, data);
    return true;
  } catch (error) {
    console.error('Error al escribir datos:', error);
    return false;
  }
};

// Función para leer datos
export const readData = async (path) => {
  try {
    const reference = ref(database, path);
    const snapshot = await get(reference);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error al leer datos:', error);
    return null;
  }
};

// Función para actualizar datos
export const updateData = async (path, data) => {
  try {
    const reference = ref(database, path);
    await update(reference, data);
    return true;
  } catch (error) {
    console.error('Error al actualizar datos:', error);
    return false;
  }
};

// Función para eliminar datos
export const deleteData = async (path) => {
  try {
    const reference = ref(database, path);
    await remove(reference);
    return true;
  } catch (error) {
    console.error('Error al eliminar datos:', error);
    return false;
  }
};

// Función para escuchar cambios en tiempo real
export const listenToData = (path, callback) => {
  const reference = ref(database, path);
  return onValue(reference, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : null;
    callback(data);
  });
}; 