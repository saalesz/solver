const express = require('express');
const cors = require('cors'); // Importe o cors
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(cors()); // Ative o cors antes das rotas
app.use(express.json());
app.use('/api/reports', reportRoutes);

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));