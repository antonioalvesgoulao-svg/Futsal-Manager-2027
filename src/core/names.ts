// Nomes fictícios para gente gerada (juniores, staff) conforme o país do clube
import type { Club } from './types';

const ES_FIRST_YOUNG = ['Hugo', 'Pablo', 'Álvaro', 'Adrián', 'Mario', 'Daniel', 'Marcos', 'Iker', 'Javier', 'Sergio', 'Diego', 'Alejandro', 'Raúl', 'Unai', 'Pol', 'Marc', 'Aitor', 'Nil', 'Rubén', 'Izan', 'Gonzalo', 'Jaime', 'Carlos', 'Manuel'];
const ES_FIRST = ['Javier', 'José', 'Antonio', 'Manuel', 'David', 'Juan', 'Francisco', 'Jesús', 'Carlos', 'Miguel', 'Rafael', 'Pedro', 'Sergio', 'Alberto', 'Fernando', 'Luis', 'Jordi', 'Óscar', 'Raúl', 'Ignacio'];
const ES_LAST = ['García', 'Fernández', 'González', 'Rodríguez', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Álvarez', 'Muñoz', 'Romero', 'Navarro', 'Torres', 'Domínguez', 'Gil', 'Vázquez', 'Serrano', 'Ramos', 'Blanco', 'Molina', 'Ortega'];

export const isSpanish = (club?: Club) => club?.league === 'esp1';
export const isItalian = (club?: Club) => club?.league === 'ita1';

const IT_FIRST_YOUNG = ['Leonardo', 'Francesco', 'Alessandro', 'Lorenzo', 'Mattia', 'Andrea', 'Gabriele', 'Riccardo', 'Tommaso', 'Edoardo', 'Matteo', 'Giuseppe', 'Antonio', 'Federico', 'Davide', 'Christian', 'Simone', 'Luca', 'Nicolò', 'Pietro'];
const IT_FIRST = ['Giuseppe', 'Giovanni', 'Antonio', 'Mario', 'Luigi', 'Francesco', 'Angelo', 'Vincenzo', 'Pietro', 'Salvatore', 'Carlo', 'Franco', 'Domenico', 'Bruno', 'Paolo', 'Michele', 'Massimo', 'Fabrizio', 'Roberto', 'Stefano'];
const IT_LAST = ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti', 'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferrara', 'Galli'];
/** Jovem gerado num clube italiano (85% italianos; os outros da Argentina e do Brasil, muitos com dupla nacionalidade). */
export function italianYouth(r: () => number) {
  return { name: `${IT_FIRST_YOUNG[Math.floor(r() * IT_FIRST_YOUNG.length)]} ${IT_LAST[Math.floor(r() * IT_LAST.length)]}`, nationality: r() < 0.85 ? 'Itália' : r() < 0.5 ? 'Argentina' : 'Brasil' };
}
export const italianName = (r: () => number) => `${IT_FIRST[Math.floor(r() * IT_FIRST.length)]} ${IT_LAST[Math.floor(r() * IT_LAST.length)]}`;
/** Jovem e nome de adulto conforme o país do clube (null = Portugal, que usa as listas próprias). */
export const localYouth = (club: Club | undefined, r: () => number) => (isSpanish(club) ? spanishYouth(r) : isItalian(club) ? italianYouth(r) : null);
export const localName = (club: Club | undefined, r: () => number) => (isSpanish(club) ? spanishName(r) : isItalian(club) ? italianName(r) : null);

/** Nome e nacionalidade de um jovem gerado num clube espanhol (90% espanhóis, o resto da América do Sul). */
export function spanishYouth(r: () => number) {
  return { name: `${ES_FIRST_YOUNG[Math.floor(r() * ES_FIRST_YOUNG.length)]} ${ES_LAST[Math.floor(r() * ES_LAST.length)]}`, nationality: r() < 0.9 ? 'Espanha' : r() < 0.5 ? 'Argentina' : 'Brasil' };
}
export const spanishName = (r: () => number) => `${ES_FIRST[Math.floor(r() * ES_FIRST.length)]} ${ES_LAST[Math.floor(r() * ES_LAST.length)]}`;
/** Nacionalidade "da casa" de um clube. */
export const homeNation = (club?: Club) => (isSpanish(club) ? 'Espanha' : isItalian(club) ? 'Itália' : 'Portugal');
