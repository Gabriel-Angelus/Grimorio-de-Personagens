import { ATRIBUTOS, CLASSES_RPG, ORIGENS, RACAS } from '../config.js';
import { atributosPadrao, bonus, personagensFiltrados, state } from '../state/appState.js';
import { opcoesCampanhas } from './campanhaView.js';

const icones = {
  Guerreiro: '⚔️',
  Mago: '🧙',
  Ladino: '🗡️',
  Clerigo: '🛡️',
  Bardo: '📜',
  Arqueiro: '🏹',
};

const descricoesPorOrigem = {
  Academico: 'Passou anos enfurnado em bibliotecas poeirentas, buscando decifrar enigmas esquecidos.',
  Nobre: 'Cresceu em cortes luxuosas, mas decidiu trocar as intrigas palacianas pelos perigos do mundo.',
  Campones: 'Trabalhava de sol a sol nas colheitas até que um evento marcante mudou seu destino para sempre.',
  Mercenario: 'Sua lealdade tem um preço, vendendo suas habilidades para quem puder pagar mais moedas de ouro.',
  Soldado: 'Sobreviveu a batalhas sangrentas, onde aprendeu que a disciplina e o treinamento são as verdadeiras armas.',
  Orfao: 'Criado nas ruas frias e vielas escuras, aprendeu sozinho a sobreviver em um mundo cruel.',
};

const descricoesPorClasse = {
  Guerreiro: 'Agora empunha sua arma com maestria na linha de frente.',
  Mago: 'Sua conexão com as energias arcanas permite manipular a própria realidade.',
  Ladino: 'Movendo-se em silêncio, confia em seus reflexos rápidos e lâminas ocultas.',
  Clerigo: 'Canaliza o poder de sua fé para curar aliados e punir a escuridão.',
  Bardo: 'Suas histórias e canções inspiram coragem onde só havia desespero.',
  Arqueiro: 'Com olhos de águia, abate seus inimigos muito antes que eles percebam o perigo.',
};

const caracteristicasPorOrigem = {
  Academico: 'Sempre com a mente nos livros, busca os conhecimentos antigos e os feitiços perdidos no tempo.',
  Nobre: 'Porta o brasão de sua família com o peso e a autoridade que o sangue exige.',
  Campones: 'Costumava arar as terras antes que uma jornada inusitada o empurrasse para os braços da aventura.',
  Mercenario: 'Sobrevive de contratos, onde sua lâmina corta fielmente a quem estiver pagando o ouro.',
  Soldado: 'Veterano endurecido pelas marchas militares, cuja disciplina moldou sua força.',
  Orfao: 'Sem berço ou nome herdado, aprendeu tudo sobre astúcia se esgueirando pelas sarjetas.',
};

function escapeHtml(valor = '') {
  return String(valor).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[char]);
}

function getDescricao(personagem) {
  if (personagem.descricao) {
    return personagem.descricao;
  }
  
  const { classe, origem } = personagem;
  const baseOrigem = descricoesPorOrigem[origem] || 'Aventureiro registrado nas crônicas do Grimório.';
  const baseClasse = descricoesPorClasse[classe] || 'Pronto para uma nova jornada heroica.';
  
  return `${baseOrigem} ${baseClasse}`;
}

function resumo(personagem, truncate = false) {
  const texto = getDescricao(personagem);
  return truncate && texto.length > 116 ? `${texto.slice(0, 116).trim()}...` : texto;
}

function header() {
  return `
    <header class="topbar">
      <div class="container-xl topbar-inner">
        <h1><span>📜</span> Grimório RPG</h1>
      </div>
    </header>
  `;
}

function selectFiltro(nome, titulo, opcoes, selecionado) {
  return `
    <label class="filter-field">
      <span>${titulo}</span>
      <select class="form-select grim-input" data-filter="${nome}">
        ${opcoes.map((opcao) => `<option value="${opcao}" ${opcao === selecionado ? 'selected' : ''}>${opcao}</option>`).join('')}
      </select>
    </label>
  `;
}

