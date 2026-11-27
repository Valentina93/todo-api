const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ruta de salud
app.get('/health', (_req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Rutas CRUD de tareas (definidas en routes/tasks.js)
app.use('/tasks', tasksRouter);

// Manejador global de errores (evita respuestas HTML feas si falla el JSON)
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido en el cuerpo de la petición' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;