import express from 'express';
import getRouterUser from './src/routers/router.user.js';
import controllerDbFactory from './src/models/factory.controller.db.js'
import {getVariablesDB} from './src/helpers/getVariablesEntorno.js'
import jwt from 'jsonwebtoken';

const controllerDB = controllerDbFactory(getVariablesDB())
const routerUser = getRouterUser(controllerDB);

const app = express();
app.use(express.json()); // Para parsear JSON en las peticiones

//manejo de ruta user
app.use('/usuarios', routerUser);

// =====================
// SIMULACIÓN DE BASE DE DATOS
// =====================
const usuarios = [
  {
    id: 1,
    email: 'admin@ejemplo.com',
    password: '123456', // En producción siempre hashear (bcrypt)
    rol: 'admin'
  },
  {
    id: 2,
    email: 'user@ejemplo.com',
    password: 'abcdef',
    rol: 'cliente'
  }
];

// =====================
// ENDPOINT DE LOGIN (genera el token)
// =====================
app.post('/login', (req, res) => {
  const { email, password } = req.body;
    console.log(email)
  // Buscar usuario (en realidad consultarías a la BD)
  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (!usuario) {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
  }

  // payload del token (sin información sensible como password)
  const payload = {
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol
  };

  // Firmar el token
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // Opcional: enviar también el usuario sin password
  res.json({
    mensaje: 'Login exitoso',
    token,
    usuario: { id: usuario.id, email: usuario.email, rol: usuario.rol }
  });
});

// =====================
// MIDDLEWARE PARA VERIFICAR TOKEN
// =====================
const verificarToken = (req, res, next) => {
  // Obtener token del header Authorization: "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado o formato inválido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Adjuntar info del usuario al request
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ mensaje: 'Token expirado' });
    }
    return res.status(403).json({ mensaje: 'Token inválido' });
  }
};

// =====================
// RUTA PROTEGIDA (cualquier usuario autenticado)
// =====================
app.get('/perfil', verificarToken, (req, res) => {
  res.json({
    mensaje: 'Acceso concedido a información del perfil',
    usuario: req.usuario
  });
});

// =====================
// RUTA PROTEGIDA CON ROLES (solo admin)
// =====================
app.get('/admin', verificarToken, (req, res) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'No tienes permisos de administrador' });
  }
  res.json({ mensaje: 'Bienvenido, admin', usuarios });
});

// =====================
// INICIAR SERVIDOR
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});