function filtros() {
  return `
    <section class="panel filters">
      <label class="filter-field search-field">
        <span>Pesquisar por nome</span>
        <div class="search-box">
          <b>⌕</b>
          <input class="form-control grim-input" data-filter="busca" value="${escapeHtml(state.filtros.busca)}" placeholder="Insira o nome do personagem..." />
        </div>
      </label>
      ${selectFiltro('classe', 'Classe', ['Todas', ...CLASSES_RPG.map((classe) => classe.valor)], state.filtros.classe)}
      ${selectFiltro('raca', 'Raça', ['Todas', ...RACAS], state.filtros.raca)}
      ${selectFiltro('origem', 'Origem', ['Todas', ...ORIGENS], state.filtros.origem)}
      <label class="filter-field">
        <span>Ordenar por</span>
        <select class="form-select grim-input" data-filter="ordenacao">
          <option value="nome-asc" ${state.filtros.ordenacao === 'nome-asc' ? 'selected' : ''}>Nome (A - Z)</option>
          <option value="nome-desc" ${state.filtros.ordenacao === 'nome-desc' ? 'selected' : ''}>Nome (Z - A)</option>
          <option value="nivel-desc" ${state.filtros.ordenacao === 'nivel-desc' ? 'selected' : ''}>Nível (Maior primeiro)</option>
          <option value="nivel-asc" ${state.filtros.ordenacao === 'nivel-asc' ? 'selected' : ''}>Nível (Menor primeiro)</option>
          <option value="recentes" ${state.filtros.ordenacao === 'recentes' ? 'selected' : ''}>Mais recentes</option>
          <option value="antigos" ${state.filtros.ordenacao === 'antigos' ? 'selected' : ''}>Mais antigos</option>
        </select>
      </label>
    </section>
  `;
}

function avatar(personagem) {
  return `<div class="avatar ${personagem.classe.toLowerCase()}">${icones[personagem.classe] || '✦'}</div>`;
}

function attrMini(personagem, chave, sigla) {
  return `
    <div>
      <small>${sigla}</small>
      <strong>${personagem.atributos[chave]} <em>${bonus(personagem.atributos[chave])}</em></strong>
    </div>
  `;
}

function card(personagem) {
  return `
    <article class="character-card" data-id="${personagem.id}">
      <i></i>
      <header>
        <h2 title="${escapeHtml(personagem.nome)}">${escapeHtml(personagem.nome)}</h2>
        <span>${personagem.nivel}</span>
      </header>
      <div class="card-body-custom">
        ${avatar(personagem)}
        <div class="tags">
          <span class="tag primary">${icones[personagem.classe] || '✦'} ${escapeHtml(personagem.classe)}</span>
          <span class="tag">${escapeHtml(personagem.raca)}</span>
        </div>
        <p>${escapeHtml(resumo(personagem, true))}</p>
        <div class="mini-attrs">
          ${attrMini(personagem, 'forca', 'FOR')}
          ${attrMini(personagem, 'destreza', 'DES')}
          ${attrMini(personagem, 'inteligencia', 'INT')}
        </div>
      </div>
      <footer>
        <button class="icon-btn" data-action="detalhes" title="Abrir ficha">📜</button>
        <button class="icon-btn danger" data-action="remover" title="Banir do grimório">☠</button>
      </footer>
    </article>
  `;
}

function lista() {
  const personagens = personagensFiltrados();
  return `
    <div class="new-legend-row">
      <button class="btn btn-gold" data-action="novo">🪶 Registrar Nova Lenda</button>
    </div>
    ${filtros()}
    <section class="characters-grid">
      ${personagens.length ? personagens.map(card).join('') : '<p class="empty">Nenhuma ficha encontrada nas crônicas.</p>'}
    </section>
  `;
}

function attrForm(chave, nome, descricao) {
  const base = state.personagemEditando?.atributos || atributosPadrao();
  const valor = base[chave];
  return `
    <div class="attr-control">
      <div>
        <strong>${nome}</strong>
        <small>${descricao}</small>
      </div>
      <div class="stepper">
        <button type="button" data-action="attr-minus" data-attr="${chave}">-</button>
        <input type="hidden" name="${chave}" value="${valor}" />
        <span>${valor}</span>
        <button type="button" data-action="attr-plus" data-attr="${chave}">+</button>
        <em>${bonus(valor)}</em>
      </div>
    </div>
  `;
}

