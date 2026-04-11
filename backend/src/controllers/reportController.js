// backend/src/controllers/reportController.js
const excelProcessor = require('../services/excelProcessor');

const uploadReport = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado." });
    }

    const dadosProcessados = excelProcessor.processarPlanilha(req.file.path);
    
    // Retorna os dados para o seu front atualizar o estado (Cenario Inicial/Final)
    res.json(dadosProcessados);
  } catch (error) {
    res.status(500).json({ message: "Erro ao processar o Excel.", error });
  }
};

module.exports = { uploadReport };