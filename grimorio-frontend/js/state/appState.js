import { ATRIBUTOS_POR_CLASSE } from '../config.js';

export const state = {
  tela: 'lista',
  carregando: true,
  mensagem: '',
  erro: '',
  personagens: [],
  campanhas: [],
  personagemSelecionado: null,
  personagemEditando: null,
  personagemParaRemover: null,
  filtros: {
    busca: '',
    classe: 'Todas',
    raca: 'Todas',
    origem: 'Todas',
    ordenacao: 'nome-asc',
  },
};

export function modificador(valor) {
  return Math.floor((Number(valor) - 10) / 2);
}

export function bonus(valor) {
  const mod = modificador(valor);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function atributosPadrao(classe = 'Guerreiro') {
  return { ...ATRIBUTOS_POR_CLASSE[classe] };
}

export function personagensFiltrados() {
  const busca = state.filtros.busca.toLowerCase().trim();

  return [...state.personagens]
    .filter((personagem) => {
      const nomeOk = !busca || personagem.nome.toLowerCase().startsWith(busca);
      const classeOk = state.filtros.classe === 'Todas' || personagem.classe === state.filtros.classe;
      const racaOk = state.filtros.raca === 'Todas' || personagem.raca === state.filtros.raca;
      const origemOk = state.filtros.origem === 'Todas' || personagem.origem === state.filtros.origem;
      return nomeOk && classeOk && racaOk && origemOk;
    })
    .sort((a, b) => {
      if (state.filtros.ordenacao === 'nome-desc') return b.nome.localeCompare(a.nome);
      if (state.filtros.ordenacao === 'nivel-desc') return b.nivel - a.nivel;
      if (state.filtros.ordenacao === 'nivel-asc') return a.nivel - b.nivel;
      if (state.filtros.ordenacao === 'recentes') return Date.parse(b.criadoEm) - Date.parse(a.criadoEm);
      if (state.filtros.ordenacao === 'antigos') return Date.parse(a.criadoEm) - Date.parse(b.criadoEm);
      return a.nome.localeCompare(b.nome);
    });
}
