import React, { useState } from 'react';
import styles from '../Styles/Components/Header.module.css';


import Logo from '../Assets/Logos/logo.svg';
import Calendario from '../Assets/Icons/Calendario.svg';
import Arrow from '../Assets/Icons/Arrow.svg';
import ArrowSelect from '../Assets/Icons/ArrowSelect.svg';

const Header = ({ turnoAtualInicial, proximoTurnoInicial, data }) => {
  const [saindo, setSaindo] = useState(turnoAtualInicial || 'T1');
  const [entrando, setEntrando] = useState(proximoTurnoInicial || 'T2');

  const mapeamentoTurnos = {
    'T1': 'T2',
    'T2': 'T3',
    'T3': 'T1'
  };

  const handleSaindoChange = (e) => {
    const valor = e.target.value;
    setSaindo(valor);
    setEntrando(mapeamentoTurnos[valor]);
  };

  return (
    <header className={styles.header}>
      {/* 2. Centro (Logo conforme sua imagem) */}
      <div className={styles.logoContainer}>
        <img src={Logo} alt="Logo" />
      </div>

      {/* 3. Lado Direito (Data e Turno Inteligente) */}
      <div className={styles.infoContainer}>
        <div className={styles.dateGroup}>
          <img src={Calendario} alt="Ícone de calendário" className={styles.calendarIcon} />
          <span className={styles.dateText}>{data}</span>
        </div>

        <div className={styles.turnoGroup}>
          <div className={styles.selectWrapper}>
            <select value={saindo} onChange={handleSaindoChange} className={styles.customSelect}>
              <option value="T1">T1</option>
              <option value="T2">T2</option>
              <option value="T3">T3</option>
            </select>
            <img src={ArrowSelect} alt="" className={styles.customArrow} />
          </div>
          <img src={Arrow} alt="Seta" className={styles.arrowIcon} />
          <span className={styles.proximoDisplay}>{entrando}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;