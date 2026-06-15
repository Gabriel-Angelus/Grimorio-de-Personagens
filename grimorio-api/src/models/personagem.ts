import db from '../db.js';
import type { Atributos } from '../types/atributos.js';

export interface Personagem {
  id: number;
  nome: string;
  classe: string;
  raca: string;
  origem: string;
  descricao?: string | null;
  nivel: number;
  atributos: Atributos;
  campanhaId: number | null;
  criadoEm: string;
}

type DadosPersonagem = Omit<Personagem, 'id' | 'criadoEm'>;

interface PersonagemRow {
  id: number;
  nome: string;
  classe: string;
  raca: string;
  origem: string;
  descricao: string | null;
  nivel: number;
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  sabedoria: number;
  carisma: number;
  campanhaId: number | null;
  criadoEm: string;
}

function normalizarDescricao(descricao: string | null | undefined): string | null {
  return descricao || null;
}

function normalizarCampanhaId(campanhaId: number | null | undefined): number | null {
  return campanhaId || null;
}

function mapRowToPersonagem(row: PersonagemRow): Personagem {
  return {
    id: row.id,
    nome: row.nome,
    classe: row.classe,
    raca: row.raca,
    origem: row.origem,
    descricao: normalizarDescricao(row.descricao),
    nivel: row.nivel,
    atributos: {
      forca: row.forca,
      destreza: row.destreza,
      constituicao: row.constituicao,
      inteligencia: row.inteligencia,
      sabedoria: row.sabedoria,
      carisma: row.carisma,
    },
    campanhaId: row.campanhaId,
    criadoEm: row.criadoEm,
  };
}

export const personagemModel = {
  listarTodos(): Personagem[] {
    const rows = db.prepare('SELECT * FROM personagens').all() as PersonagemRow[];
    return rows.map(mapRowToPersonagem);
  },

  listarPorCampanha(campanhaId: number): Personagem[] {
    const rows = db
      .prepare('SELECT * FROM personagens WHERE campanhaId = ?')
      .all(campanhaId) as PersonagemRow[];
    return rows.map(mapRowToPersonagem);
  },

  buscarPorId(id: number): Personagem | null {
    const row = db.prepare('SELECT * FROM personagens WHERE id = ?').get(id) as
      | PersonagemRow
      | undefined;
    return row ? mapRowToPersonagem(row) : null;
  },

  inserir(dados: DadosPersonagem): Personagem {
    const criadoEm = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO personagens (
        nome, classe, raca, origem, descricao, nivel,
        forca, destreza, constituicao, inteligencia, sabedoria, carisma,
        campanhaId, criadoEm
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      dados.nome,
      dados.classe,
      dados.raca,
      dados.origem,
      normalizarDescricao(dados.descricao),
      dados.nivel,
      dados.atributos.forca,
      dados.atributos.destreza,
      dados.atributos.constituicao,
      dados.atributos.inteligencia,
      dados.atributos.sabedoria,
      dados.atributos.carisma,
      normalizarCampanhaId(dados.campanhaId),
      criadoEm,
    );

    return {
      id: info.lastInsertRowid as number,
      ...dados,
      descricao: normalizarDescricao(dados.descricao),
      criadoEm,
    };
  },

  atualizar(id: number, dados: Partial<DadosPersonagem>): Personagem | null {
    const personagemAtual = this.buscarPorId(id);
    if (!personagemAtual) return null;

    const nome = dados.nome !== undefined ? dados.nome : personagemAtual.nome;
    const classe = dados.classe !== undefined ? dados.classe : personagemAtual.classe;
    const raca = dados.raca !== undefined ? dados.raca : personagemAtual.raca;
    const origem = dados.origem !== undefined ? dados.origem : personagemAtual.origem;
    const descricao = dados.descricao !== undefined ? dados.descricao : personagemAtual.descricao;
    const nivel = dados.nivel !== undefined ? dados.nivel : personagemAtual.nivel;
    const campanhaId = dados.campanhaId !== undefined ? dados.campanhaId : personagemAtual.campanhaId;
    const atributos = {
      ...personagemAtual.atributos,
      ...dados.atributos,
    };

    db.prepare(`
      UPDATE personagens SET
        nome = ?, classe = ?, raca = ?, origem = ?, descricao = ?, nivel = ?,
        forca = ?, destreza = ?, constituicao = ?, inteligencia = ?, sabedoria = ?, carisma = ?,
        campanhaId = ?
      WHERE id = ?
    `).run(
      nome,
      classe,
      raca,
      origem,
      normalizarDescricao(descricao),
      nivel,
      atributos.forca,
      atributos.destreza,
      atributos.constituicao,
      atributos.inteligencia,
      atributos.sabedoria,
      atributos.carisma,
      normalizarCampanhaId(campanhaId),
      id,
    );

    return {
      ...personagemAtual,
      nome,
      classe,
      raca,
      origem,
      descricao: normalizarDescricao(descricao),
      nivel,
      atributos,
      campanhaId,
    };
  },

  remover(id: number): boolean {
    const info = db.prepare('DELETE FROM personagens WHERE id = ?').run(id);
    return info.changes > 0;
  },
};
