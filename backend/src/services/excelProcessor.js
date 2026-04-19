const XLSX = require('xlsx');
const fs = require('fs');

const processReport = (filePath) => {
    try {
        // 1. Lê o arquivo
        const workbook = XLSX.readFile(filePath, { cellDates: true });
        
        // IMPORTANTE: Se o seu Excel não tiver a aba 'Export', o código para aqui.
        // Tente mudar para 'Sheet1' se 'Export' não funcionar.
        const sheetName = workbook.SheetNames[0]; 
        const worksheet = workbook.Sheets[sheetName];

        const rawData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        // 2. Filtra apenas o que é pedido real
        const cleanData = rawData.filter(row =>
            row['Pedido'] && !row['Pedido'].toString().startsWith('Filtros')
        );

        // 3. Função para pegar valores de colunas com nomes variados
        const getVal = (row, targets) => {
            const key = Object.keys(row).find(k => 
                targets.some(t => k.toLowerCase().includes(t))
            );
            return key ? row[key].toString().trim() : "";
        };

        const kpis = {
            emOnda: cleanData.filter(r => getVal(r, ['status']).toLowerCase() === 'em onda').length,
            separados: cleanData.filter(r => getVal(r, ['status']).toLowerCase().includes('separado')).length,
            comFalta: cleanData.filter(r => getVal(r, ['status']).toLowerCase() === 'com falta').length,
            emAnomalia: cleanData.filter(r => {
                const s = getVal(r, ['status']).toLowerCase();
                return s.includes('anomalia') || s.includes('consolida');
            }).length,
            pecasComFalta: cleanData
                .filter(r => getVal(r, ['status']).toLowerCase() === 'com falta')
                .reduce((sum, r) => {
                    const val = getVal(r, ['peça', 'pecas', 'qtd']) || "0";
                    return sum + (parseInt(val.replace(/\D/g, '')) || 0);
                }, 0),
            totalPedidos: cleanData.length
        };

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return { kpis };
    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        throw error;
    }
};

module.exports = { processReport };