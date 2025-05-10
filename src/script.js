import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Función para actualizar el estado de una sunbed
async function updateSunbedState(sunbedId, color, status) {
    try {
        const sunbedRef = ref(window.database, `sunbeds/${sunbedId}`);
        await set(sunbedRef, {
            color: color,
            status: status,
            lastModified: new Date().getTime()
        });
        console.log('Sunbed actualizada:', sunbedId);
    } catch (error) {
        console.error('Error al actualizar sunbed:', error);
    }
}

// Función para cargar estados de sunbeds
function cargarEstadosHamacas() {
    const sunbedsRef = ref(window.database, 'sunbeds');
    onValue(sunbedsRef, (snapshot) => {
        const sunbeds = snapshot.val();
        if (sunbeds) {
            Object.entries(sunbeds).forEach(([id, sunbed]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.style.backgroundColor = sunbed.color;
                    element.dataset.status = sunbed.status;
                }
            });
        }
    });
}

// Función para guardar un pago
async function guardarPago(hamaca, datos) {
    try {
        const paymentRef = ref(window.database, `payments/${Date.now()}`);
        await set(paymentRef, {
            hamaca: hamaca,
            ...datos,
            timestamp: new Date().getTime()
        });
        console.log('Pago guardado:', datos);
    } catch (error) {
        console.error('Error al guardar pago:', error);
    }
}

// Modificar las funciones existentes para usar Firebase
function toggleDesconectadosFila0(value) {
    const sunbeds = document.querySelectorAll('.sunbed');
    sunbeds.forEach(async (sunbed, index) => {
        if (index < 10) {
            const sunbedId = sunbed.id;
            await updateSunbedState(sunbedId, '#ff0000', 'desconectado');
        }
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

// Modificar la función calcularCambio
async function calcularCambio() {
    const hamaca = document.getElementById('hamaca').value;
    const total = document.getElementById('totalManual').value || document.getElementById('totalSelect').value;
    const recibido = document.getElementById('recibidoManual').value || document.getElementById('recibidoSelect').value;
    const pago = document.getElementById('pago').value;
    const sombrillaExtra = document.getElementById('sombrillaExtra').value;

    const cambio = recibido - total;
    
    await guardarPago(hamaca, {
        amount: total,
        method: pago,
        sombrillaExtra: sombrillaExtra === 'si'
    });

    document.getElementById('resultado').innerHTML = `Cambio: €${cambio.toFixed(2)}`;
}

// Escuchar cambios en los pagos
function escucharPagos() {
    const paymentsRef = ref(window.database, 'payments');
    onValue(paymentsRef, (snapshot) => {
        const payments = snapshot.val();
        if (payments) {
            const historial = document.getElementById('historial');
            historial.innerHTML = '';
            
            Object.entries(payments).forEach(([id, payment]) => {
                const li = document.createElement('li');
                li.textContent = `Hamaca ${payment.hamaca}: €${payment.amount} - ${new Date(payment.timestamp).toLocaleString()}`;
                historial.appendChild(li);
            });
        }
    });
}

// Inicializar la aplicación
window.addEventListener('load', () => {
    console.log('Inicializando aplicación...');
    cargarEstadosHamacas();
    escucharPagos();
});

// Exportar las funciones necesarias para el HTML
window.toggleDesconectadosFila0 = toggleDesconectadosFila0;
window.calcularCambio = calcularCambio;
window.guardarPago = guardarPago;
window.actualizarCliente = actualizarCliente; 