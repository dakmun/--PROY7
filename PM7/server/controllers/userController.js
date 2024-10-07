import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import process from 'node:process';
import dotenv from 'dotenv';

dotenv.config();

// Registro de usuario
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = new User({
      name,
      email,
      password,
      isAdmin: false,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Token generado:', token); // Agregado para depuración
    res.status(201).json({ token });
  } catch (error) {
    console.error('Error en el registro de usuario:', error); // Agregado para depuración
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Verificar si el valor de isAdmin es un booleano
    if (typeof user.isAdmin !== 'boolean') {
      return res.status(401).json({ message: 'Usuario no registrado correctamente.' });
    }

    // Generar el token JWT solo con _id e isAdmin
    const token = jwt.sign(
      {
        _id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Devolver solo el token
    res.status(200).json({
      message: 'Usuario autenticado',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};


// Controlador para obtener todos los usuarios (Chequeado)
export const getUsers = async (req, res) => {

if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'No autorizado para ver estos datos.' });
  }

  try {
      const users = await User.find().select('-password');
      return res.json(users);
    }
    catch (error) {
      return res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};


// Controlador para obtener un usuario por ID (Chequeado)
export const getUserById = async (req, res) => {

  try {
    const userId = req.params.id;

    // Si el usuario autenticado no es administrador y está intentando acceder a otros datos
    if (!req.user?.isAdmin && req.user?._id !== userId) {
      return res.status(403).json({ message: 'No autorizado para ver estos datos.' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los datos del usuario', error });
  }
};


// Controlador para actualizar un usuario por ID (Chequeado)
export const updateUserById = async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.params.id;

  // Solo permitir que los usuarios actualicen sus propios datos o los administradores actualicen a cualquier usuario
  if (!req.user?.isAdmin && req.user?._id !== userId) {
    return res.status(403).json({ message: 'No autorizado para actualizar estos datos.' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar name, email y password si están presentes
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = password;
    }

    await user.save();

    return res.json({ message: 'Datos del usuario actualizados correctamente', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar los datos del usuario', error });
  }
};

// Controlador para verificar la contraseña de un usuario (Chequeado)
export const verifyPassword = async (req, res) => {
  const { currentPassword, userId } = req.body;

   if (!req.user?.isAdmin && req.user?._id !== req.params.id) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  try {
    // Buscar el usuario por su ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña proporcionada con la contraseña almacenada
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Si la contraseña es válida, devolver una respuesta exitosa
    return res.status(200).json({ message: 'Contraseña verificada correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al verificar la contraseña', error });
  }
};


// Controlador para crear un usuario (Chequeado)
export const createUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  // Si el usuario autenticado no es administrador
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'No autorizado para crear usuarios' });
  }


  try {
    const user = new User({ name, email, password, isAdmin }); 
    await user.save(); 
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear el usuario', error });
  }
};


// Controlador para eliminar un usuario (Chequeado)
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  // Si el usuario autenticado no es administrador
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'No autorizado para eliminar usuarios' });
  }


  // Verifica si el ID del usuario es válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("ID inválido:", id);
    return res.status(400).json({ message: 'ID inválido' });
  }

try {
      const user = await User.findById(id);
    if (!user) {
      console.log("Usuario no encontrado:", id);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Utiliza deleteOne() o findByIdAndDelete()
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'Usuario eliminado' });
    console.log("Usuario eliminado con éxito:", id);

  } catch (error) {
    console.error('Error al eliminar el Usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el Usuario', error: error.message });
  }
};


