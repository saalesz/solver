import React, { useState, useEffect } from 'react';
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

  const [dadosIniciais, setDadosIniciais] = useState(estadoZerado);
  const [dadosFinais, setDadosFinais] = useState(estadoZerado);
  const [carregando, setCarregando] = useState(false);

  // --- 1. LÓGICA DE PERSISTÊNCIA E PASSAGEM DE TURNO ---
  useEffect(() => {
    const carregarDados = () => {
      const inicialSalvo = localStorage.getItem('dadosIniciaisSolver');
      const finalSalvo = localStorage.getItem('dadosFinaisSolver');
      const turnoSalvo = localStorage.getItem('ultimoTurnoRegistrado');
      const turnoAtual = getTurnoAtual().atual;

      // Se mudou o turno: O Fim do anterior vira o Início do atual
      if (turnoSalvo && turnoSalvo !== turnoAtual) {
        if (finalSalvo) {
          const dadosMigrados = JSON.parse(finalSalvo);
          setDadosIniciais(dadosMigrados);
          localStorage.setItem('dadosIniciaisSolver', finalSalvo);
        }
        // Limpa o final para o novo colaborador subir o dele
        setDadosFinais(estadoZerado);
        localStorage.removeItem('dadosFinaisSolver');
      } else {
        // Se ainda é o mesmo turno, carrega tudo do cache (Resolve o F5)
        if (inicialSalvo) setDadosIniciais(JSON.parse(inicialSalvo));
        if (finalSalvo) setDadosFinais(JSON.parse(finalSalvo));
      }

      localStorage.setItem('ultimoTurnoRegistrado', turnoAtual);
    };

    carregarDados();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCarregando(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/api/reports/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erro na resposta do servidor');

      const result = await response.json();
      const kpis = result.kpis;

      const novosDados = {
        // Total Geral (O número grande no topo do seu Dashboard)
        backlog: kpis.totalPedidos || 0,

        // Soma das peças faltantes (Garante que o card de peças saia do zero)
        pecasFalta: kpis.pecasComFalta || 0,

        lista: [
          {
            label: 'Em onda',
            valor: kpis.emOnda || 0,
            percentual: kpis.totalPedidos > 0 ? ((kpis.emOnda / kpis.totalPedidos) * 100).toFixed(1) : 0
          },
          {
            label: 'Separados',
            // Mapeia os pedidos já concluídos no fluxo de separação
            valor: kpis.separados || 0,
            percentual: kpis.totalPedidos > 0 ? ((kpis.separados / kpis.totalPedidos) * 100).toFixed(1) : 0
          },
          {
            label: 'Com falta',
            valor: kpis.comFalta || 0,
            percentual: kpis.totalPedidos > 0 ? ((kpis.comFalta / kpis.totalPedidos) * 100).toFixed(1) : 0
          },
          {
            label: 'Em Anomalia',
            // Agrupa 'Anomalia Sorter' + 'Aguardando Consolidação' para simplificar o Dashboard
            valor: kpis.emAnomalia || 0,
            percentual: kpis.totalPedidos > 0 ? ((kpis.emAnomalia / kpis.totalPedidos) * 100).toFixed(1) : 0
          },
        ]
      };

      // Automação de preenchimento:
      // Se o inicial for zero, preenche o início. Se já tiver valor, preenche o fim.
      if (dadosIniciais.backlog === 0) {
        setDadosIniciais(novosDados);
        localStorage.setItem('dadosIniciaisSolver', JSON.stringify(novosDados));
      } else {
        setDadosFinais(novosDados);
        localStorage.setItem('dadosFinaisSolver', JSON.stringify(novosDados));
      }

      alert("Arquivo processado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao processar arquivo.");
    } finally {
      setCarregando(false);
    }
  };

  const realizarPassagemDeTurno = (novoTurno) => {
    // 1. Buscamos o valor real que está no storage AGORA
    const finalNoStorage = localStorage.getItem('dadosFinaisSolver');

    if (finalNoStorage) {
      const dadosParaMigrar = JSON.parse(finalNoStorage);

      // 2. Se o cenário final tiver dados (backlog > 0), fazemos a migração
      if (dadosParaMigrar.backlog > 0) {
        setDadosIniciais(dadosParaMigrar);
        localStorage.setItem('dadosIniciaisSolver', finalNoStorage);

        // 3. Limpa o Final para o novo colaborador
        setDadosFinais(estadoZerado);
        localStorage.removeItem('dadosFinaisSolver');

        console.log(`Sucesso: Dados do turno anterior movidos para o início do ${novoTurno}`);
      }
    } else {
      // Se não tinha nada no final, apenas resetamos para começar o novo turno limpo
      setDadosIniciais(estadoZerado);
      setDadosFinais(estadoZerado);
      localStorage.removeItem('dadosIniciaisSolver');
      localStorage.removeItem('dadosFinaisSolver');
    }
  };

  return (
    <div className={styles.container}>
      <Header data={dataHoje}
        onTurnoChange={realizarPassagemDeTurno} />

      <section className={styles.pageTitleSection}>
        <h1 className={styles.pageTitle}>Relatório - Tratativas Solver</h1>
        <label htmlFor="file-upload" className={styles.uploadBox}>
          <img src={Arquivo} alt="" className={styles.uploadIcon} />
          <span className={styles.uploadText}>
            {carregando ? "Processando..." : "Anexe o arquivo retirado do BI"}
          </span>
          <input type="file" id="file-upload" className={styles.hiddenInput} onChange={handleFileUpload} accept=".xlsx, .xls" />
        </label>
      </section>

      <main className={styles.mainContent}>
        <section className={styles.cardsSection}>
          <CardRelatorio
            titulo="Cenário Inicial"
            total={(dadosIniciais.backlog || 0).toLocaleString('pt-BR')}
            cor="#B91C1C"
            itens={dadosIniciais.lista}
            totalPecas={(dadosIniciais.pecasFalta || 0).toLocaleString('pt-BR')}
          />

          <CardRelatorio
            titulo="Cenário Final"
            total={(dadosFinais.backlog || 0).toLocaleString('pt-BR')}
            cor="#007A5E"
            itens={dadosFinais.lista}
            totalPecas={(dadosFinais.pecasFalta || 0).toLocaleString('pt-BR')}
          />
        </section>

        <EvolucaoTurno dadosIniciais={dadosIniciais} dadosFinais={dadosFinais} cor="#B91C1C" />

        {/* Passamos o turno atual para o componente de observações para ele saber quem está escrevendo */}
        <ObservacoesTurno turno={infoTurno.atual} />
      </main>
    </div>
  );
};

export default Dashboard;