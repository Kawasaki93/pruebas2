// Estructura para una sunbed
export const createSunbed = (id, color, status = 'available') => ({
  id,
  color,
  status,
  lastModified: new Date().getTime()
});

// Estructura para un cliente
export const createClient = (id, name, phone = '', notes = '') => ({
  id,
  name,
  phone,
  notes,
  lastModified: new Date().getTime()
});

// Estructura para un pago
export const createPayment = (id, clientId, amount, date, notes = '') => ({
  id,
  clientId,
  amount,
  date,
  notes,
  lastModified: new Date().getTime()
}); 