import React, { createContext, useState, useEffect, useCallback } from 'react';

// Crear el contexto del carrito
export const CartContext = createContext();

// Proveedor del contexto del carrito
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Cargar carrito desde localStorage al iniciar la app
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart'));
      if (savedCart && Array.isArray(savedCart)) {
        setCart(savedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Guardar carrito en localStorage con un debounce de 500ms
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        if (cart.length > 0) {
          localStorage.setItem('cart', JSON.stringify(cart));
        } else {
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }, 500);

    return () => clearTimeout(timeoutId); // Limpiar timeout en desmontaje o actualización
  }, [cart]);

  // Función para agregar un producto al carrito
  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);

      if (existingProduct) {
        // Si el producto ya existe en el carrito, aumentamos su cantidad
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        // Si es un nuevo producto, lo añadimos con una cantidad inicial de 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  }, []);

  // Función para remover un producto del carrito
  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  }, []);

  // Función para limpiar el carrito (eliminar todos los productos)
  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('cart'); // También eliminar del localStorage directamente
  }, []);

  // Función para calcular el precio total de los productos en el carrito
  const getTotalPrice = useCallback(() => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  }, [cart]);


  // Función para obtener la cantidad total de productos en el carrito
  const cartLength = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Proveer los valores y funciones del contexto a los componentes hijos
  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, removeFromCart, clearCart, getTotalPrice, cartLength }}
    >
      {children}
    </CartContext.Provider>
  );
};
