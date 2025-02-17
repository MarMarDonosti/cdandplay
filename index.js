const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
    //db.run("CREATE TABLE IF NOT EXISTS alumnos (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, email TEXT, photo TEXT)");
    //db.run("INSERT INTO alumnos (name,age,email) VALUES (?,?,?)", ["Juan",23,"email@mail.com"]);
    
    // Adaptar los cambios a mi tabla Users (sólo cambia 'Users' y los campos de la tabla)
    // *** lo siguiente, descomentarlo si no hace falta age
    // db.each("SELECT * FROM Users", (err, row) => {
    //     console.log(row.id + ": " + row.name + ": " + row.email + ": " + row.password + ": " + row.createdAt + ": " + row.updatedAt);
    // });
    db.each("SELECT * FROM Users", (err, row) => {
        if (err) {
            console.error('Error al leer los datos:', err);
        } else {
            // Mostrar los resultados, incluyendo la edad
            console.log(`${row.id}: ${row.name} | ${row.email} | ${row.age} | ${row.password} | ${row.createdAt} | ${row.updatedAt}`);
        }
    });
});

db.close();