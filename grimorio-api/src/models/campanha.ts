import db from '../db.js';

export interface Campanha {
  id: number;
  nome: string;
  descricao: string | null;
  criadaEm: string;
}

type DadosCampanha = Omit<Campanha, 'id' | 'criadaEm'>;

function normalizarDescricao(descricao: string | null | undefined): string | null {
  return descricao || null;
}

export const campanhaModel = {
  listarTodas(): Campanha[] {
    return db.prepare('SELECT * FROM campanhas').all() as Campanha[];
  },

  buscarPorId(id: number): Campanha | null {
    const campanha = db.prepare('SELECT * FROM campanhas WHERE id = ?').get(id) as
      | Campanha
      | undefined;
    return campanha || null;
  },

  inserir(dados: DadosCampanha): Campanha {
    const criadaEm = new Date().toISOString();
    const descricao = normalizarDescricao(dados.descricao);
    const info = db
      .prepare('INSERT INTO campanhas (nome, descricao, criadaEm) VALUES (?, ?, ?)')
      .run(dados.nome, descricao, criadaEm);

    return {
      id: info.lastInsertRowid as number,
      nome: dados.nome,
      descricao,
      criadaEm,
    };
  },

  atualizar(id: number, dados: Partial<DadosCampanha>): Campanha | null {
    const campanhaAtual = this.buscarPorId(id);
    if (!campanhaAtual) return null;

    const nome = dados.nome !== undefined ? dados.nome : campanhaAtual.nome;
    const descricao = dados.descricao !== undefined ? dados.descricao : campanhaAtual.descricao;
    const descricaoNormalizada = normalizarDescricao(descricao);

    db.prepare('UPDATE campanhas SET nome = ?, descricao = ? WHERE id = ?').run(
      nome,
      descricaoNormalizada,
      id,
    );

    return {
      ...campanhaAtual,
      nome,
      descricao: descricaoNormalizada,
    };
  },

  remover(id: number): boolean {
    const info = db.prepare('DELETE FROM campanhas WHERE id = ?').run(id);
    return info.changes > 0;
  },
};
