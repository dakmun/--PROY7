import { Payment, MercadoPagoConfig } from 'mercadopago';
import process from 'node:process';

// Inicializa MercadoPago con access token


const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN, 
  options: { timeout: 5000 },
});

const payment = new Payment(client);

export const processPayment = async (req, res) => {
  const { transaction_amount, payment_method_id, token, payer, installments } = req.body;

  if (!transaction_amount || !payment_method_id || !token || !payer, !installments ) {
    return res.status(400).json({ message: 'Faltan parámetros en la solicitud' });
  }

  try {
    // Crea el pago
    const response = await payment.create({
      body: {
        transaction_amount,
        installments,
        token, 
        description: 'PAGO DE PRUEBA', 
        payment_method_id,
        payer,
      },
    });

    // Devuelve la respuesta de MercadoPago
    res.status(200).json(response);
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    res.status(500).json({ message: 'Error al procesar el pago', error: error.message });
  }
};