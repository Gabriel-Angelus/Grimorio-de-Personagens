import db from '../db.js';

export interface Campanha {
  id: number;
  nome: string;
  descricao: string | null;
  criadaEm: string;
}

export const campanhaModel = {
  listarTodas(): Campanha[] {
    const stmt = db.prepare('SELECT * FROM campanhas');
    return stmt.all() as Campanha[];
  },

  buscarPorId(id: number): Campanha | null {
    const stmt = db.prepare('SELECT * FROM campanhas WHERE id = ?');
    const result = stmt.get(id) as Campanha | undefined;
    return result || null;
  },

  inserir(dados: Omit<Campanha, 'id' | 'criadaEm'>): Campanha {
    const criadaEm = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO campanhas (nome, descricao, criadaEm) VALUES (?, ?, ?)');
    const info = stmt.run(dados.nome, dados.descricao || null, criadaEm);
    
    return {
      id: info.lastInsertRowid as number,
      nome: dados.nome,
      descricao: dados.descricao || null,
      criadaEm,
    };
  },

  atualizar(id: number, dados: Partial<Omit<Campanha, 'id' | 'criadaEm'>>): Campanha | null {
    const campanhaAtual = this.buscarPorId(id);
    if (!campanhaAtual) return null;

    const nome = dados.nome !== undefined ? dados.nome : campanhaAtual.nome;
    const descricao = dados.descricao !== undefined ? dados.descricao : campanhaAtual.descricao;

    const stmt = db.prepare('UPDATE campanhas SET nome = ?, descricao = ? WHERE id = ?');
    stmt.run(nome, descricao, id);

    return {
      ...campanhaAtual,
      nome,
      descricao: descricao || null,
    };
  },

  remover(id: number): boolean {
    const stmt = db.prepare('DELETE FROM campanhas WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  },
};
