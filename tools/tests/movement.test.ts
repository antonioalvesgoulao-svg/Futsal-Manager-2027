import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Player } from '../../src/core/types';
import { bakeMovementTrajectory, movementProfile } from '../../src/core/visual/movement';

const attrs = {
  passe: 10, rececao: 10, drible: 10, finalizacao: 10, remate: 10, jogoCostas: 10, desarme: 10, bolasParadas: 10,
  visao: 10, decisoes: 10, posicionamento: 10, antecipacao: 10, concentracao: 10, compostura: 10, trabalhoEquipa: 10,
  agressividade: 10, lideranca: 10, aceleracao: 10, agilidade: 10, resistencia: 10, forca: 10, equilibrio: 10,
  reflexos: 3, umParaUm: 3, saidas: 3, jogoPes: 3,
};

function player(acceleration: number, agility: number): Player {
  return {
    id: 'test-player', clubId: 'test-club', name: 'Teste', position: 'ALA', number: 7,
    age: 24, nationality: 'PT', potential: 15,
    attrs: { ...attrs, aceleracao: acceleration, agilidade: agility },
  };
}

function assertDifferentPath(a: { x: number; y: number }[], b: { x: number; y: number }[], label: string) {
  const maxDifference = Math.max(...a.map((point, index) =>
    Math.hypot(point.x - b[index].x, point.y - b[index].y)));
  assert.ok(maxDifference > 0.01, `${label}: trajetórias deveriam divergir (diferença máxima=${maxDifference})`);
}

const low = movementProfile(player(5, 5));
const highAcceleration = movementProfile(player(18, 5));
const highAgility = movementProfile(player(5, 18));
assert.ok(highAcceleration.accelerationFactor > low.accelerationFactor, 'aceleração 18 deve gerar maior limite de aceleração do que 5');
assert.ok(highAgility.agilityFactor > low.agilityFactor, 'agilidade 18 deve gerar maior fator de resposta do que 5');

const straight = (time: number) => ({ x: Math.min(8, time * 4), y: 0 });
const lowAccelerationPath = bakeMovementTrajectory(straight, 0, 2, 5, 4, low.accelerationFactor, low.agilityFactor);
const highAccelerationPath = bakeMovementTrajectory(straight, 0, 2, 5, 4, highAcceleration.accelerationFactor, highAcceleration.agilityFactor);
assertDifferentPath(lowAccelerationPath, highAccelerationPath, 'Aceleração');

const changeOfDirection = (time: number) => time < 0.7
  ? { x: Math.min(4, time * 4), y: 0 }
  : { x: 2.8, y: Math.min(4, (time - 0.7) * 4) };
const lowAgilityPath = bakeMovementTrajectory(changeOfDirection, 0, 2, 5, 20, low.accelerationFactor, low.agilityFactor);
const highAgilityPath = bakeMovementTrajectory(changeOfDirection, 0, 2, 5, 20, highAgility.accelerationFactor, highAgility.agilityFactor);
assertDifferentPath(lowAgilityPath, highAgilityPath, 'Agilidade');

const engineSource = readFileSync('src/core/engine/match.ts', 'utf8');
assert.ok(!engineSource.includes('../visual/') && !engineSource.includes('./visual/'),
  'O motor de resultados não pode depender da camada visual/movimento');

console.log('OK: perfis físicos distintos produzem trajetórias distintas; motor de resultados permanece desacoplado.');
