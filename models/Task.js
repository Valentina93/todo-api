const mongoose = require('mongoose');

// Definimos cómo será una tarea "por dentro"
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Creamos y exportamos el modelo
module.exports = mongoose.model('Task', taskSchema);