// Archivo para gestionar la conexión con la base de datos

const { Sequelize, DataTypes } = require('sequelize');

// Configura la conexión a SQLite (en memoria o en disco)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',  // Puedes poner la base de datos en un archivo
});

// Verifica la conexión
sequelize.authenticate()
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch(err => console.error('No se pudo conectar a la base de datos:', err));

// Define el modelo de usuario
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: { //***/
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 18,  
      max: 120, 
    },
  },
});

// const bcrypt = require('bcrypt');
// User.beforeCreate(async (user) => {
//   user.password = await bcrypt.hash(user.password, 10);
// });



// Sincroniza los modelos con la base de datos (esto crea la tabla si no existe)
sequelize.sync({ force: false })
  .then(() => console.log('Tablas sincronizadas'))
  .catch(err => console.error('Error sincronizando las tablas:', err));


module.exports = { sequelize, User };
