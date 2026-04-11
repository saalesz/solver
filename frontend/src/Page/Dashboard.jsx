import React, { useState } from 'react';
import axios from 'axios';
import styles from '../Styles/Pages/Dashboard.module.css';
import Header from '../Components/Header';
import CardRelatorio from '../Components/CardRelatorio';
import EvolucaoTurno from '../Components/EvolucaoTurno';
import ObservacoesTurno from '../Components/ObservacoesTurno';
import Arquivo from "../Assets/Icons/Arquivo.svg";

const getTurnoAtual = () => {
  const agora = new Date();
  const tempoEmMinutos = agora.getHours() * 60 + agora.getMinutes();
  const limites = [6 * 60, 14 * 60 + 25, 22 * 60 + 50];

  if (tempoEmMinutos >= limites[0] && tempoEmMinutos < limites[1]) return { atual: "T1", proximo: "T2" };
  if (tempoEmMinutos >= limites[1] && tempoEmMinutos < limites[2]) return { atual: "T2", proximo: "T3" };
  return { atual: "T3", proximo: "T1" };
};

const Dashboard = () => {
  const infoTurno = getTurnoAtual();
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  // 1. OBJETO PADRÃO PARA INICIAR COM "0"
  const estadoZerado = {
    backlog: 0,
    pecasFalta: 0,
    lista: [
      { label: 'Em onda', valor: 0, percentual: 0 },
      { label: 'Separados', valor: 0, percentual: 0 },
      { label: 'Com falta', valor: 0, percentual: 0 },
      { label: 'Em Anomalia', valor: 0, percentual: 0 },
    ]
  };
  
  // 2. INICIALIZANDO OS ESTADOS COM O OBJETO PADRÃO
  const [dadosIniciais, setDadosIniciais] = useState(estadoZerado);
  const [dadosFinais, setDadosFinais] = useState(estadoZerado);
  const [carregando, setCarregando] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCarregando(true);
    const formData = new FormData();
    formData.append('report', file);

    try {
      const response = await axios.post('http://localhost:3001/api/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Se o backend retornar { inicial, final }
      if (response.data.inicial) setDadosIniciais(response.data.inicial);
      if (response.data.final) setDadosFinais(response.data.final);

    } catch (error) {
      console.error("Erro ao processar planilha:", error);
      alert("Erro ao ler o arquivo do BI. Verifique o formato e se o backend está rodando.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header
        turnoAtual={infoTurno.atual}
        proximoTurno={infoTurno.proximo}
        data={dataHoje}
      />

      <section className={styles.pageTitleSection}>
        <h1 className={styles.pageTitle}>Relatório - Tratativas Solver</h1>

        <label htmlFor="file-upload" className={styles.uploadBox}>
          <img src={Arquivo} alt="" className={styles.uploadIcon} />
          <span className={styles.uploadText}>
            {carregando ? "Processando..." : "Anexe o arquivo retirado do BI"}
          </span>
          <input
            type="file"
            id="file-upload"
            className={styles.hiddenInput}
            onChange={handleFileUpload}
            accept=".xlsx, .xls"
          />
        </label>
      </section>

      <main className={styles.mainContent}>
        <section className={styles.cardsSection}>
          <CardRelatorio
            titulo="Cenário Inicial"
            total={dadosIniciais.backlog.toLocaleString('pt-BR', { minimumFractionDigits: 3 }).replace(',', '.')}
            cor="#B91C1C"
            itens={dadosIniciais.lista}
            totalPecas={dadosIniciais.pecasFalta.toLocaleString('pt-BR', { minimumFractionDigits: 3 }).replace(',', '.')}
          />

          <CardRelatorio
            titulo="Cenário Final"
            total={dadosFinais.backlog.toLocaleString('pt-BR', { minimumFractionDigits: 3 }).replace(',', '.')}
            cor="#007A5E"
            itens={dadosFinais.lista}
            totalPecas={dadosFinais.pecasFalta.toLocaleString('pt-BR', { minimumFractionDigits: 3 }).replace(',', '.')}
          />
        </section>

        {/* AGORA A EVOLUÇÃO SEMPRE APARECE */}
        <EvolucaoTurno
          dadosIniciais={dadosIniciais}
          dadosFinais={dadosFinais}
          cor="#B91C1C"
        />

        <ObservacoesTurno />
      </main>
    </div>
  );
};

export default Dashboard;