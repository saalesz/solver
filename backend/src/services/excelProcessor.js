// Use exatamente os nomes das colunas do print do BI
const processarDados = (registros) => {
    return {
        backlog: registros.length,
        // Note o "Peças" com cedilha, conforme o seu print
        pecasFalta: registros.reduce((acc, item) => acc + (Number(item['Peças']) || 0), 0),
        lista: [
            {
                label: 'Em onda',
                valor: registros.filter(i => String(i.Status).toUpperCase() === 'EM ONDA').length,
                percentual: 0 // cálculo de % aqui
            },
            {
                label: 'Separados',
                valor: registros.filter(i => String(i.Status).toUpperCase() === 'SEPARADOS').length,
                percentual: 0 // cálculo de % aqui
            },
            {
                label: 'Com falta',
                valor: registros.filter(i => String(i.Status).toUpperCase() === 'COM FALTA').length,
                percentual: 0 // cálculo de % aqui
            },
            {
                label: 'Em Anomalia',
                valor: registros.filter(i => String(i.Status).toUpperCase() === 'EM ANOMALIA').length,
                percentual: 0 // cálculo de % aqui
            },
        ]
    };
};