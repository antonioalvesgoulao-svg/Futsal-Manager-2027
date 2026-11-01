// Staff técnico e formação (etapa 11). Efeitos todos ESTIMADOS (não há estudos com números para o futsal):
// - adjunto: eficácia do treino (evolução ×0,87 a ×1,15)
// - preparador físico: lesões em treino (×1,27 a ×0,7) e perda física dos veteranos
// - treinador de GR: evolução dos guarda-redes (×0,85 a ×1,25)
// - fisioterapeuta: tempo de recuperação das lesões (×1,22 a ×0,75)
// - coordenador da formação: qualidade e número de juniores que chegam todos os anos
// A formação é uma equipa à parte (clubId `${clube}@jun`): os juniores treinam e evoluem, sobem ao plantel quando o treinador quiser.
import { generateAttributes, overall, rng } from './attributes';
import type { Club, GameState, Player, Position } from './types';
import REALJSON from '../data/por/staff.json';
const REAL = REALJSON as unknown as { people: { id: string; club: string; name: string; func: string; role: string; nat: string; birth: string; ability: number; history: StaffSeason[]; coach?: { tactical: number; motivation: number }; fp?: { games: number; wins: number; notWon: number; titles: string[] } }[] };
export const realCoachOf = (clubId: string) => REAL.people.find((p) => p.club === clubId && p.role === 'principal');

export type Role = 'adjunto' | 'fisico' | 'gr' | 'fisio' | 'formacao' | 'analista' | 'scout' | 'psicologo' | 'nutricionista' | 'coordenador' | 'outro';
export const ROLE_NAME: Record<Role, string> = { adjunto: 'Treinador adjunto', fisico: 'Preparador físico', gr: 'Treinador de guarda-redes', fisio: 'Fisioterapeuta / médico', formacao: 'Coordenador da formação', analista: 'Analista', scout: 'Scout', psicologo: 'Psicólogo', nutricionista: 'Nutricionista', coordenador: 'Coordenador geral', outro: 'Apoio' };
/** Funções base (todos os clubes têm alguém) e funções extra (só se existirem na equipa técnica real ou forem contratadas) */
export const ROLES: Role[] = ['adjunto', 'fisico', 'gr', 'fisio', 'formacao'];
export const EXTRA_ROLES: Role[] = ['analista', 'scout', 'psicologo', 'nutricionista', 'coordenador', 'outro'];

export interface StaffSeason { ep: string; club: string; func: string; g: string; w: string; d: string; l: string; titles: string }
export interface Staff { id: string; name: string; role: Role; clubId: string | null; ability: number; age: number; wage: number; until: number; func?: string; nat?: string; history?: StaffSeason[]; real?: boolean }

const FIRST = ['João', 'Rui', 'Paulo', 'Nuno', 'Pedro', 'Ricardo', 'Hugo', 'Carlos', 'Luís', 'Jorge', 'Bruno', 'Sérgio', 'Vítor', 'Fernando', 'Marco', 'Filipe', 'Tiago', 'André', 'Miguel', 'José'];
const LAST = ['Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Sousa', 'Fernandes', 'Gonçalves', 'Gomes', 'Lopes', 'Marques', 'Alves', 'Almeida', 'Ribeiro', 'Pinto', 'Carvalho', 'Teixeira', 'Moreira', 'Correia', 'Mendes', 'Nunes', 'Vieira', 'Monteiro'];

/** Salário mensal do staff (estimativa): cresce com a capacidade e com a riqueza do clube. */
export const staffWage = (ability: number, club?: Club) => Math.max(400, Math.round(250 * Math.exp(ability * 0.11) * (club ? 0.3 + club.wealth / 100 : 1) / 50) * 50);
/** Orçamento mensal do staff (estimativa): o que o clube paga a um staff típico do seu nível, +20%. */
export const staffBudget = (club: Club) => club.staffBudget ?? Math.round(5 * staffWage(6 + club.wealth * 0.11, club) * 1.2);

function makeStaff(id: string, role: Role, clubId: string | null, ability: number, r: () => number, year: number, club?: Club): Staff {
  const a = Math.max(1, Math.min(20, Math.round(ability)));
  return { id, name: `${FIRST[Math.floor(r() * FIRST.length)]} ${LAST[Math.floor(r() * LAST.length)]}`, role, clubId, ability: a, age: 30 + Math.floor(r() * 28), wage: staffWage(a, club), until: year + 1 + Math.floor(r() * 3) };
}

/** Garante staff em todos os clubes (nível conforme a riqueza) e uma bolsa de técnicos sem clube. */
export function ensureStaff(s: GameState) {
  if (s.staff?.some((x) => x.real)) return;
  const r = rng('staff-ini');
  s.staff = [];
  // equipas técnicas reais (zerozero); funções base em falta ficam com técnicos fictícios
  for (const p of REAL.people) {
    const club = s.clubs.find((c) => c.id === p.club);
    if (!club || p.role === 'principal') continue;
    const age = p.birth && p.birth !== '?' ? s.season.year - Number(p.birth.slice(0, 4)) : 40;
    s.staff.push({ id: `rs-${p.id}`, name: p.name, role: p.role as Role, clubId: p.club, ability: Math.min(20, Math.round(p.ability + club.wealth * 0.035)), age, wage: staffWage(p.ability, club), until: s.season.year + 2, func: p.func, nat: p.nat, history: p.history, real: true });
  }
  for (const c of s.clubs) for (const role of ROLES) if (!s.staff.some((x) => x.clubId === c.id && x.role === role)) s.staff.push(makeStaff(`st-${c.id}-${role}`, role, c.id, 4 + c.wealth * 0.09 + (r() - 0.5) * 4, r, s.season.year, c));
  // orçamento do staff: o maior entre o típico do clube e o que já paga à equipa técnica real (+10%)
  for (const c of s.clubs) { c.staffBudget = undefined; c.staffBudget = Math.round(Math.max(staffBudget(c), staffBill(s, c.id) * 1.1)); }
  for (let i = 0; i < 25; i++) s.staff.push(makeStaff(`st-free-${i}`, ROLES[i % 5], null, 4 + r() * 11, r, s.season.year));
  // o meu clube não tem staff pré-definido? tem: herda o do clube (o treinador escolhe se mantém)
}

/** O melhor da função no clube (pode haver vários, ex.: dois adjuntos). */
export const staffOf = (s: GameState, clubId: string, role: Role) => (s.staff ?? []).filter((x) => x.clubId === clubId && x.role === role).sort((a, b) => b.ability - a.ability)[0];
/** Capacidade (1-20) do staff numa função; sem ninguém conta como 5. */
export const abilityOf = (s: GameState, clubId: string, role: Role) => staffOf(s, clubId, role)?.ability ?? 5;

// ---------- efeitos ----------
export const trainingK = (s: GameState, clubId: string) => 0.85 + abilityOf(s, clubId, 'adjunto') * 0.015; // 10 → 1,0
export const gkTrainingK = (s: GameState, clubId: string) => 0.75 + abilityOf(s, clubId, 'gr') * 0.025; // 10 → 1,0
export const fitnessInjK = (s: GameState, clubId: string) => 1.3 - abilityOf(s, clubId, 'fisico') * 0.03; // 10 → 1,0
export const physioK = (s: GameState, clubId: string) => 1.25 - abilityOf(s, clubId, 'fisio') * 0.025; // 10 → 1,0
// funções extra: sem ninguém = sem efeito
const extra = (s: GameState, clubId: string, role: Role) => staffOf(s, clubId, role)?.ability ?? 0;
/** Analista: estudo dos adversários = mais conhecimento tático no jogo (+0 a +1,5). */
export const analystBonus = (s: GameState, clubId: string) => extra(s, clubId, 'analista') * 0.075;
/** Psicólogo: as quedas de moral são menores (×1 a ×0,7). */
export const psychK = (s: GameState, clubId: string) => 1 - extra(s, clubId, 'psicologo') * 0.015;
/** Nutricionista: menos lesões (×1 a ×0,9). */
export const nutritionK = (s: GameState, clubId: string) => 1 - extra(s, clubId, 'nutricionista') * 0.005;
/** Scout: avalia melhor o potencial de jogadores de outros clubes (erro ±2,5 sem scout, ±0,5 com scout 20). */
export const scoutError = (s: GameState, clubId: string) => 2.5 - extra(s, clubId, 'scout') * 0.1;

export const staffBill = (s: GameState, clubId: string) => (s.staff ?? []).filter((x) => x.clubId === clubId).reduce((a, x) => a + x.wage, 0);

/** Contratar um técnico livre para uma função (o atual sai com metade do que falta receber). */
export function hireStaff(s: GameState, st: Staff): string {
  const my = s.clubs.find((c) => c.id === s.clubId)!;
  const cur = staffOf(s, my.id, st.role);
  const newWage = staffWage(st.ability, my);
  if (staffBill(s, my.id) - (cur?.wage ?? 0) + newWage > staffBudget(my)) return `A direção não aprova: o staff passaria o orçamento de ${staffBudget(my)} €/mês (${st.name} pede ${newWage} €).`;
  const cost = cur ? Math.round(cur.wage * Math.max(1, (cur.until - s.season.year) * 12) * 0.5) : 0;
  if (cur) { cur.clubId = null; cur.wage = staffWage(cur.ability); }
  st.clubId = my.id; st.wage = staffWage(st.ability, my); st.until = s.season.year + 2;
  return `${st.name} é o novo ${ROLE_NAME[st.role].toLowerCase()} (${st.wage} €/mês)${cur ? `; ${cur.name} sai (indemnização ${cost} €)` : ''}.`;
}
export const fireCost = (s: GameState, st: Staff) => Math.round(st.wage * Math.max(1, (st.until - s.season.year) * 12) * 0.5);

// ---------- formação ----------
export const juniorsId = (clubId: string) => `${clubId}@jun`;
export const juniorsOf = (s: GameState, clubId: string) => s.players.filter((p) => p.clubId === juniorsId(clubId));

/** Qualidade da formação (1-20): estrutura do clube + coordenador + treinador principal (estimativa). */
export function academyLevel(s: GameState, club: Club) {
  const coachYouth = club.id === s.clubId ? 12 : s.coaches.find((c) => c.clubId === club.id)?.youth ?? 10;
  return Math.round(Math.min(20, club.wealth * 0.07 + abilityOf(s, club.id, 'formacao') * 0.45 + coachYouth * 0.2) * 10) / 10;
}

const PFIRST = ['João', 'Rodrigo', 'Martim', 'Tomás', 'Afonso', 'Diogo', 'Gonçalo', 'Duarte', 'Francisco', 'Rafael', 'Miguel', 'Guilherme', 'Gabriel', 'Lourenço', 'Santiago', 'Vicente', 'Simão', 'Henrique', 'Salvador', 'Pedro', 'Tiago', 'André', 'Bernardo', 'Leonardo', 'Dinis', 'Kevin', 'Wilson'];
/** Todos os verões chegam juniores (16-17 anos) à equipa de formação: mais e melhores quanto melhor a formação. */
export function academyIntake(s: GameState, club: Club, year: number): Player[] {
  const r = rng(`acad-${club.id}-${year}`);
  const lvl = academyLevel(s, club);
  const n = 2 + Math.floor(lvl / 7) + (r() < 0.5 ? 1 : 0); // 2 a 5 por ano
  const out: Player[] = [];
  for (let i = 0; i < n; i++) {
    const pos: Position = i === 0 && r() < 0.35 ? 'GR' : (['FIX', 'ALA', 'ALA', 'PIV', 'UNI', 'FIX/ALA', 'ALA/PIV'] as Position[])[Math.floor(r() * 7)];
    const base: Player = { id: `${club.id}j${year}${i}`, clubId: juniorsId(club.id), name: `${PFIRST[Math.floor(r() * PFIRST.length)]} ${LAST[Math.floor(r() * LAST.length)]}`, position: pos, number: null, age: 16 + Math.floor(r() * 2), nationality: r() < 0.9 ? 'Portugal' : 'Cabo Verde', attrs: {} as Player['attrs'], potential: 0 };
    const g = generateAttributes(base, 38 + lvl * 1.6, 0);
    // talentos raros: mais frequentes nas melhores formações
    const gem = r() < 0.04 + lvl * 0.006 ? 2 + r() * 4 : 0;
    out.push({ ...base, attrs: g.attrs, potential: Math.min(20, Math.round((g.potential + gem + lvl * 0.1) * 10) / 10) });
  }
  return out;
}

/** Potencial visto pelo clube: o coordenador da formação avalia melhor (erro até ±2,5 estrelas com coordenador fraco). */
export function scoutedPotential(s: GameState, p: Player, clubId: string) {
  const err = (20 - abilityOf(s, clubId, 'formacao')) / 20 * 2.5;
  const r = rng(`scout-${p.id}-${clubId}`);
  return Math.max(1, Math.min(20, Math.round((p.potential + (r() * 2 - 1) * err) * 2) / 2));
}

/** Potencial visto por um clube de um jogador de outro clube (o scout reduz o erro). */
export function seenPotential(s: GameState, p: Player, viewer: string) {
  if (p.clubId === viewer) return p.potential;
  const err = scoutError(s, viewer);
  const r = rng(`seen-${p.id}-${viewer}`);
  return Math.max(1, Math.min(20, Math.round((p.potential + (r() * 2 - 1) * err) * 2) / 2));
}

/** Subir um júnior ao plantel principal (contrato de formação, salário baixo). */
export function promote(s: GameState, p: Player, clubId: string, year: number) {
  const used = new Set(s.players.filter((x) => x.clubId === clubId).map((x) => x.number));
  let n = 2; while (used.has(n)) n++;
  p.clubId = clubId; p.number = n;
  p.contract = { wage: 400, until: year + 3, clause: 250000 };
}

/** Fim da época: chegam juniores; quem faz 19 anos sobe (se tiver nível) ou sai; a IA sobe os melhores. Devolve notícias do meu clube. */
export function academySeasonEnd(s: GameState, newYear: number): string[] {
  const out: string[] = [];
  for (const c of s.clubs) {
    const jun = juniorsOf(s, c.id);
    const senior = s.players.filter((p) => p.clubId === c.id);
    const lv = senior.map((p) => overall(p.attrs, p.position)).sort((a, b) => b - a);
    for (const p of jun) {
      if (p.age < 19) {
        // IA: sobe juniores que já entram nos 12 melhores
        if (c.id !== s.clubId && overall(p.attrs, p.position) > (lv[11] ?? 0)) promote(s, p, c.id, newYear);
        continue;
      }
      // 19 anos: acaba a formação
      if (c.id === s.clubId) { out.push(`${p.name} acabou a formação (19 anos) e saiu do clube. Sobe os juniores antes dos 19 se os quiseres manter.`); p.clubId = ''; }
      else if (overall(p.attrs, p.position) > (lv[14] ?? 0) - 1) promote(s, p, c.id, newYear);
      else p.clubId = '';
    }
    const fresh = academyIntake(s, c, newYear);
    s.players.push(...fresh);
    if (c.id === s.clubId) out.push(`Chegam ${fresh.length} juniores à formação: ${fresh.map((p) => `${p.name} (${p.position}, ${p.age})`).join(', ')}.`);
  }
  return out;
}
