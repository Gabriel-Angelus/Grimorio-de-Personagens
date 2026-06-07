import { ATRIBUTOS, ATRIBUTOS_POR_CLASSE } from './config.js';
import { campanhaService } from './services/campanhaService.js';
import { personagemService } from './services/personagemService.js';
import { atributosPadrao, state } from './state/appState.js';
import { render } from './ui/personagemView.js';

const demos = [
  {
    nome: 'Lyra das Sombras',
    classe: 'Ladino',
    raca: 'Humano',
    origem: 'Orfao',
    nivel: 4,
    campanhaId: null,
    atributos: { forca: 11, destreza: 18, constituicao: 13, inteligencia: 13, sabedoria: 11, carisma: 14 },
  },
  {
    nome: 'Thorgrim Punho-de-Ferro',
    classe: 'Guerreiro',
    raca: 'Anao',
    origem: 'Soldado',
    nivel: 6,
    campanhaId: null,
    atributos: { forca: 18, destreza: 12, constituicao: 16, inteligencia: 8, sabedoria: 12, carisma: 9 },
  },
  {
    nome: 'Valerius de Lothlórien',
    classe: 'Mago',
    raca: 'Elfo',
    origem: 'Nobre',
    nivel: 5,
    campanhaId: null,
    atributos: { forca: 8, destreza: 15, constituicao: 12, inteligencia: 18, sabedoria: 14, carisma: 11 },
  },
];

function baseRascunho(classe = 'Guerreiro') {
  return {
    id: 0,
    nome: '',
    classe,
    raca: 'Humano',
    origem: 'Academico',
    nivel: 1,
    campanhaId: state.campanhas[0]?.id || null,
    atributos: atributosPadrao(classe),
    criadoEm: new Date().toISOString(),
  };
}

function avisos() {
  state.mensagem = '';
  state.erro = '';
}

async function carregar(seed = true) {
  try {
    state.carregando = true;
    desenhar();
    state.campanhas = await campanhaService.listar();
    state.personagens = await personagemService.listar();

    if (seed && state.campanhas.length === 0 && state.personagens.length === 0) {
      const campanha = await campanhaService.criar({
        nome: 'Crônicas da Costa da Espada',
        descricao: 'Campanha inicial do Grimório RPG.',
      });

      for (const personagem of demos) {
        await personagemService.criar({ ...personagem, campanhaId: campanha.id });
      }

      await carregar(false);
      return;
    }
  } catch (error) {
    state.erro = error.message || 'Não foi possível conectar à API.';
  } finally {
    state.carregando = false;
    desenhar();
  }
}

function lerFicha(form) {
  const dados = new FormData(form);
  const atributos = {};

  ATRIBUTOS.forEach(([chave]) => {
    atributos[chave] = Number(dados.get(chave));
  });

  return {
    nome: String(dados.get('nome')).trim(),
    classe: String(dados.get('classe')),
    raca: String(dados.get('raca')),
    origem: String(dados.get('origem')),
    nivel: Number(dados.get('nivel')),
    campanhaId: dados.get('campanhaId') ? Number(dados.get('campanhaId')) : null,
    atributos,
  };
}

function preservarRascunho(form, atributos) {
  const dados = new FormData(form);
  return {
    ...(state.personagemEditando || baseRascunho(String(dados.get('classe') || 'Guerreiro'))),
    nome: String(dados.get('nome') || ''),
    classe: String(dados.get('classe') || 'Guerreiro'),
    raca: String(dados.get('raca') || 'Humano'),
    origem: String(dados.get('origem') || 'Academico'),
    nivel: Number(dados.get('nivel') || 1),
    campanhaId: dados.get('campanhaId') ? Number(dados.get('campanhaId')) : null,
    atributos,
  };
}

function desenhar() {
  render({
    novo() {
      avisos();
      state.personagemEditando = baseRascunho();
      state.tela = 'formulario';
      desenhar();
    },
    cancelar() {
      avisos();
      state.tela = 'lista';
      state.personagemEditando = null;
      desenhar();
    },
    async salvar(event) {
      event.preventDefault();
      try {
        avisos();
        const dados = lerFicha(event.currentTarget);
        if (state.personagemEditando?.id) {
          await personagemService.atualizar(state.personagemEditando.id, dados);
          state.mensagem = 'Ficha reescrita no grimório.';
        } else {
          await personagemService.criar(dados);
          state.mensagem = 'Nova lenda registrada no grimório.';
        }
        state.tela = 'lista';
        state.personagemEditando = null;
        await carregar(false);
      } catch (error) {
        state.erro = error.message || 'Não foi possível gravar a ficha.';
        desenhar();
      }
    },
    filtrar(event) {
      const campo = event.currentTarget.dataset.filter;
      state.filtros[campo] = event.currentTarget.value;
      desenhar();
    },
    trocarClasse(event) {
      const classe = event.currentTarget.value;
      state.personagemEditando = preservarRascunho(event.currentTarget.form, {
        ...ATRIBUTOS_POR_CLASSE[classe],
      });
      state.personagemEditando.classe = classe;
      desenhar();
    },
    ajustarAtributo(event) {
      const chave = event.currentTarget.dataset.attr;
      const delta = event.currentTarget.dataset.action === 'attr-plus' ? 1 : -1;
      const form = event.currentTarget.form;
      const atual = preservarRascunho(form, lerFicha(form).atributos);
      state.personagemEditando = {
        ...atual,
        atributos: {
          ...atual.atributos,
          [chave]: Math.min(20, Math.max(1, atual.atributos[chave] + delta)),
        },
      };
      desenhar();
    },
    async detalhes(personagem) {
      avisos();
      state.personagemSelecionado = await personagemService.buscar(personagem.id);
      desenhar();
    },
    fecharDetalhe() {
      state.personagemSelecionado = null;
      desenhar();
    },
    editarDetalhe() {
      avisos();
      state.personagemEditando = state.personagemSelecionado;
      state.personagemSelecionado = null;
      state.tela = 'formulario';
      desenhar();
    },
    async remover(personagem) {
      const ok = window.confirm(`Tem certeza de que deseja banir "${personagem.nome}" do Grimório?\n\nEste aventureiro será removido permanentemente das crônicas.`);
      if (!ok) return;
      try {
        avisos();
        await personagemService.remover(personagem.id);
        state.mensagem = 'Ficha removida do grimório.';
        await carregar(false);
      } catch (error) {
        state.erro = error.message || 'Não foi possível remover a ficha.';
        desenhar();
      }
    },
  });
}

carregar();
