import type { Atributos } from '../types/atributos.js';

export interface Personagem {
  id: number;
  nome: string;
  classe: string;
  raca: string;
  origem: string;
  nivel: number;
  atributos: Atributos;
  campanhaId: number | null;
  criadoEm: string;
}

let personagens: Personagem[] = [];
let nextId = 1;

export const personagemModel = {
  listarTodos(): Personagem[] {
    return personagens;
  },

  listarPorCampanha(campanhaId: number): Personagem[] {
    return personagens.filter((personagem) => personagem.campanhaId === campanhaId);
  },

  buscarPorId(id: number): Personagem | null {
    return personagens.find((personagem) => personagem.id === id) || null;
  },

  inserir(dados: Omit<Personagem, 'id' | 'criadoEm'>): Personagem {
    const novoPersonagem: Personagem = {
      id: nextId++,
      ...dados,
      criadoEm: new Date().toISOString(),
    };

    personagens.push(novoPersonagem);
    return novoPersonagem;
  },

  atualizar(id: number, dados: Partial<Omit<Personagem, 'id' | 'criadoEm'>>): Personagem | null {
    const index = personagens.findIndex((personagem) => personagem.id === id);
    if (index === -1) return null;

    const atributosAtualizados = dados.atributos
      ? { ...personagens[index].atributos, ...dados.atributos }
      : personagens[index].atributos;

    personagens[index] = {
      ...personagens[index],
      ...dados,
      atributos: atributosAtualizados,
      id,
    };

    return personagens[index];
  },

  remover(id: number): boolean {
    const tamanhoAntes = personagens.length;
    personagens = personagens.filter((personagem) => personagem.id !== id);
    return personagens.length < tamanhoAntes;
  },
};
