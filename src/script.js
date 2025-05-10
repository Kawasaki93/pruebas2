import syncManager from './sync-manager';

// Función para actualizar el estado de una sunbed
async function updateSunbedState(sunbedId, color, status) {
  await syncManager.updateSunbed(sunbedId, {
    color: color,
    status: status
  });
}

// Función para cargar estados de sunbeds
async function cargarEstadosHamacas() {
  const sunbeds = await syncManager.getSunbeds();
  Object.entries(sunbeds).forEach(([id, sunbed]) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.backgroundColor = sunbed.color;
      element.dataset.status = sunbed.status;
    }
  });
}

// Función para guardar un pago
async function guardarPago(clientId, amount, notes) {
  await syncManager.addPayment({
    clientId: clientId,
    amount: amount,
    date: new Date(),
    notes: notes
  });
}

// Función para actualizar cliente
async function actualizarCliente(clientId, name, phone, notes) {
  await syncManager.updateClient(clientId, {
    name: name,
    phone: phone,
    notes: notes
  });
}

// Configurar listeners para actualizaciones en tiempo real
syncManager.onSunbedsUpdate((sunbeds) => {
  cargarEstadosHamacas();
});

syncManager.onClientsUpdate((clients) => {
  // Actualizar UI de clientes
  console.log('Clientes actualizados:', clients);
});

syncManager.onPaymentsUpdate((payments) => {
  // Actualizar UI de pagos
  console.log('Pagos actualizados:', payments);
});

// Inicializar la aplicación
window.addEventListener('load', async () => {
  await syncManager.syncAll();
  await cargarEstadosHamacas();
}); 