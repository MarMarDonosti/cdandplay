const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');  // Importa path

require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User } = require('./db'); // Importamos la base de datos y el modelo de usuario

const app = express();
const port = process.env.PORT || 4100;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const SQLiteStore = require('connect-sqlite3')(session);

app.use(session({
  store: new SQLiteStore({ db: 'sessions.db' }), // Almacena sesiones en SQLite
  secret: process.env.SESSION_SECRET || 'default_secret', // Poner una clave segura
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Cambia a true si usas HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 1 día de duración
  }
}));

// Ruta para servir el index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Saber quien es el usuario que se ha logeado
app.get('/api/perfil', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.json({});
  }
});

// Ruta para suscribir un usuario con edad
app.post('/subscribe', async (req, res) => {
  const { name, email, password, age } = req.body;

  // Validación
  if (!name || !email || !password || !age) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
  }

  try {
    // Verifica si el email ya existe en la base de datos
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado.' });
    }

    // Generar el hash de la contraseña con bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear un nuevo usuario en la base de datos con la edad incluida
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      age: age // Guardamos la edad en la base de datos
    });

    // Guardar el usuario en la sesión
    req.session.user = {
      id: newUser.id,  
      name: newUser.name,
      email: newUser.email,
      age: newUser.age  
    };

    res.status(200).json({ success: true, message: 'Usuario registrado correctamente.' });
  } catch (err) {
    console.error('Error al procesar la solicitud:', err);
    res.status(500).json({ success: false, message: 'Error al registrar el usuario.' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
