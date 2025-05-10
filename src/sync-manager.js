import storageSync from './firebase-sync';
import { createSunbed, createClient, createPayment } from './data-structures';

class SyncManager {
  constructor() {
    this.setupListeners();
  }

  // Configurar listeners para todos los cambios
  setupListeners() {
    // Escuchar cambios en sunbeds
    storageSync.listenToChanges('sunbeds', (sunbeds) => {
      this.onSunbedsUpdate(sunbeds);
    });

    // Escuchar cambios en clientes
    storageSync.listenToChanges('clients', (clients) => {
      this.onClientsUpdate(clients);
    });

    // Escuchar cambios en pagos
    storageSync.listenToChanges('payments', (payments) => {
      this.onPaymentsUpdate(payments);
    });
  }

  // Métodos para Sunbeds
  async updateSunbed(sunbedId, updates) {
    const sunbeds = await this.getSunbeds();
    const sunbed = sunbeds[sunbedId] || createSunbed(sunbedId, updates.color);
    
    const updatedSunbed = {
      ...sunbed,
      ...updates,
      lastModified: new Date().getTime()
    };

    sunbeds[sunbedId] = updatedSunbed;
    await storageSync.save('sunbeds', sunbeds);
  }

  async getSunbeds() {
    return await storageSync.get('sunbeds') || {};
  }

  onSunbedsUpdate(sunbeds) {
    // Aquí puedes emitir un evento o llamar a una función de actualización de UI
    console.log('Sunbeds actualizados:', sunbeds);
  }

  // Métodos para Clientes
  async updateClient(clientId, updates) {
    const clients = await this.getClients();
    const client = clients[clientId] || createClient(clientId, updates.name);
    
    const updatedClient = {
      ...client,
      ...updates,
      lastModified: new Date().getTime()
    };

    clients[clientId] = updatedClient;
    await storageSync.save('clients', clients);
  }

  async getClients() {
    return await storageSync.get('clients') || {};
  }

  onClientsUpdate(clients) {
    // Aquí puedes emitir un evento o llamar a una función de actualización de UI
    console.log('Clientes actualizados:', clients);
  }

  // Métodos para Pagos
  async addPayment(payment) {
    const payments = await this.getPayments();
    const paymentId = payment.id || `payment_${new Date().getTime()}`;
    
    const newPayment = createPayment(
      paymentId,
      payment.clientId,
      payment.amount,
      payment.date,
      payment.notes
    );

    payments[paymentId] = newPayment;
    await storageSync.save('payments', payments);
  }

  async getPayments() {
    return await storageSync.get('payments') || {};
  }

  async getClientPayments(clientId) {
    const payments = await this.getPayments();
    return Object.values(payments).filter(payment => payment.clientId === clientId);
  }

  onPaymentsUpdate(payments) {
    // Aquí puedes emitir un evento o llamar a una función de actualización de UI
    console.log('Pagos actualizados:', payments);
  }

  // Método para sincronizar todos los datos
  async syncAll() {
    await storageSync.syncAll();
  }
}

// Crear una instancia única
const syncManager = new SyncManager();

export default syncManager; 