const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Task = require('./models/Task'); // Importamos el modelo que creamos antes

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const tasksRouter = require('./routes/tasks');

app.use('/tasks', tasksRouter);

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('¡Conectado exitosamente a MongoDB Atlas! 🍃'))
    .catch((err) => console.error('Error al conectar con MongoDB:', err));

// Ruta de salud
app.get('/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// ==========================================
// ENDPOINTS CRUD PARA LAS TAREAS (/tasks)
// ==========================================

// 1. CREATE (POST): Crear una nueva tarea
app.post('/tasks', async (req, res) => {
    try {
        const newTask = new Task({ title: req.body.title });
        await newTask.save();
        res.status(201).json({ success: true, data: newTask });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// 2. READ (GET): Obtener todas las tareas
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. UPDATE (PUT): Actualizar una tarea por su ID
app.put('/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { completed: req.body.completed, title: req.body.title },
            { new: true } // Devuelve el documento actualizado
        );
        res.json({ success: true, data: updatedTask });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// 4. DELETE (DELETE): Eliminar una tarea por su ID
app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});