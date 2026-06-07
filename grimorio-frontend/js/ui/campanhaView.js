export function opcoesCampanhas(campanhas, selecionada) {
  return `
    <option value="">Sem campanha</option>
    ${campanhas
      .map((campanha) => `<option value="${campanha.id}" ${campanha.id === selecionada ? 'selected' : ''}>${campanha.nome}</option>`)
      .join('')}
  `;
}
