import { api } from '../api.js';

export const campanhaService = {
  listar: () => api.listarCampanhas(),
  criar: (dados) => api.criarCampanha(dados),
};
