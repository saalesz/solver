const { processReport } = require('./../services/excelProcessor');

exports.uploadReport = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Arquivo não enviado." });
        }

        const filePath = req.file.path;

        const result = processReport(req.file.path);
        console.log("TESTE BACKEND:", result.kpis); // Esse log tem que aparecer no terminal!
        return res.json(result);

        // Executa o processamento que criamos no utils
        const result = processReport(filePath);

        // LOG PARA DEBUG: Veja isso no terminal do VS Code (não no navegador)
        console.log("DADOS QUE ESTÃO SAINDO DO BACKEND:", result.kpis);

        res.json(result);
    } catch (error) {
        console.error("Erro ao processar:", error);
        res.status(500).json({ error: "Falha no processamento do Excel." });
    }
};