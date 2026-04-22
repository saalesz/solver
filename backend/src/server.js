const express = require('express');
const cors = require('cors');
const reportRoutes = require('./routes/reportRoutes'); 
const fs = require('fs');

const app = express();

// 1. Garante que a pasta uploads existe (Apenas uma vez)
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
    console.log('📂 Pasta uploads verificada/criada.');
}

// 2. Middlewares
app.use(cors());
app.use(express.json());

// 3. Rotas
app.use('/api/reports', reportRoutes);

// 4. Inicialização
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor do Solver rodando na porta ${PORT}`);
});