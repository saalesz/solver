import React, { useState } from 'react';
import styles from '../Styles/Components/ObservacoesTurno.module.css';

const ObservacoesTurno = () => {
  // Estado para armazenar os textos de cada categoria
  const [notas, setNotas] = useState({
    sobras: "",
    avarias: "",
    packing: "",
    distribuicao: "",
    chamados: ""
  });

  // Função para atualizar o estado conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotas(prev => ({ ...prev, [name]: value }));
  };

  const handleInput = (e) => {
    const element = e.target;
    element.style.height = "auto"; // Reseta a altura para recalcular
    element.style.height = `${element.scrollHeight}px`; // Ajusta para a altura do conteúdo
  };

  const categorias = [
    { id: "sobras", label: "Sobras:", color: "#1A1A1A" },
    { id: "avarias", label: "Avarias:", color: "#1A1A1A" },
    { id: "packing", label: "Packing:", color: "#1A1A1A" },
    { id: "distribuicao", label: "Distribuição:", color: "#1A1A1A" },
    { id: "chamados", label: "Chamados:", color: "#B91C1C" }, // Vermelho como no print
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Observações para o próximo turno</h2>

      <div className={styles.listaObservacoes}>
        {categorias.map((cat) => (
          <div key={cat.id} className={styles.linha}>
            <div className={`${styles.badge} ${cat.id === 'chamados' ? styles.badgeChamados : ''}`}>
              <span style={{ color: cat.color }}>{cat.label}</span>
            </div>
            <textarea
              name={cat.id}
              className={styles.campoTexto}
              placeholder="Adcione informações relevantes para o próximo turno..."
              value={notas[cat.id]}
              onChange={(e) => {
                handleChange(e); // Sua função de salvar estado
                handleInput(e);  // Função de ajustar altura
              }}
              onInput={handleInput} // Garante o ajuste imediato
              rows="1"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObservacoesTurno;