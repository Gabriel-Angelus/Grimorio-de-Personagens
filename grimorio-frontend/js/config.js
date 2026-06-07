export const API_BASE_URL = 'http://localhost:3000';

export const CLASSES_RPG = [
  { valor: 'Guerreiro', rotulo: '⚔️ Guerreiro' },
  { valor: 'Mago', rotulo: '🧙 Mago' },
  { valor: 'Ladino', rotulo: '🗡️ Ladino' },
  { valor: 'Clerigo', rotulo: '🛡️ Clérigo' },
  { valor: 'Bardo', rotulo: '📜 Bardo' },
  { valor: 'Arqueiro', rotulo: '🏹 Arqueiro' },
];

export const RACAS = ['Humano', 'Elfo', 'Anao', 'Orc', 'Halfling'];
export const ORIGENS = ['Academico', 'Nobre', 'Campones', 'Mercenario', 'Soldado', 'Orfao'];

export const ATRIBUTOS = [
  ['forca', 'Força', 'FOR', 'Poder físico e força bruta.'],
  ['destreza', 'Destreza', 'DES', 'Agilidade, reflexos e pontaria.'],
  ['constituicao', 'Constituição', 'CON', 'Resistência, saúde e vitalidade.'],
  ['inteligencia', 'Inteligência', 'INT', 'Capacidade de raciocínio, memória e conhecimento.'],
  ['sabedoria', 'Sabedoria', 'SAB', 'Percepção, intuição e bom senso.'],
  ['carisma', 'Carisma', 'CAR', 'Força de personalidade, magnetismo e persuasão.'],
];

export const ATRIBUTOS_POR_CLASSE = {
  Guerreiro: { forca: 15, destreza: 13, constituicao: 14, inteligencia: 9, sabedoria: 10, carisma: 10 },
  Mago: { forca: 8, destreza: 15, constituicao: 12, inteligencia: 18, sabedoria: 13, carisma: 10 },
  Ladino: { forca: 11, destreza: 18, constituicao: 13, inteligencia: 13, sabedoria: 11, carisma: 14 },
  Clerigo: { forca: 12, destreza: 10, constituicao: 14, inteligencia: 11, sabedoria: 16, carisma: 13 },
  Bardo: { forca: 9, destreza: 14, constituicao: 12, inteligencia: 13, sabedoria: 11, carisma: 17 },
  Arqueiro: { forca: 10, destreza: 17, constituicao: 12, inteligencia: 12, sabedoria: 15, carisma: 9 },
};
