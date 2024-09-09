-- Crear la base de datos 'personal'
-- SQLite no requiere explícitamente una instrucción CREATE DATABASE,
-- ya que crea el archivo de base de datos cuando se conecta a él.

-- Crear la tabla 'tecnicos'
CREATE TABLE IF NOT EXISTS tecnicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

-- Crear la tabla 'ingenieros'
CREATE TABLE IF NOT EXISTS ingenieros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

-- Crear la tabla 'equipos'
CREATE TABLE IF NOT EXISTS equipos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    direccion_tipo_1 TEXT,
    direccion_numero_1 TEXT,
    direccion_tipo_2 TEXT,
    direccion_numero_2 TEXT,
    tipo_movimiento TEXT,
    tipo_equipo TEXT,
    tarjetas_ingresadas INTEGER,
    nombre_entrega TEXT,
    nombre_recibe TEXT,
    fecha_notificacion DATE,
    fecha_revision DATE,
    diagnostico_revision TEXT,
    fecha_reparacion DATE,
    diagnostico_reparacion TEXT,
    fecha_entrega DATE,
    diagnostico_entrega TEXT,
    nombre_entrega_revisado TEXT,
    nombre_recibe_revisado TEXT,
    direccion_entrega TEXT,
    observaciones TEXT
);
