const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const db = require('./database'); // Asegúrate de que esta ruta sea correcta

const app = express();
const port = 3500;

// Middleware para seguridad, CORS, y análisis de cuerpo de solicitudes
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para establecer la política de seguridad de contenido (CSP)
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline'");
    next();
});

// Configura el middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Servir archivos estáticos desde la carpeta 'routes'
app.use(express.static(path.join(__dirname, 'routes')));

// Ruta de inicio para servir home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'routes', 'home.html'));
});

// Ruta para añadir técnicos
app.post('/add-technician', (req, res) => {
    const name = req.body.technicianName;
    if (!name || typeof name !== 'string') {
        return res.status(400).send('Invalid technician name');
    }

    db.run('INSERT INTO tecnicos (nombre) VALUES (?)', [name], (err) => {
        if (err) {
            console.error('Error inserting technician', err);
            res.status(500).send('Error adding technician');
        } else {
            res.send('Technician added successfully');
        }
    });
});

// Ruta para añadir ingenieros
app.post('/add-engineer', (req, res) => {
    const name = req.body.engineerName;
    if (!name || typeof name !== 'string') {
        return res.status(400).send('Invalid engineer name');
    }

    db.run('INSERT INTO ingenieros (nombre) VALUES (?)', [name], (err) => {
        if (err) {
            console.error('Error inserting engineer', err);
            res.status(500).send('Error adding engineer');
        } else {
            res.send('Engineer added successfully');
        }
    });
});

// Ruta para mostrar técnicos e ingenieros en formato JSON
app.get('/view-data', (req, res) => {
    const techniciansPromise = new Promise((resolve, reject) => {
        db.all('SELECT * FROM tecnicos', (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });

    const engineersPromise = new Promise((resolve, reject) => {
        db.all('SELECT * FROM ingenieros', (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });

    Promise.all([techniciansPromise, engineersPromise])
        .then(([technicians, engineers]) => {
            res.json({ technicians, engineers });
        })
        .catch(err => {
            console.error('Error retrieving data', err);
            res.status(500).send('Error retrieving data');
        });
});

// Ruta para editar técnicos
app.post('/edit-technician', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    if (!id || !name) {
        return res.status(400).send('Invalid data');
    }

    db.run('UPDATE tecnicos SET nombre = ? WHERE id = ?', [name, id], (err) => {
        if (err) {
            console.error('Error updating technician', err);
            res.status(500).send('Error updating technician');
        } else {
            res.send('Technician updated successfully');
        }
    });
});

// Ruta para editar ingenieros
app.post('/edit-engineer', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    if (!id || !name) {
        return res.status(400).send('Invalid data');
    }

    db.run('UPDATE ingenieros SET nombre = ? WHERE id = ?', [name, id], (err) => {
        if (err) {
            console.error('Error updating engineer', err);
            res.status(500).send('Error updating engineer');
        } else {
            res.send('Engineer updated successfully');
        }
    });
});

// Ruta para eliminar técnicos
app.post('/delete-technician', (req, res) => {
    const id = req.body.id;
    if (!id) {
        return res.status(400).send('Invalid technician ID');
    }

    db.run('DELETE FROM tecnicos WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting technician', err);
            res.status(500).send('Error deleting technician');
        } else {
            res.send('Technician deleted successfully');
        }
    });
});

// Ruta para eliminar ingenieros
app.post('/delete-engineer', (req, res) => {
    const id = req.body.id;
    if (!id) {
        return res.status(400).send('Invalid engineer ID');
    }

    db.run('DELETE FROM ingenieros WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting engineer', err);
            res.status(500).send('Error deleting engineer');
        } else {
            res.send('Engineer deleted successfully');
        }
    });
});

// Ruta para obtener técnicos
app.get('/api/tecnicos', (req, res) => {
    db.all('SELECT nombre FROM tecnicos', [], (err, rows) => {
        if (err) {
            console.error('Error retrieving technicians', err);
            return res.status(500).send('Error retrieving technicians');
        }
        res.json(rows.map(row => row.nombre));
    });
});

