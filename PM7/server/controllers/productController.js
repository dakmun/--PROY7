// productController.js
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import decodeToken from '../utils/decodeToken.js';

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  const { name, description, price, mainImage, images, category, discount, rating, numReviews, countInStock } = req.body;

  // Validación básica para asegurar de que los campos requeridos están presentes
  if (!name || !description || !price) {
    return res.status(400).json({ message: 'Por favor, proporciona el nombre, descripción y precio del producto' });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      mainImage: mainImage || '',
      images: images || [],
      category: category || 'General',
      discount: discount || 0,
      rating: rating || 0,
      numReviews: numReviews || 0,
      countInStock: countInStock || 0,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error al crear el producto', error });
  }
}

// Actualizar un producto
export const updateProduct = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  const { name, description, price, mainImage, images, category, discount, rating, numReviews, countInStock } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.mainImage = mainImage || product.mainImage;
    product.images = images || product.images;
    product.category = category || product.category;
    product.discount = discount || product.discount;
    product.rating = rating || product.rating;
    product.numReviews = numReviews || product.numReviews;
    product.countInStock = countInStock || product.countInStock;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error });
  }
};




export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  // Verifica si el ID del producto es válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("ID inválido:", id);
    return res.status(400).json({ message: 'ID inválido' });
  }

  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
  if (!token) {
    console.log("No se encontró el token");
    return res.status(401).json({ message: 'No autorizado, no se encontró token' });
  }

  try {
    const decoded = decodeToken(token);
    console.log("Token decodificado:", decoded);

    if (!decoded.isAdmin) {
      console.log("Usuario no autorizado:", decoded);
      return res.status(403).json({ message: 'No autorizado para eliminar productos' });
    }

    const product = await Product.findById(id);
    if (!product) {
      console.log("Producto no encontrado:", id);
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Producto eliminado' });
    console.log("Producto eliminado con éxito:", id);

  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};










