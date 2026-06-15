function escapeHtml(valor = '') {
  return String(valor).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[char]);
}

export function opcoesCampanhas(campanhas, selecionada) {
  return `
    <option value="">Sem campanha</option>
    ${campanhas
      .map((campanha) => `<option value="${campanha.id}" ${campanha.id === selecionada ? 'selected' : ''}>${escapeHtml(campanha.nome)}</option>`)
      .join('')}
  `;
}
