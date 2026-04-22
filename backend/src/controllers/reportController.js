const { processReport } = require('./../services/excelProcessor');

exports.uploadReport = (req, res) => {
    try {
        // 1. Verifica se o arquivo existe
        if (!req.file) {
            return res.status(400).json({ error: "Arquivo não enviado." });
        }

        const filePath = req.file.path;

        // 2. Executa o processamento (Apenas UMA vez agora)
        const result = processReport(filePath);

        // 3. LOG PARA DEBUG: Veja isso no terminal do VS Code
        console.log("-----------------------------------------");
        console.log("DADOS QUE ESTÃO SAINDO DO BACKEND:", result.kpis);
        console.log("-----------------------------------------");

        // 4. Envia a resposta para o frontend
        return res.json(result);

    } catch (error) {
        console.error("Erro ao processar:", error);
        return res.status(500).json({ error: "Falha no processamento do Excel." });
    }
};