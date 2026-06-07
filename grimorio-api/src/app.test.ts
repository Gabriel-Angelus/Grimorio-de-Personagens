import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import app from './app.js';

let server: Server;
let baseUrl: string;

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<{ status: number; body: T }> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const text = await response.text();
  const body = text ? (JSON.parse(text) as T) : (undefined as T);

  return {
    status: response.status,
    body,
  };
}

describe('Grimorio API', () => {
  before(async () => {
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        if (address && typeof address === 'object') {
          baseUrl = `http://127.0.0.1:${address.port}`;
        }
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  });

  it('executa o CRUD de campanhas e personagens', async () => {
    const campanha = await request<{ id: number; nome: string }>('/campanhas', {
      method: 'POST',
      body: JSON.stringify({
        nome: 'A Mina Perdida',
        descricao: 'Campanha inicial para personagens de nivel baixo.',
      }),
    });

    assert.equal(campanha.status, 201);
    assert.equal(campanha.body.nome, 'A Mina Perdida');

    const personagem = await request<{
      id: number;
      campanhaId: number;
      bonusProficiencia: { inteligencia: number; forca: number };
    }>('/personagens', {
      method: 'POST',
      body: JSON.stringify({
        nome: 'Arannis',
        classe: 'Mago',
        raca: 'Elfo',
        origem: 'Sabio',
        nivel: 1,
        campanhaId: campanha.body.id,
        atributos: {
          forca: 8,
          destreza: 14,
          constituicao: 12,
          inteligencia: 16,
          sabedoria: 13,
          carisma: 10,
        },
      }),
    });

    assert.equal(personagem.status, 201);
    assert.equal(personagem.body.campanhaId, campanha.body.id);
    assert.equal(personagem.body.bonusProficiencia.inteligencia, 3);
    assert.equal(personagem.body.bonusProficiencia.forca, -1);

    const personagens = await request<Array<{ id: number }>>('/personagens');
    assert.equal(personagens.status, 200);
    assert.equal(personagens.body.length, 1);

    const personagemAtualizado = await request<{ nivel: number }>(
      `/personagens/${personagem.body.id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ nivel: 2 }),
      },
    );

    assert.equal(personagemAtualizado.status, 200);
    assert.equal(personagemAtualizado.body.nivel, 2);

    const remocaoBloqueada = await request<{ error: string }>(
      `/campanhas/${campanha.body.id}`,
      {
        method: 'DELETE',
      },
    );

    assert.equal(remocaoBloqueada.status, 409);

    const personagemRemovido = await request<undefined>(
      `/personagens/${personagem.body.id}`,
      {
        method: 'DELETE',
      },
    );

    assert.equal(personagemRemovido.status, 204);

    const campanhaRemovida = await request<undefined>(`/campanhas/${campanha.body.id}`, {
      method: 'DELETE',
    });

    assert.equal(campanhaRemovida.status, 204);
  });

  it('valida os dados obrigatorios de personagem', async () => {
    const resposta = await request<{ error: string }>('/personagens', {
      method: 'POST',
      body: JSON.stringify({
        nome: '',
        classe: 'Mago',
        raca: 'Elfo',
        origem: 'Sabio',
        nivel: 0,
        atributos: {},
      }),
    });

    assert.equal(resposta.status, 400);
    assert.match(resposta.body.error, /nome/);
  });
});
