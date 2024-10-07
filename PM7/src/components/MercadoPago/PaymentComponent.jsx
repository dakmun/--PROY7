import { useState, useEffect } from 'react';
import { CardPayment, StatusScreen, initMercadoPago } from '@mercadopago/sdk-react'; 
import useCart from '../../contexts/useCart';
import useAuth from '../../contexts/useAuth';
import CartDetails from '../Cart/CartDetails';
import OrderDetails from '../Orders/OrderDetails';  
import { Container, Box, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

// Inicializa MercadoPago con tu clave pública
initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY, {
  locale: 'es-CL',
});

const PaymentComponent = () => {
  const { cart, getTotalPrice } = useCart();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true); // Estado para manejar la carga del carrito
  const [paymentId, setPaymentId] = useState(null); // Estado para almacenar el ID del pago
  const [orderDetails, setOrderDetails] = useState(null); // Estado para almacenar los detalles de la orden

  // Configuración inicial para el pago
  const [initialization, setInitialization] = useState({
    amount: 0,
    payer: {
      email: user?.email || 'test_user@example.com',
    },
    description: 'Pago de Prueba',
  });

  // Verificar que los datos del carrito estén listos
  useEffect(() => {
    if (cart.length > 0) {
      setInitialization((prev) => ({
        ...prev,
        amount: parseInt(getTotalPrice() * 0.95),
      }));
      setLoading(false); // Marcar como cargado
    } else {
      console.error('El carrito está vacío');
      setLoading(false);
    }
  }, [cart, getTotalPrice]);

  // Función para manejar la lógica al enviar los datos del pago
  const onSubmit = async (formData) => {
    try {
      // Procesar el pago con MercadoPago
      const response = await fetch('/api/mercadopago/process_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transaction_amount: parseInt(getTotalPrice() * 0.95),
          installments: formData.installments,
          token: formData.token,
          payment_method_id: formData.paymentMethodId,
          payer: { email: initialization.payer.email },
          description: initialization.description,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Error al procesar el pago');
      console.log('Resultado del pago:', result);
      
      setPaymentId(result.id); // Almacena el ID del pago en el estado


// Crear la orden después del pago exitoso
const orderResponse = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    cart: cart.map((item) => ({
      productId: item._id,  // Usar '_id' como el productId
      quantity: item.quantity,
      price: item.price,
      name: item.name,
      image: item.mainImage,
    })),
    totalPrice: parseInt(getTotalPrice() * 0.95),
    paymentId: result.id,
  }),
});

const orderResult = await orderResponse.json();
if (!orderResponse.ok) throw new Error(orderResult.message || 'Error al crear la orden');
console.log('Resultado de la orden:', orderResult);

      // Almacenar los detalles de la orden en el estado o en localStorage
      setOrderDetails(orderResult); // Guardar la orden en el estado
      localStorage.setItem('lastOrder', JSON.stringify(orderResult)); // Almacenar en localStorage

      return result; // Retorna el resultado del pago
    } catch (error) {
      console.error('Error al enviar los datos del pago o crear la orden:', error);
      throw error;
    }
  };

  if (loading) {
    return <div>Cargando carrito...</div>;
  }

  return (
    <div>
      {!paymentId ? (
        <>
        <Box sx={{ py: 8 , px: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' , maxWidth: '100%' }}>  
          <h2>Checkout</h2>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width:'100%', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 4 }, p: { xs: 2, md: 4 } , mx: { xs: 2, md: 4 }, my: { xs: 2, md: 4 }, borderRadius: 2}}> 
          <CartDetails />
         <Box sx={{ border: '1px solid #ccc' , borderRadius: '14px' }}>
          <CardPayment initialization={initialization} onSubmit={onSubmit} /> 
          </Box>
        </Box>
        </Box>
        </>
      ) : (
        <>
        <Box sx={{ py: 8 , px: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' , maxWidth: '100%' }}>
        <StatusScreen initialization={{ paymentId }} />
     
        {orderDetails ? (  // Asegurarse de que los detalles de la orden existan antes de renderizar
          <OrderDetails order={orderDetails} />
       
        ) : (
          <p>Generando la orden...</p>  // Mensaje mientras se genera la orden
        )}
           <Alert severity="success"> ¡Pago exitoso! - Se ha guardado la orden en tu <Link to="/profile">Perfil</Link>.</Alert>
        </Box>
      </>
      )}
    </div>
  );
};

export default PaymentComponent;
