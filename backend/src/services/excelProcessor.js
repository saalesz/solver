const xlsx = require('xlsx');

const processarPlanilha = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  if (!data || data.length === 0) {
    throw new Error("A planilha está vazia ou o formato é inválido.");
  }

  // Função para filtrar e contar cada status
  const filtrarStatus = (statusAlvo) => {
    return data.filter(item => 
      item.Status && item.Status.toString().trim().toUpperCase() === statusAlvo.toUpperCase()
    ).length;
  };

  const processarDados = (registros) => {
    const totalRegistros = registros.length || 1; // Evita divisão por zero
    
    return {
      backlog: registros.length,
      // Soma a coluna "Peças" (ajuste o nome se no Excel estiver sem o ç)
      pecasFalta: registros.reduce((acc, item) => acc + (Number(item.Peças || item.Pecas || 0)), 0),
      lista: [
        { 
          label: 'Em onda', 
          valor: filtrarStatus('Em onda').toLocaleString('pt-BR'), 
          percentual: Math.round((filtrarStatus('Em onda') / totalRegistros) * 100) 
        },
        { 
          label: 'Separados', 
          valor: filtrarStatus('Separados').toLocaleString('pt-BR'), 
          percentual: Math.round((filtrarStatus('Separados') / totalRegistros) * 100) 
        },
        { 
          label: 'Com falta', 
          valor: filtrarStatus('Com falta').toLocaleString('pt-BR'), 
          percentual: Math.round((filtrarStatus('Com falta') / totalRegistros) * 100) 
        },
        { 
          label: 'Em Anomalia', 
          valor: filtrarStatus('Em Anomalia').toLocaleString('pt-BR'), 
          percentual: Math.round((filtrarStatus('Em Anomalia') / totalRegistros) * 100) 
        }
      ]
    };
  };

  // Retornamos os dois cenários. 
  // Dica: Para o teste, estamos usando os mesmos dados nos dois, 
  // mas no real você pode subir arquivos diferentes.
  return {
    inicial: processarDados(data),
    final: processarDados(data) 
  };
};

module.exports = { processarPlanilha };