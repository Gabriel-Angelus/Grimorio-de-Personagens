import { campanhaModel, type Campanha } from '../models/campanha.js';
import { personagemModel } from '../models/personagem.js';
import { HttpError } from '../types/httpError.js';

interface DadosCampanha {
  nome?: string;
  descricao?: string | null;
}

function normalizarDados(dados: DadosCampanha): Omit<Campanha, 'id' | 'criadaEm'> {
  const nome = dados.nome?.trim();
  if (!nome) {
    throw new HttpError('O campo "nome" e obrigatorio', 400);
  }

  return {
    nome,
    descricao: dados.descricao?.trim() || null,
  };
}

function normalizarAtualizacao(dados: DadosCampanha): Partial<Omit<Campanha, 'id' | 'criadaEm'>> {
  const atualizacao: Partial<Omit<Campanha, 'id' | 'criadaEm'>> = {};

  if (dados.nome !== undefined) {
    const nome = dados.nome.trim();
    if (!nome) {
      throw new HttpError('O campo "nome" nao pode ficar vazio', 400);
    }
    atualizacao.nome = nome;
  }

  if (dados.descricao !== undefined) {
    atualizacao.descricao = dados.descricao?.trim() || null;
  }

  return atualizacao;
}

export const campanhaService = {
  listarTodas(): Campanha[] {
    return campanhaModel.listarTodas();
  },

  buscarPorId(id: number): Campanha {
    const campanha = campanhaModel.buscarPorId(id);
    if (!campanha) {
      throw new HttpError('Campanha nao encontrada', 404);
    }

    return campanha;
  },

  criar(dados: DadosCampanha): Campanha {
    return campanhaModel.inserir(normalizarDados(dados));
  },

  atualizar(id: number, dados: DadosCampanha): Campanha {
    const campanhaAtual = campanhaModel.buscarPorId(id);
    if (!campanhaAtual) {
      throw new HttpError('Campanha nao encontrada', 404);
    }

    const campanha = campanhaModel.atualizar(id, normalizarAtualizacao(dados));
    if (!campanha) {
      throw new HttpError('Campanha nao encontrada', 404);
    }

    return campanha;
  },

  remover(id: number): void {
    const personagensDaCampanha = personagemModel.listarPorCampanha(id);
    if (personagensDaCampanha.length > 0) {
      throw new HttpError('Nao e possivel remover uma campanha com personagens vinculados', 409);
    }

    const removida = campanhaModel.remover(id);
    if (!removida) {
      throw new HttpError('Campanha nao encontrada', 404);
    }
  },
};
