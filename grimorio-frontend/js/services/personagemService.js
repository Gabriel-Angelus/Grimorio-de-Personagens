import { api } from '../api.js';

export const personagemService = {
  listar: () => api.listarPersonagens(),
  buscar: (id) => api.buscarPersonagem(id),
  criar: (dados) => api.criarPersonagem(dados),
  atualizar: (id, dados) => api.atualizarPersonagem(id, dados),
  remover: (id) => api.removerPersonagem(id),
};
