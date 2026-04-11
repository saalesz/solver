import React from 'react';
import styles from '../Styles/Components/EvolucaoTurno.module.css';

const EvolucaoTurno = ({ dadosIniciais, dadosFinais, cor }) => {
  // Função para calcular a diferença (Evolução)
  const calcularReducao = (inicial, final) => {
    const diff = final - inicial;
    // Formata com sinal de menos e pontos de milhar
    return diff > 0 ? `+${diff.toLocaleString('pt-BR')}` : diff.toLocaleString('pt-BR');
  };

  const itensEvolucao = [
    { label: "Redução de backlog", valor: calcularReducao(dadosIniciais.backlog, dadosFinais.backlog) },
    { label: "Redução de pedidos em onda", valor: calcularReducao(dadosIniciais.onda, dadosFinais.onda) },
    { label: "Redução de pedidos com falta", valor: calcularReducao(dadosIniciais.pedidosFalta, dadosFinais.pedidosFalta) },
    { label: "Redução de peças com falta", valor: calcularReducao(dadosIniciais.pecasFalta, dadosFinais.pecasFalta) },
  ];

  return (
    <div className={styles.containerEvolucao}>
      <h2 className={styles.titulo} style={{ color: cor }}>Evolução do turno</h2>

      <div className={styles.lista}>
        {itensEvolucao.map((item, index) => (
          <div key={index} className={styles.item}>
            <div className={styles.labelGroup}>
              {/* O triângulo (seta) apontando para baixo conforme a imagem */}
              <span className={styles.seta} style={{ borderTopColor: cor }}></span>
              <span className={styles.label}>{item.label}:</span>
            </div>

            {/* O valor cravado 8px na direita */}
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