// Ruta para obtener ingenieros
app.get('/api/ingenieros', (req, res) => {
    db.all('SELECT nombre FROM ingenieros', [], (err, rows) => {
        if (err) {
            console.error('Error retrieving engineers', err);
            return res.status(500).send('Error retrieving engineers');
        }
        res.json(rows.map(row => row.nombre));
    });
});

// Ruta para procesar el formulario


// Manejo de errores globales (opcional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


// Ruta para obtener todos los equipos
app.get('/api/equipos', (req, res) => {
    db.all('SELECT * FROM equipos', [], (err, rows) => {
        if (err) {
            console.error('Error retrieving equipos', err);
            return res.status(500).send('Error retrieving equipos');
        }
        res.json(rows);
    });
});

// Ruta para obtener un equipo por ID
app.get('/api/equipos/:id', (req, res) => {
    const equipoId = req.params.id;
    db.get('SELECT * FROM Equipos WHERE id = ?', [equipoId], (err, row) => {
        if (err) {
            console.error('Error retrieving equipo', err);
            res.status(500).send('Error retrieving equipo');
        } else {
            res.json(row);
        }
    });
});




// Ruta para obtener los últimos 5 registros
app.get('/api/ultimos_equipos', (req, res) => {
    db.all('SELECT * FROM Equipos ORDER BY id DESC LIMIT 5', [], (err, rows) => {
        if (err) {
            console.error('Error retrieving recent records', err);
            res.status(500).send('Error retrieving recent records');
        } else {
            res.json(rows);
        }
    });
});


// GUARDAR DIRECCIÓN RESULTANTE DEL FRONT
app.post('/guardar_direccion', (req, res) => {
    const direccionResultante = req.body.direccion_resultante;

    if (!direccionResultante) {
        return res.status(400).json({ success: false, message: 'Dirección resultante es requerida' });
    }

    const sql = 'INSERT INTO equipos (direccion) VALUES (?)';
    db.run(sql, [direccionResultante], (err) => {
        if (err) {
            console.error('Error inserting address', err);
            res.status(500).json({ success: false, message: 'Error al guardar la dirección' });
        } else {
            res.json({ success: true });
        }
    });
});


// GUARDAR TIPO DE MOVIMIENTO FRONT PAGE

// Ruta para procesar el formulario y guardar datos en la tabla equipos
app.post('/guardar_equipo', (req, res) => {
    const { tipo_movimiento, tipo_equipo, tarjetas_ingresadas, direccion_resultante, nombre_entrega, nombre_recibe, observaciones, estado, fecha_notificacion} = req.body;

    if (!tipo_movimiento || !tipo_equipo || !Array.isArray(tarjetas_ingresadas) || !direccion_resultante || !nombre_entrega || !nombre_recibe) {
        return res.status(400).json({ success: false, message: 'Datos incompletos o incorrectos' });
    }

    // Convertir tarjetas_ingresadas en un formato de texto
    const tarjetasTexto = tarjetas_ingresadas.map(tarjeta => `${tarjeta.tarjeta} (${tarjeta.cantidad})`).join(', ');

    // Consulta para insertar los datos en la tabla `equipos`
    const sql = 'INSERT INTO equipos (movimiento, tipo_equipo, tarjetas_ingresadas, direccion, nombre_entrega, nombre_recibe, observaciones, estado, fecha_notificacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.run(sql, [tipo_movimiento, tipo_equipo, tarjetasTexto, direccion_resultante, nombre_entrega, nombre_recibe, observaciones, estado, fecha_notificacion], (err) => {
        if (err) {
            console.error('Error inserting data into equipos:', err.message);
            res.status(500).json({ success: false, message: 'Error al guardar los datos' });
        } else {
            res.json({ success: true, message: 'Datos guardados correctamente' });
        }
    });
});


