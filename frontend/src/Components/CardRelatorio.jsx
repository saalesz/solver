import React from 'react';
import styles from '../Styles/Components/CardRelatorio.module.css';
import IconeGrafico from './IconGrafico';

const CardRelatorio = ({ titulo, total, cor, itens, totalPecas }) => {
  return (
    <div className={styles.card} style={{ borderColor: cor }}>
      <div className={styles.header}>
        <h2 style={{ color: cor }}>{titulo}</h2>
        <span
          className={styles.totalBadge}
          style={{
            color: cor,
            backgroundColor: `${cor}1A`
          }}
        >
          {total}
        </span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.subTitulo}>Pedidos em atraso</h3>


        {itens.map((item, index) => (
          <div key={index} className={styles.row}>
            <span className={styles.label}>{item.label}</span>

            <div className={styles.barContainer}>
              {/* 1. O preenchimento colorido (a barra de progresso real) */}
              <div
                className={styles.bar}
                style={{
                  width: `${item.percentual}%`,
                  backgroundColor: cor // Vermelho ou Verde
                }}
              ></div>

              {/* 2. O valor numérico FIXO na extremidade direita */}
              <span className={styles.value} style={{ color: cor }}>
                {item.valor}
              </span>
            </div>
          </div>
        ))}

        <div className={styles.footerRow}>
          <div className={styles.pecasInfo}>
            <IconeGrafico cor={cor} />
            <span className={styles.pecasLabel}>Peças com falta</span>
          </div>
          <span className={styles.pecasValue} style={{ color: cor }}>{totalPecas}</span>
        </div>
      </div>
    </div>
  );
};

export default CardRelatorio;