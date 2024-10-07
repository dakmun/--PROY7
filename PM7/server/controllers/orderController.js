import Order from '../models/Order.js';

// controlador para crear una nueva orden
export const createUserOrder = async (req, res) => {
  const { cart, totalPrice, paymentId } = req.body;  

  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: 'No hay productos en el carrito' });
  }

  if (!paymentId) {
    return res.status(400).json({ message: 'Falta el paymentId en la solicitud' });
  }

  try {
    const newOrder = new Order({
      userId: req.user._id,
      items: cart.map((item) => ({
        productId: item.productId, 
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
      })),
      totalPrice,
      paymentId, // Almacenar el ID del pago
    });
    

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).json({ message: 'Error al crear la orden' });
  }
};






// Controlador para obtener las órdenes de un usuario
export const getUserOrdersByUserId = async (req, res) => {

  try {

    const userID = req.params.userID;

    if (!req.user?.isAdmin && req.user?._id !== userID) {
      return res.status(403).json({ message: 'No autorizado para ver estos datos.' });
    }
    // Buscar las órdenes del usuario autenticado
    const orders = await Order.find({ userId: req.user._id });

    res.json(orders);
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    res.status(500).json({ message: 'Error al obtener las órdenes' });
  }
};

// Obtener todas las órdenes
export const getAllOrders = async (req, res) => {

  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'No autorizado para ver estos datos.' });
  }

  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};

// Obtener orden por ID
export const getOrderById = async (req, res) => {
  try {

    if (!req.user?.isAdmin && req.user?._id !== req.params.id) {
      return res.status(403).json({ message: 'No autorizado para ver estos datos.' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el pedido', error });
  }
};


export const deleteOrderById = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.json({ message: 'Orden eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la orden', error });
  }
};

