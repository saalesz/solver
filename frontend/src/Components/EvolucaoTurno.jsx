import React from 'react';
import styles from '../Styles/Components/EvolucaoTurno.module.css';

const EvolucaoTurno = ({ dadosIniciais, dadosFinais, cor }) => {

  // Função auxiliar para extrair valores da lista baseada no label
  const getValorPorLabel = (dados, labelPesquisado) => {
    if (!dados || !dados.lista) return 0;
    const item = dados.lista.find(i => i.label === labelPesquisado);
    return item ? Number(item.valor) : 0;
  };

  // Função para calcular a diferença (Evolução) com proteção contra NaN
  const calcularReducao = (inicial, final) => {
    const vInicial = Number(inicial) || 0;
    const vFinal = Number(final) || 0;
    const diff = vFinal - vInicial;

    // Se a diferença for zero e os dados ainda não foram carregados, retorna 0 fixo
    if (diff === 0 && vInicial === 0) return "0";

    // Formata com sinal de mais e pontos de milhar
    return diff > 0 ? `+${diff.toLocaleString('pt-BR')}` : diff.toLocaleString('pt-BR');
  };

  const itensEvolucao = [
    {
      label: "Redução de backlog",
      valor: calcularReducao(dadosIniciais.backlog, dadosFinais.backlog)
    },
    {
      label: "Redução de pedidos em onda",
      valor: calcularReducao(
        getValorPorLabel(dadosIniciais, 'Em onda'),
        getValorPorLabel(dadosFinais, 'Em onda')
      )
    },
    {
      label: "Redução de pedidos com falta",
      valor: calcularReducao(
        getValorPorLabel(dadosIniciais, 'Com falta'),
        getValorPorLabel(dadosFinais, 'Com falta')
      )
    },
    {
      label: "Redução de peças com falta",
      valor: calcularReducao(dadosIniciais.pecasFalta, dadosFinais.pecasFalta)
    },
  ];

  return (
    <div className={styles.containerEvolucao}>
      <h2 className={styles.titulo} style={{ color: cor }}>Evolução do turno</h2>

      <div className={styles.lista}>
        {itensEvolucao.map((item, index) => (
          <div key={index} className={styles.item}>
            <div className={styles.labelGroup}>
              <span className={styles.seta} style={{ borderTopColor: cor }}></span>
              <span className={styles.label}>{item.label}:</span>
            </div>

            <span className={styles.valor} style={{ color: cor }}>
              {item.valor}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvolucaoTurno;