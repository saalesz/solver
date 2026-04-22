const XLSX = require('xlsx');
const fs = require('fs');

const processReport = (filePath) => {
    try {
        // 1. Lê o arquivo Excel
        const workbook = XLSX.readFile(filePath, { cellDates: true });

        // Pega a primeira aba disponível
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Converte para JSON
        const rawData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        // 2. Filtra apenas o que é pedido real (ignora linhas de cabeçalho do BI)
        const cleanData = rawData.filter(row =>
            row['Pedido'] && !row['Pedido'].toString().startsWith('Filtros')
        );

        // 3. Função auxiliar para buscar valores ignorando maiúsculas/minúsculas
        const getVal = (row, targets) => {
            const key = Object.keys(row).find(k =>
                targets.some(t => k.toLowerCase() === t.toLowerCase()) // Busca exata primeiro
                || targets.some(t => k.toLowerCase().includes(t.toLowerCase()) && !k.toLowerCase().includes('pedido'))
            );
            return key ? row[key].toString().trim() : "";
        };

        // 4. Cálculo dos KPIs
        const kpis = {
            // Conta pedidos "Em Onda"
            emOnda: cleanData.filter(r => {
                const s = getVal(r, ['status']).toLowerCase();
                return s === 'em onda';
            }).length,

            // Conta pedidos "Separados" (Puxando a base sem filtro no BI, isso aqui vai brilhar!)
            separados: cleanData.filter(r => {
                const s = getVal(r, ['status']).toLowerCase();
                return s.includes('separado');
            }).length,

            // Conta pedidos com status "Com Falta"
            comFalta: cleanData.filter(r => {
                const s = getVal(r, ['status']).toLowerCase();
                return s === 'com falta';
            }).length,

            // Agrupa anomalias e consolidação
            emAnomalia: cleanData.filter(r => {
                const s = getVal(r, ['status']).toLowerCase();
                return s.includes('anomalia') || s.includes('consolida');
            }).length,

            pecasComFalta: cleanData
                .filter(r => {
                    const s = getVal(r, ['status']).toLowerCase();
                    return s === 'com falta';
                })
                .reduce((sum, r) => {
                    let valorLinha = 0;

                    // BUSCA DINÂMICA: Percorre todas as colunas da linha
                    Object.keys(r).forEach(key => {
                        const valorOriginal = r[key].toString().trim();
                        // Remove tudo que não é número
                        const apenasNumeros = valorOriginal.replace(/\D/g, '');
                        const num = parseInt(apenasNumeros) || 0;

                        // CRITÉRIO: Se o valor for entre 1 e 500 (quantidade comum de peças por pedido)
                        // E o nome da coluna NÃO for 'pedido' nem 'onda'
                        const nomeColuna = key.toLowerCase();
                        if (
                            num > 0 &&
                            num < 500 &&
                            !nomeColuna.includes('pedido') &&
                            !nomeColuna.includes('onda') &&
                            !nomeColuna.includes('data')
                        ) {
                            valorLinha = num;
                        }
                    });

                    return sum + valorLinha;
                }, 0),

            totalPedidos: cleanData.length
        };

        // 5. Deleta o arquivo temporário após o processamento
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        return { kpis };

    } catch (error) {
        // Se der erro, tenta deletar o arquivo para não entupir a pasta uploads
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        console.error("Erro no ExcelProcessor:", error);
        throw error;
    }
};

module.exports = { processReport };