function formulario() {
  const p = state.personagemEditando;
  const editando = Boolean(p && p.id);
  return `
    <section class="form-wrap">
      <div class="form-title">
        <h2>🪶 ${editando ? 'Reescrever Destino' : 'Registrar Nova Lenda'}</h2>
        <p>${editando ? 'Modifique os atributos e a história de sua lenda no grimório.' : 'Escreva um novo herói nas crônicas arcanas preenchendo a ficha.'}</p>
      </div>
      <form class="panel sheet-form" id="character-form">
        <div class="form-grid">
          <label class="field wide">
            <span>Nome do personagem</span>
            <input class="form-control grim-input" name="nome" required value="${escapeHtml(p?.nome)}" placeholder="Ex: Eldrin Folha-de-Prata" />
          </label>
          <label class="field">
            <span>Nível (1 - 20)</span>
            <input class="form-control grim-input" name="nivel" type="number" min="1" max="20" required value="${p?.nivel || 1}" />
          </label>
          <label class="field">
            <span>Classe / Vocação</span>
            <select class="form-select grim-input" name="classe" id="classe-form">
              ${CLASSES_RPG.map((classe) => `<option value="${classe.valor}" ${classe.valor === (p?.classe || 'Guerreiro') ? 'selected' : ''}>${classe.rotulo}</option>`).join('')}
            </select>
          </label>
          <label class="field">
            <span>Raça</span>
            <select class="form-select grim-input" name="raca">
              ${RACAS.map((raca) => `<option value="${raca}" ${raca === (p?.raca || 'Humano') ? 'selected' : ''}>${raca}</option>`).join('')}
            </select>
          </label>
          <label class="field">
            <span>Origem</span>
            <select class="form-select grim-input" name="origem">
              ${ORIGENS.map((origem) => `<option value="${origem}" ${origem === (p?.origem || 'Academico') ? 'selected' : ''}>${origem}</option>`).join('')}
            </select>
          </label>
          <label class="field full">
            <span>História & descrição física</span>
            <textarea class="form-control grim-input" name="descricao" rows="4" placeholder="Escreva a biografia do herói, suas motivações, cicatrizes e aparência...">${escapeHtml(p?.descricao || '')}</textarea>
          </label>
          <label class="field full">
            <span>Campanha</span>
            <select class="form-select grim-input" name="campanhaId">${opcoesCampanhas(state.campanhas, p?.campanhaId)}</select>
          </label>
        </div>
        <hr />
        <h3>✺ Atributos Base</h3>
        <p class="support">Ajuste os atributos principais de seu herói. Ao alterar a classe acima, os atributos sugeridos serão aplicados automaticamente.</p>
        <div class="attrs-form">${ATRIBUTOS.map(([chave, nome, sigla, descricao]) => attrForm(chave, nome, descricao, sigla)).join('')}</div>
        <div class="form-actions">
          <button type="button" class="btn btn-outline-gold" data-action="cancelar">⊘ Cancelar</button>
          <button type="submit" class="btn btn-gold">📜 Gravar no Grimório</button>
        </div>
      </form>
    </section>
  `;
}

function detalhe() {
  const p = state.personagemSelecionado;
  if (!p) return '';

  return `
    <div class="sheet-modal">
      <article class="sheet-detail">
        <button class="close-btn" data-action="fechar">×</button>
        <h2>📜 Ficha de Personagem</h2>
        <div class="detail-grid">
          <aside>
            ${avatar(p)}
            <h3>${escapeHtml(p.nome)}</h3>
            <div class="tags">
              <span class="tag primary">${icones[p.classe] || '✦'} ${escapeHtml(p.classe)}</span>
              <span class="tag">${escapeHtml(p.raca)}</span>
              <span class="tag">${escapeHtml(p.origem)}</span>
            </div>
            <h4>🪶 Biografia & Descrição</h4>
            <p>${escapeHtml(resumo(p))}</p>
          </aside>
          <section>
            <h4>🛡️ Atributos Primários</h4>
            <div class="detail-attrs">
              ${ATRIBUTOS.map(([chave, nome, sigla]) => `
                <div>
                  <span>${nome}</span>
                  <strong>${p.atributos[chave]}</strong>
                  <em>${bonus(p.atributos[chave])}</em>
                  <small>${sigla}</small>
                </div>
              `).join('')}
            </div>
            <div class="features">
              <h4>📖 Características do Grimório</h4>
              <p><strong>Origem (${escapeHtml(p.origem)}):</strong> ${caracteristicasPorOrigem[p.origem] || 'ficha vinculada às crônicas da mesa.'}</p>
              <p><strong>Vocação (${escapeHtml(p.classe)}):</strong> nível ${p.nivel}, ${escapeHtml(p.raca)}.</p>
            </div>
          </section>
        </div>
        <footer>
          <span>▣ Registrado em: ${new Date(p.criadoEm).toLocaleDateString('pt-BR')}</span>
          <div>
            <button class="btn btn-gold" data-action="editar-detalhe">🪶 Editar Ficha</button>
            <button class="btn btn-outline-gold" data-action="fechar">Fechar</button>
          </div>
        </footer>
      </article>
    </div>
  `;
}

function confirmacaoRemocao() {
  const p = state.personagemParaRemover;
  if (!p) return '';

  return `
    <div class="sheet-modal">
      <article class="sheet-detail confirm-modal">
        <button class="close-btn" data-action="cancelar-remocao">×</button>
        <h2>☠️ Banir Aventureiro</h2>
        <div class="confirm-box">
          <p class="confirm-title">Tem certeza de que deseja banir <strong>${escapeHtml(p.nome)}</strong> do Grimório?</p>
          <p class="support">Este aventureiro será removido permanentemente das crônicas. Esta ação não pode ser desfeita.</p>
        </div>
        <footer>
          <span></span>
          <div>
            <button class="btn btn-outline-gold" data-action="cancelar-remocao">Cancelar</button>
            <button class="btn btn-danger" data-action="confirmar-remocao">Banir Permanentemente</button>
          </div>
        </footer>
      </article>
    </div>
  `;
}

export function render(callbacks) {
  const activeElement = document.activeElement;
  const activeFilter = activeElement?.dataset?.filter;
  let cursorStart = null;
  let cursorEnd = null;
  
  if (activeFilter && activeElement.tagName === 'INPUT') {
    cursorStart = activeElement.selectionStart;
    cursorEnd = activeElement.selectionEnd;
  }

  const app = document.querySelector('#app');
  app.innerHTML = `
    ${header()}
    <main class="container-xl page">
      ${state.mensagem ? `<div class="notice success">${escapeHtml(state.mensagem)}</div>` : ''}
      ${state.erro ? `<div class="notice error">${escapeHtml(state.erro)}</div>` : ''}
      ${state.carregando ? '<p class="empty">Abrindo o grimório...</p>' : state.tela === 'lista' ? lista() : formulario()}
    </main>
    ${detalhe()}
    ${confirmacaoRemocao()}
  `;

  app.querySelector('[data-action="novo"]')?.addEventListener('click', callbacks.novo);
  app.querySelector('[data-action="cancelar"]')?.addEventListener('click', callbacks.cancelar);
  app.querySelector('#character-form')?.addEventListener('submit', callbacks.salvar);
  app.querySelector('#classe-form')?.addEventListener('change', callbacks.trocarClasse);

  app.querySelectorAll('[data-filter]').forEach((campo) => {
    campo.addEventListener('input', callbacks.filtrar);
    campo.addEventListener('change', callbacks.filtrar);
  });

  app.querySelectorAll('[data-action="attr-minus"], [data-action="attr-plus"]').forEach((botao) => {
    botao.addEventListener('click', callbacks.ajustarAtributo);
  });

  app.querySelectorAll('.character-card').forEach((cardEl) => {
    const personagem = state.personagens.find((p) => p.id === Number(cardEl.dataset.id));
    cardEl.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      callbacks.detalhes(personagem);
    });
    cardEl.querySelector('[data-action="detalhes"]').addEventListener('click', () => callbacks.detalhes(personagem));
    cardEl.querySelector('[data-action="remover"]').addEventListener('click', () => callbacks.remover(personagem));
  });

  app.querySelectorAll('[data-action="fechar"]').forEach((botao) => botao.addEventListener('click', callbacks.fecharDetalhe));
  app.querySelector('[data-action="editar-detalhe"]')?.addEventListener('click', callbacks.editarDetalhe);
  app.querySelectorAll('[data-action="cancelar-remocao"]').forEach((botao) => botao.addEventListener('click', callbacks.cancelarRemocao));
  app.querySelector('[data-action="confirmar-remocao"]')?.addEventListener('click', callbacks.confirmarRemocao);

  if (activeFilter) {
    requestAnimationFrame(() => {
      const elToFocus = app.querySelector(`[data-filter="${activeFilter}"]`);
      if (elToFocus) {
        elToFocus.focus();
        if (elToFocus.tagName === 'INPUT' && cursorStart !== null) {
          elToFocus.setSelectionRange(cursorStart, cursorEnd);
        }
      }
    });
  }
}
