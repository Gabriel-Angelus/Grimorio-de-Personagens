export interface Campanha {
  id: number;
  nome: string;
  descricao: string | null;
  criadaEm: string;
}

let campanhas: Campanha[] = [];
let nextId = 1;

export const campanhaModel = {
  listarTodas(): Campanha[] {
    return campanhas;
  },

  buscarPorId(id: number): Campanha | null {
    return campanhas.find((campanha) => campanha.id === id) || null;
  },

  inserir(dados: Omit<Campanha, 'id' | 'criadaEm'>): Campanha {
    const novaCampanha: Campanha = {
      id: nextId++,
      ...dados,
      criadaEm: new Date().toISOString(),
    };

    campanhas.push(novaCampanha);
    return novaCampanha;
  },

  atualizar(id: number, dados: Partial<Omit<Campanha, 'id' | 'criadaEm'>>): Campanha | null {
    const index = campanhas.findIndex((campanha) => campanha.id === id);
    if (index === -1) return null;

    campanhas[index] = {
      ...campanhas[index],
      ...dados,
      id,
    };

    return campanhas[index];
  },

  remover(id: number): boolean {
    const tamanhoAntes = campanhas.length;
    campanhas = campanhas.filter((campanha) => campanha.id !== id);
    return campanhas.length < tamanhoAntes;
  },
};
