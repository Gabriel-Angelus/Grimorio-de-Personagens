import { API_BASE_URL } from './config.js';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(body?.error || 'Não foi possível concluir a ação.');
  }

  return body;
}

export const api = {
  listarPersonagens: () => request('/personagens'),
  buscarPersonagem: (id) => request(`/personagens/${id}`),
  criarPersonagem: (data) => request('/personagens', { method: 'POST', body: JSON.stringify(data) }),
  atualizarPersonagem: (id, data) => request(`/personagens/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  removerPersonagem: (id) => request(`/personagens/${id}`, { method: 'DELETE' }),
  listarCampanhas: () => request('/campanhas'),
  criarCampanha: (data) => request('/campanhas', { method: 'POST', body: JSON.stringify(data) }),
};