// Ruta para obtener información sobre las tablas
app.get('/api/tables-info', (req, res) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            console.error('Error retrieving table names', err);
            return res.status(500).send('Error retrieving table names');
        }

        const tablePromises = tables.map(table => {
            return new Promise((resolve, reject) => {
                db.get(`SELECT COUNT(*) as count FROM ${table.name}`, (err, row) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve({ name: table.name, count: row.count });
                });
            });
        });

        Promise.all(tablePromises)
            .then(results => res.json(results))
            .catch(err => {
                console.error('Error retrieving table data', err);
                res.status(500).send('Error retrieving table data');
            });
    });
});

// Ruta para eliminar una tabla
app.post('/api/delete-table', (req, res) => {
    const { tableName } = req.body;
    if (!tableName) {
        return res.status(400).send('Table name is required');
    }

    db.run(`DROP TABLE IF EXISTS ${tableName}`, (err) => {
        if (err) {
            console.error('Error deleting table', err);
            return res.status(500).send('Error deleting table');
        }
        res.send('Table deleted successfully');
    });
});



// Función para obtener los datos del equipo por ID
const getEquipoById = (id, callback) => {
    db.get('SELECT * FROM Equipos WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Error fetching equipo data:', err);
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
};

// Ruta para generar informes dinámicos
app.get('/api/generar-informe/:id', (req, res) => {
    const equipoId = req.params.id;
    
    getEquipoById(equipoId, (err, equipoData) => {
        if (err || !equipoData) {
            return res.status(404).send('Equipo no encontrado');
        }

        let informeHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Informe de ${equipoData.tipo_equipo} - ${equipoData.direccion} - ${equipoData.fecha_notificacion}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif; 
                        padding: 20px; 
                        margin: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 800px; 
                        margin: 0 auto; 
                        background: #fff; 
                        padding: 20px; 
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        text-align: center; 
                        color: #333;
                    }
                    table {
                        width: 100%; 
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid #ddd; 
                        padding: 12px;
                    }
                    th {
                        background-color: #f4f4f4;
                        color: #333;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    button {
                        display: block; 
                        margin: 20px auto; 
                        padding: 10px 20px; 
                        font-size: 16px; 
                        background-color: #007bff; 
                        color: #fff; 
                        border: none; 
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    button:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Informe de ${equipoData.tipo_equipo}</h1>
                    <p><strong>Dirección:</strong> ${equipoData.direccion}</p>
                    <p><strong>Fecha de Notificación:</strong> ${equipoData.fecha_notificacion}</p>
                    <table>
                        <tr><th>ID</th><td>${equipoData.id}</td></tr>
                        <tr><th>Movimiento</th><td>${equipoData.movimiento}</td></tr>
                        <tr><th>Tarjetas Ingresadas</th><td>${equipoData.tarjetas_ingresadas}</td></tr>
                        <tr><th>Nombre Entrega</th><td>${equipoData.nombre_entrega}</td></tr>
                        <tr><th>Nombre Recibe</th><td>${equipoData.nombre_recibe}</td></tr>
                        <tr><th>Estado</th><td>${equipoData.estado}</td></tr>
                        <tr><th>Observaciones</th><td>${equipoData.observaciones}</td></tr>
                        <tr><th>Fecha Revisión</th><td>${equipoData.fecha_revision}</td></tr>
                        <tr><th>Diagnóstico Revisión</th><td>${equipoData.diagnostico_revision}</td></tr>
                        <tr><th>Fecha Reparación</th><td>${equipoData.fecha_reparacion}</td></tr>
                        <tr><th>Nombre de Reparador</th><td>${equipoData.nombre_reparador}</td></tr> 
                        <tr><th>Diagnóstico Reparación</th><td>${equipoData.diagnostico_reparacion}</td></tr>
                        <tr><th>Fecha Entrega</th><td>${equipoData.fecha_entrega}</td></tr>
                        <tr><th>Diagnóstico Entrega</th><td>${equipoData.diagnostico_entrega}</td></tr>
                        <tr><th>Nombre Entrega Revisado</th><td>${equipoData.nombre_entrega_revisado}</td></tr>
                        <tr><th>Nombre Recibe Revisado</th><td>${equipoData.nombre_recibe_revisado}</td></tr>
                        <tr><th>Dirección Entrega</th><td>${equipoData.direccion_entrega}</td></tr>
                    </table>
                    <button onclick="window.print()">Imprimir Informe</button>
                </div>
            </body>
            </html>
        `;

        res.send(informeHTML);
    });
});



// Ruta para consultar equipos por dirección
app.get('/api/buscar_equipos', (req, res) => {
    const direccion = req.query.direccion;

    if (!direccion) {
        return res.status(400).json({ error: 'Dirección es requerida' });
    }

    const sql = `SELECT * FROM equipos WHERE direccion LIKE ?`;

    db.all(sql, [`%${direccion}%`], (err, rows) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        res.json(rows);
    });
});

// Endpoint para eliminar un equipo
app.delete('/api/eliminar_equipo/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM equipos WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).json({ error: 'Error al eliminar el equipo.' });
        } else {
            res.status(200).json({ message: 'Equipo eliminado con éxito.' });
        }
    });
});

// Endpoint para obtener los detalles de un equipo por ID
app.get('/api/detalle_equipo/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.get('SELECT * FROM equipos WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error en la consulta a la base de datos' });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Equipo no encontrado' });
        }
    });
});


// Eliminar un equipo por ID
app.delete('/api/eliminar_equipo/:id', (req, res) => {
    const id = parseInt(req.params.id);
    equipos = equipos.filter(equipo => equipo.id !== id);
    res.status(200).send('Equipo eliminado');
});


// Ruta para guardar la fecha de revisión, el diagnóstico y actualizar el estado
app.post('/api/guardar_revision/:id', (req, res) => {
    const equipoId = req.params.id;
    const { fecha_Revision, diagnostico_Revision } = req.body;

    if (!fecha_Revision || !diagnostico_Revision) {
        return res.status(400).json({ success: false, message: 'Fecha de revisión y diagnóstico son requeridos' });
    }

    const sql = `
        UPDATE equipos
        SET fecha_revision = ?, diagnostico_revision = ?, estado = 'Revisado'
        WHERE id = ?
    `;
    
    db.run(sql, [fecha_Revision, diagnostico_Revision, equipoId], function(err) {
        if (err) {
            console.error('Error al actualizar la revisión:', err.message);
            res.status(500).json({ success: false, message: 'Error al guardar la revisión' });
        } else if (this.changes === 0) {
            res.status(404).json({ success: false, message: 'Equipo no encontrado' });
        } else {
            res.json({ success: true, message: 'Revisión guardada correctamente y estado actualizado' });
        }
    });
});

// Ruta para guardar la fecha de revisión, el diagnóstico y actualizar el estado
// Ruta para guardar la fecha de revisión, el diagnóstico y actualizar el estado
app.post('/api/reparar/:id', (req, res) => {
    const equipoId = req.params.id;
    const { fecha_reparacion, diagnostico_reparacion, nombre_reparador } = req.body;

    // Validación de entrada
    if (!fecha_reparacion || !diagnostico_reparacion || !nombre_reparador) {
        return res.status(400).json({
            success: false,
            message: 'Fecha de reparación, diagnóstico y nombre del reparador son requeridos.'
        });
    }

    const sql = `
        UPDATE equipos
        SET fecha_reparacion = ?, diagnostico_reparacion = ?, nombre_reparador = ?, estado = 'Reparado'
        WHERE id = ?
    `;

    db.run(sql, [fecha_reparacion, diagnostico_reparacion, nombre_reparador, equipoId], function(err) {
        if (err) {
            console.error('Error al actualizar la revisión:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Error al guardar la revisión.',
                error: err.message // Agrega el mensaje de error para depuración
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Equipo no encontrado.'
            });
        }
        
        return res.json({
            success: true,
            message: 'Revisión guardada correctamente y estado actualizado.'
        });
    });
});
