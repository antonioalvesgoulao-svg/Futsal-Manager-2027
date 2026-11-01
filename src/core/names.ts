// Nomes fictícios para gente gerada (juniores, staff) conforme o país do clube
import type { Club } from './types';

const ES_FIRST_YOUNG = ['Hugo', 'Pablo', 'Álvaro', 'Adrián', 'Mario', 'Daniel', 'Marcos', 'Iker', 'Javier', 'Sergio', 'Diego', 'Alejandro', 'Raúl', 'Unai', 'Pol', 'Marc', 'Aitor', 'Nil', 'Rubén', 'Izan', 'Gonzalo', 'Jaime', 'Carlos', 'Manuel'];
const ES_FIRST = ['Javier', 'José', 'Antonio', 'Manuel', 'David', 'Juan', 'Francisco', 'Jesús', 'Carlos', 'Miguel', 'Rafael', 'Pedro', 'Sergio', 'Alberto', 'Fernando', 'Luis', 'Jordi', 'Óscar', 'Raúl', 'Ignacio'];
const ES_LAST = ['García', 'Fernández', 'González', 'Rodríguez', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Álvarez', 'Muñoz', 'Romero', 'Navarro', 'Torres', 'Domínguez', 'Gil', 'Vázquez', 'Serrano', 'Ramos', 'Blanco', 'Molina', 'Ortega'];

export const isSpanish = (club?: Club) => club?.league === 'esp1';

/** Nome e nacionalidade de um jovem gerado num clube espanhol (90% espanhóis, o resto da América do Sul). */
export function spanishYouth(r: () => number) {
  return { name: `${ES_FIRST_YOUNG[Math.floor(r() * ES_FIRST_YOUNG.length)]} ${ES_LAST[Math.floor(r() * ES_LAST.length)]}`, nationality: r() < 0.9 ? 'Espanha' : r() < 0.5 ? 'Argentina' : 'Brasil' };
}
export const spanishName = (r: () => number) => `${ES_FIRST[Math.floor(r() * ES_FIRST.length)]} ${ES_LAST[Math.floor(r() * ES_LAST.length)]}`;
/** Nacionalidade "da casa" de um clube. */
export const homeNation = (club?: Club) => (isSpanish(club) ? 'Espanha' : 'Portugal');
