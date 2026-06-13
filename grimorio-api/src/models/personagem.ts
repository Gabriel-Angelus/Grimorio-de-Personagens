import db from '../db.js';
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

// Helper para converter o row do banco de volta para a interface original
function mapRowToPersonagem(row: any): Personagem {
  return {
    id: row.id,
    nome: row.nome,
    classe: row.classe,
    raca: row.raca,
    origem: row.origem,
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
    const stmt = db.prepare('SELECT * FROM personagens');
    const rows = stmt.all();
    return rows.map(mapRowToPersonagem);
  },

  listarPorCampanha(campanhaId: number): Personagem[] {
    const stmt = db.prepare('SELECT * FROM personagens WHERE campanhaId = ?');
    const rows = stmt.all(campanhaId);
    return rows.map(mapRowToPersonagem);
  },

  buscarPorId(id: number): Personagem | null {
    const stmt = db.prepare('SELECT * FROM personagens WHERE id = ?');
    const row = stmt.get(id);
    return row ? mapRowToPersonagem(row) : null;
  },

  inserir(dados: Omit<Personagem, 'id' | 'criadoEm'>): Personagem {
    const criadoEm = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO personagens (
        nome, classe, raca, origem, nivel,
        forca, destreza, constituicao, inteligencia, sabedoria, carisma,
        campanhaId, criadoEm
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      dados.nome, dados.classe, dados.raca, dados.origem, dados.nivel,
      dados.atributos.forca, dados.atributos.destreza, dados.atributos.constituicao,
      dados.atributos.inteligencia, dados.atributos.sabedoria, dados.atributos.carisma,
      dados.campanhaId || null, criadoEm
    );

    return {
      id: info.lastInsertRowid as number,
      ...dados,
      criadoEm,
    };
  },

  atualizar(id: number, dados: Partial<Omit<Personagem, 'id' | 'criadoEm'>>): Personagem | null {
    const personagemAtual = this.buscarPorId(id);
    if (!personagemAtual) return null;

    const nome = dados.nome !== undefined ? dados.nome : personagemAtual.nome;
    const classe = dados.classe !== undefined ? dados.classe : personagemAtual.classe;
    const raca = dados.raca !== undefined ? dados.raca : personagemAtual.raca;
    const origem = dados.origem !== undefined ? dados.origem : personagemAtual.origem;
    const nivel = dados.nivel !== undefined ? dados.nivel : personagemAtual.nivel;
    const campanhaId = dados.campanhaId !== undefined ? dados.campanhaId : personagemAtual.campanhaId;

    const atributos = {
      ...personagemAtual.atributos,
      ...dados.atributos,
    };

    const stmt = db.prepare(`
      UPDATE personagens SET
        nome = ?, classe = ?, raca = ?, origem = ?, nivel = ?,
        forca = ?, destreza = ?, constituicao = ?, inteligencia = ?, sabedoria = ?, carisma = ?,
        campanhaId = ?
      WHERE id = ?
    `);

    stmt.run(
      nome, classe, raca, origem, nivel,
      atributos.forca, atributos.destreza, atributos.constituicao,
      atributos.inteligencia, atributos.sabedoria, atributos.carisma,
      campanhaId || null, id
    );

    return {
      ...personagemAtual,
      nome, classe, raca, origem, nivel,
      atributos,
      campanhaId,
    };
  },

  remover(id: number): boolean {
    const stmt = db.prepare('DELETE FROM personagens WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  },
};
