import { campanhaModel } from '../models/campanha.js';
import { personagemModel, type Personagem } from '../models/personagem.js';
import type { Atributos, NomeAtributo } from '../types/atributos.js';
import { HttpError } from '../types/httpError.js';
import { calcularModificadores } from './modificadorService.js';

interface DadosPersonagem {
  nome?: string;
  classe?: string;
  raca?: string;
  origem?: string;
  descricao?: string | null;
  nivel?: number;
  atributos?: Partial<Atributos>;
  campanhaId?: number | null;
}

type PersonagemComBonus = Personagem & {
  bonusProficiencia: Atributos;
};

const NIVEL_MINIMO = 1;
const NIVEL_MAXIMO = 20;
const ATRIBUTO_MINIMO = 1;
const ATRIBUTO_MAXIMO = 20;
const nomesAtributos: NomeAtributo[] = [
  'forca',
  'destreza',
  'constituicao',
  'inteligencia',
  'sabedoria',
  'carisma',
];

function adicionarBonusProficiencia(personagem: Personagem): PersonagemComBonus {
  return {
    ...personagem,
    bonusProficiencia: calcularModificadores(personagem.atributos),
  };
}

function validarTexto(valor: string | undefined, campo: string): string {
  const texto = valor?.trim();
  if (!texto) {
    throw new HttpError(`O campo "${campo}" e obrigatorio`, 400);
  }

  return texto;
}

function normalizarTextoOpcional(valor: string | null | undefined): string | null {
  return valor?.trim() || null;
}

function validarNivel(nivel: number | undefined): number {
  const numero = Number(nivel);
  if (!Number.isInteger(numero) || numero < NIVEL_MINIMO || numero > NIVEL_MAXIMO) {
    throw new HttpError('O campo "nivel" deve ser um numero inteiro entre 1 e 20', 400);
  }

  return numero;
}

function validarAtributos(atributos: Partial<Atributos> | undefined): Atributos {
  if (!atributos) {
    throw new HttpError('O campo "atributos" e obrigatorio', 400);
  }

  const atributosValidados = {} as Atributos;

  for (const nomeAtributo of nomesAtributos) {
    const valor = Number(atributos[nomeAtributo]);
    if (!Number.isInteger(valor) || valor < ATRIBUTO_MINIMO || valor > ATRIBUTO_MAXIMO) {
      throw new HttpError(`O atributo "${nomeAtributo}" deve ser um numero inteiro entre 1 e 20`, 400);
    }

    atributosValidados[nomeAtributo] = valor;
  }

  return atributosValidados;
}

function validarCampanha(campanhaId: number | null | undefined): number | null {
  if (campanhaId === null || campanhaId === undefined || campanhaId === 0) {
    return null;
  }

  const id = Number(campanhaId);
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError('O campo "campanhaId" deve ser um id valido', 400);
  }

  const campanha = campanhaModel.buscarPorId(id);
  if (!campanha) {
    throw new HttpError('A campanha informada nao existe', 422);
  }

  return id;
}

function normalizarCriacao(dados: DadosPersonagem): Omit<Personagem, 'id' | 'criadoEm'> {
  return {
    nome: validarTexto(dados.nome, 'nome'),
    classe: validarTexto(dados.classe, 'classe'),
    raca: validarTexto(dados.raca, 'raca'),
    origem: validarTexto(dados.origem, 'origem'),
    descricao: normalizarTextoOpcional(dados.descricao),
    nivel: validarNivel(dados.nivel),
    atributos: validarAtributos(dados.atributos),
    campanhaId: validarCampanha(dados.campanhaId),
  };
}

function normalizarAtualizacao(personagemAtual: Personagem, dados: DadosPersonagem): Partial<Omit<Personagem, 'id' | 'criadoEm'>> {
  const atualizacao: Partial<Omit<Personagem, 'id' | 'criadoEm'>> = {};

  if (dados.nome !== undefined) atualizacao.nome = validarTexto(dados.nome, 'nome');
  if (dados.classe !== undefined) atualizacao.classe = validarTexto(dados.classe, 'classe');
  if (dados.raca !== undefined) atualizacao.raca = validarTexto(dados.raca, 'raca');
  if (dados.origem !== undefined) atualizacao.origem = validarTexto(dados.origem, 'origem');
  if (dados.descricao !== undefined) atualizacao.descricao = normalizarTextoOpcional(dados.descricao);
  if (dados.nivel !== undefined) atualizacao.nivel = validarNivel(dados.nivel);
  if (dados.campanhaId !== undefined) atualizacao.campanhaId = validarCampanha(dados.campanhaId);

  if (dados.atributos !== undefined) {
    atualizacao.atributos = validarAtributos({
      ...personagemAtual.atributos,
      ...dados.atributos,
    });
  }

  return atualizacao;
}

export const personagemService = {
  listarTodos(campanhaId?: string): PersonagemComBonus[] {
    if (campanhaId) {
      const id = Number(campanhaId);
      if (!Number.isInteger(id)) {
        throw new HttpError('O filtro "campanhaId" deve ser numerico', 400);
      }

      const personagens = personagemModel.listarPorCampanha(id);
      return personagens.map(adicionarBonusProficiencia);
    }

    const personagens = personagemModel.listarTodos();
    return personagens.map(adicionarBonusProficiencia);
  },

  buscarPorId(id: number): PersonagemComBonus {
    const personagem = personagemModel.buscarPorId(id);
    if (!personagem) {
      throw new HttpError('Personagem nao encontrado', 404);
    }

    return adicionarBonusProficiencia(personagem);
  },

  criar(dados: DadosPersonagem): PersonagemComBonus {
    const personagem = personagemModel.inserir(normalizarCriacao(dados));
    return adicionarBonusProficiencia(personagem);
  },

  atualizar(id: number, dados: DadosPersonagem): PersonagemComBonus {
    const personagemAtual = personagemModel.buscarPorId(id);
    if (!personagemAtual) {
      throw new HttpError('Personagem nao encontrado', 404);
    }

    const personagemAtualizado = personagemModel.atualizar(
      id,
      normalizarAtualizacao(personagemAtual, dados),
    );

    if (!personagemAtualizado) {
      throw new HttpError('Personagem nao encontrado', 404);
    }

    return adicionarBonusProficiencia(personagemAtualizado);
  },

  remover(id: number): void {
    const removido = personagemModel.remover(id);
    if (!removido) {
      throw new HttpError('Personagem nao encontrado', 404);
    }
  },
};
