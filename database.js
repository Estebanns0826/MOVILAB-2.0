const sqlite3 = require('sqlite3').verbose();

// Abrir la base de datos
const db = new sqlite3.Database('personal.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Database connected');

    // Crear la tabla 'Equipos' si no existe
    db.run(`CREATE TABLE IF NOT EXISTS equipos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      direccion TEXT,
      movimiento TEXT,
      tipo_equipo TEXT,
      tarjetas_ingresadas INTEGER,
      nombre_entrega TEXT,
      nombre_recibe TEXT,
      observaciones TEXT,
      fecha_notificacion DATE,
      fecha_revision DATE,
      diagnostico_revision TEXT,
      fecha_reparacion DATE,
      nombre_reparador TEXT,
      diagnostico_reparacion TEXT,
      fecha_entrega DATE,
      diagnostico_entrega TEXT,
      nombre_entrega_revisado TEXT,
      nombre_recibe_revisado TEXT,
      direccion_entrega TEXT,
      estado TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating table "Equipos"', err);
      } else {
        console.log('Table "Equipos" created or already exists');
      }
    });


        
        db.run(`CREATE TABLE IF NOT EXISTS data_perifericos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          direccion TEXT,
          tipo_movimiento TEXT,
          tipo_periferico TEXT,
          cantidad INTEGER,
          nombre_entrega TEXT,
          nombre_recibe TEXT,
          observaciones TEXT,
          fecha_notificacion DATE,
          fecha_revision DATE,
          diagnostico_revision TEXT,
          fecha_reparacion DATE,
          nombre_reparador TEXT,
          diagnostico_reparacion TEXT,
          fecha_entrega DATE,
          diagnostico_entrega TEXT,
          nombre_entrega_revisado TEXT,
          nombre_recibe_revisado TEXT,
          direccion_entrega TEXT,
          estado TEXT
        )`, (err) => {
          if (err) {
            console.error('Error creating table "data_perifericos"', err);
          } else {
            console.log('Table "data_perifericos" created or already exists');
          }
        });

    // Crear la tabla 'tecnicos' si no existe
    db.run(`CREATE TABLE IF NOT EXISTS tecnicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo_periferico TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Error creating table "perifericos"', err);
      } else {
        console.log('Table "perifericos" created or already exists');
      }
    });

        // Crear la tabla 'periferico' si no existe
      db.run(`CREATE TABLE IF NOT EXISTS perifericos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL
      )`, (err) => {
        if (err) {
          console.error('Error creating table "tecnicos"', err);
        } else {
          console.log('Table "tecnicos" created or already exists');
        }
      });
    

    // Crear la tabla 'ingenieros' si no existe
    db.run(`CREATE TABLE IF NOT EXISTS ingenieros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Error creating table "ingenieros"', err);
      } else {
        console.log('Table "ingenieros" created or already exists');
      }
    });
  }
});



module.exports = db;
