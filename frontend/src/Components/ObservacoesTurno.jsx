import React, { useState, useEffect } from 'react';
import styles from '../Styles/Components/ObservacoesTurno.module.css';

const ObservacoesTurno = () => {
  const [obs, setObs] = useState({
    sobras: "",
    avarias: "",
    packing: "",
    distribuicao: "",
    chamados: ""
  });

  useEffect(() => {
    const salvas = localStorage.getItem('observacoesSolverCategorias');
    if (salvas) {
      setObs(JSON.parse(salvas));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const novasObs = { ...obs, [name]: value };
    setObs(novasObs);
    localStorage.setItem('observacoesSolverCategorias', JSON.stringify(novasObs));
  };

  // Função para ajustar a altura do textarea automaticamente
  const handleInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const categorias = [
    { id: 'sobras', label: 'Sobras:', cor: '#E2E8F0' },
    { id: 'avarias', label: 'Avarias:', cor: '#E2E8F0' },
    { id: 'packing', label: 'Packing:', cor: '#E2E8F0' },
    { id: 'distribuicao', label: 'Distribuição:', cor: '#E2E8F0' },
    { id: 'chamados', label: 'Chamados:', cor: '#FEE2E2', labelCor: '#B91C1C' },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Observações para o próximo turno</h2>

      <div className={styles.listaObservacoes}>
        {categorias.map((cat) => (
          <div key={cat.id} className={styles.linha}>
            <div className={`${styles.badge} ${cat.id === 'chamados' ? styles.badgeChamados : ''}`}>
              <span style={{ color: cat.labelCor }}>{cat.label}</span>
            </div>
            <textarea
              name={cat.id}
              className={styles.campoTexto}
              placeholder="Adicione informações relevantes para o próximo turno..."
              value={obs[cat.id]} // Corrigido de 'notas' para 'obs'
              onChange={handleChange}
              onInput={handleInput} 
              rows="1"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObservacoesTurno;