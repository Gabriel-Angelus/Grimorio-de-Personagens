import type { Atributos } from '../types/atributos.js';

export function calcularModificador(valor: number): number {
  return Math.floor((valor - 10) / 2);
}

export function calcularModificadores(atributos: Atributos): Atributos {
  return {
    forca: calcularModificador(atributos.forca),
    destreza: calcularModificador(atributos.destreza),
    constituicao: calcularModificador(atributos.constituicao),
    inteligencia: calcularModificador(atributos.inteligencia),
    sabedoria: calcularModificador(atributos.sabedoria),
    carisma: calcularModificador(atributos.carisma),
  };
}
