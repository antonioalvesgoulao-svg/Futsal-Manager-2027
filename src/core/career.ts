// Carreira e mercado de staff (estimativas ao estilo FM; não há dados públicos sobre despedimentos no futsal):
// - objetivos da direção conforme o clube; confiança 0-100 que sobe e desce com os resultados; despedimento abaixo de 15
// - clubes do computador despedem o treinador quando ficam muito abaixo do esperado e vão buscar outro ao mercado
// - propostas de emprego ao treinador (tu) quando um clube maior fica sem treinador e a tua reputação chega
// - contratos do staff: acabam no fim da época; os clubes renovam ou não; técnicos de outros clubes podem ser contratados
import { rng } from './attributes';
import { leagueTable } from './season/season';
import { fmtEur } from './contracts';
import { book, financeOf } from './finance';
import { staffBill, staffBudget, staffWage, type Staff } from './staff';
import type { Club, Coach, GameState } from './types';

export interface Career {
  confidence: number; // confiança da direção 0-100
  reputation: number; // reputação do treinador 1-100
  offers: { clubId: string; date: string }[];
  sacked?: boolean; // despedido: escolhe um clube das propostas para continuar
  sackedSeason?: Record<string, number>; // clubes da IA que já mudaram de treinador nesta época
  history: { season: string; clubId: string; pos?: number; titles: string[] }[];
}

export const careerOf = (s: GameState): Career => (s.career ??= { confidence: 60, reputation: 35, offers: [], history: [] });

/** Posição esperada na Liga: ordem do nível dos clubes (estimativa da direção). */
export function expectedPos(s: GameState, clubId: string) {
  return [...s.clubs].sort((a, b) => b.level - a.level).findIndex((c) => c.id === clubId) + 1;
}
export function objectiveOf(s: GameState, clubId: string) {
  const e = expectedPos(s, clubId);
  return e <= 2 ? { text: 'Ser campeão e ganhar troféus', pos: 2 } : e <= 4 ? { text: 'Ficar nos 4 primeiros', pos: 4 } : e <= 8 ? { text: 'Chegar ao play-off (8 primeiros)', pos: 8 } : { text: 'Fazer uma época tranquila (fora dos 2 últimos)', pos: 10 };
}
const posOf = (s: GameState, clubId: string) => {
  const t = leagueTable(s.season, s.leagues[0].clubIds);
  return { pos: t.findIndex((r) => r.club === clubId) + 1, played: t.find((r) => r.club === clubId)?.p ?? 0 };
};

/** Depois de cada jogo do meu clube: a confiança mexe com o resultado face ao esperado. */
export function afterMyMatch(s: GameState, res: 'V' | 'E' | 'D', oppLevel: number, importance: number): string[] {
  const c = careerOf(s); const my = s.clubs.find((x) => x.id === s.clubId)!;
  const fav = Math.max(-1.2, Math.min(1.2, (my.level - oppLevel) / 30)); // >0 = era favorito
  let d = res === 'V' ? 1.8 - fav * 0.8 : res === 'E' ? -fav * 1.2 : -1.8 - fav * 1.5;
  d *= 1 + importance * 0.5;
  c.confidence = Math.max(0, Math.min(100, c.confidence + d + (60 - c.confidence) * 0.02));
  c.reputation = Math.max(1, Math.min(100, c.reputation + (res === 'V' ? 0.15 : res === 'D' ? -0.1 : 0) * (my.reputation / 70)));
  return checkSack(s);
}

/** Títulos: confiança e reputação sobem. */
export function onTitle(s: GameState, comp: string) {
  const c = careerOf(s);
  const w = comp === 'liga' ? 25 : comp === 'taca' ? 15 : comp === 'tacaLiga' ? 10 : 6;
  c.confidence = Math.min(100, c.confidence + w);
  c.reputation = Math.min(100, c.reputation + w / 3);
}

function checkSack(s: GameState): string[] {
  const c = careerOf(s);
  const { pos, played } = posOf(s, s.clubId);
  const obj = objectiveOf(s, s.clubId);
  // a direção também olha para a classificação a partir da 8.ª jornada
  if (played >= 8 && pos > obj.pos + 2) c.confidence = Math.max(0, c.confidence - 0.4 * (pos - obj.pos - 2));
  if (c.confidence < 15 && !c.sacked) {
    c.sacked = true;
    c.reputation = Math.max(1, c.reputation - 6);
    // clubes mais pequenos interessados num treinador livre
    const old = s.clubs.find((x) => x.id === s.clubId)!;
    const r = rng(`sackoffers-${s.date}`);
    for (const cl of s.clubs.filter((x) => x.id !== s.clubId && x.reputation <= old.reputation).sort(() => r() - 0.5).slice(0, 2)) c.offers.push({ clubId: cl.id, date: s.date });
    return [`A direção do ${s.clubs.find((x) => x.id === s.clubId)!.name} despediu-te. Vê as propostas na Carreira para continuar.`];
  }
  return [];
}

/** Treinadores livres: o real que saiu do meu clube + alguns fictícios (gerados uma vez). */
export function ensureCoachPool(s: GameState) {
  if (s.coaches.filter((x) => !x.clubId).length >= 6) return;
  const r = rng(`coachpool-${s.season.year}`);
  const F = ['Rui', 'Paulo', 'Jorge', 'Ricardo', 'Hugo', 'Sérgio', 'Pedro', 'Vítor', 'Marco', 'Luís'];
  const L = ['Pereira', 'Costa', 'Martins', 'Sousa', 'Fonseca', 'Rocha', 'Teixeira', 'Lopes', 'Matos', 'Gaspar'];
  for (let i = s.coaches.filter((x) => !x.clubId).length; i < 6; i++) {
    const t = 9 + Math.round(r() * 6);
    s.coaches.push({ id: `cf-${s.season.year}-${i}`, name: `${F[Math.floor(r() * F.length)]} ${L[Math.floor(r() * L.length)]}`, clubId: null, tactical: t, motivation: 9 + Math.round(r() * 6), discipline: 10 + Math.round(r() * 5), youth: 8 + Math.round(r() * 8), style: {} });
  }
}

/** Clubes do computador: despedem o treinador quando a época corre muito mal; o substituto vem do mercado. */
export function aiCoachChanges(s: GameState): string[] {
  const out: string[] = [];
  const c = careerOf(s);
  const done = (c.sackedSeason ??= {});
  ensureCoachPool(s);
  for (const club of s.clubs) {
    if (club.id === s.clubId || done[`${club.id}@${s.season.year}`]) continue;
    const { pos, played } = posOf(s, club.id);
    if (played < 8) continue;
    const gap = pos - objectiveOf(s, club.id).pos;
    const r = rng(`sack-${club.id}-${s.date}`)();
    // muito abaixo do objetivo: 15% por jornada a partir de 3 lugares abaixo; grandes têm menos paciência
    if (gap >= 3 && r < 0.08 * (gap - 2) * (club.reputation >= 85 ? 2 : 1)) {
      const old = s.coaches.find((x) => x.clubId === club.id);
      if (old) { old.clubId = null; }
      const repl = hireCoachFor(s, club, old?.id);
      done[`${club.id}@${s.season.year}`] = 1;
      out.push(`O ${club.name} despediu ${old?.name ?? 'o treinador'} (${pos}.º lugar).${repl ? ` ${repl.name} é o novo treinador.` : ''}`);
      // vaga num clube maior que o meu: proposta ao treinador (tu), se a tua reputação chegar
      const my = s.clubs.find((x) => x.id === s.clubId)!;
      if (club.reputation > my.reputation && c.reputation + 25 >= club.reputation && rng(`offer-${club.id}-${s.date}`)() < 0.5) {
        c.offers.push({ clubId: club.id, date: s.date });
        out.push(`Proposta: o ${club.name} quer-te como treinador. Vê na Carreira.`);
      }
    }
  }
  return out;
}

function hireCoachFor(s: GameState, club: Club, exclude?: string): Coach | undefined {
  const free = s.coaches.filter((x) => !x.clubId && x.id !== exclude).sort((a, b) => b.tactical + b.motivation - a.tactical - a.motivation);
  // clubes pequenos não chegam aos melhores
  const pick = free.find((x) => x.tactical <= 10 + club.reputation / 10) ?? free[free.length - 1];
  if (pick) pick.clubId = club.id;
  return pick;
}

/** Aceitar uma proposta (ou escolher clube depois de despedido). */
export function takeJob(s: GameState, clubId: string, suggest: (squadClub: string) => GameState['tactics']): string {
  const c = careerOf(s);
  const old = s.clubs.find((x) => x.id === s.clubId)!;
  const club = s.clubs.find((x) => x.id === clubId)!;
  // o treinador desse clube sai; o meu antigo clube contrata um do mercado
  const theirs = s.coaches.find((x) => x.clubId === clubId);
  if (theirs) theirs.clubId = null;
  ensureCoachPool(s);
  hireCoachFor(s, old);
  s.clubId = clubId;
  s.tactics = suggest(clubId);
  s.training = undefined;
  c.offers = []; c.sacked = false; c.confidence = 60;
  return `És o novo treinador do ${club.name}.`;
}

// ---------- mercado de staff ----------
/** Indemnização para tirar um técnico a outro clube: metade do que falta do contrato (mín. 3 meses). */
export const poachFee = (s: GameState, st: Staff) => Math.round(st.wage * Math.max(3, (st.until - s.season.year) * 12) * 0.5 / 100) * 100;

/** Contratar um técnico de outro clube (paga indemnização; ele aceita se o clube não for muito menor ou se ganhar mais). */
export function poachStaff(s: GameState, st: Staff, wage: number): string {
  const my = s.clubs.find((x) => x.id === s.clubId)!;
  const from = s.clubs.find((x) => x.id === st.clubId);
  if (!from) return 'Este técnico não tem clube: contrata-o na lista de livres.';
  const want = Math.round(st.wage * (1.1 + Math.max(0, (from.reputation - my.reputation) / 100)) / 50) * 50;
  if (wage < want) return `${st.name} pede pelo menos ${fmtEur(want)}/mês para sair do ${from.name}.`;
  const fee = poachFee(s, st);
  if (financeOf(s, my.id).balance < fee) return `Não tens saldo para a indemnização de ${fmtEur(fee)}.`;
  if (staffBill(s, my.id) + wage > staffBudget(my)) return `A direção não aprova: o staff passaria o orçamento de ${fmtEur(staffBudget(my))}/mês.`;
  book(s, my.id, `Indemnização ao ${from.name} por ${st.name}`, -fee); book(s, from.id, `Saída de ${st.name}`, fee);
  st.clubId = my.id; st.wage = wage; st.until = s.season.year + 2;
  // o clube de origem vai buscar alguém ao mercado
  const repl = s.staff!.filter((x) => !x.clubId && x.role === st.role).sort((a, b) => b.ability - a.ability)[0];
  if (repl) { repl.clubId = from.id; repl.wage = staffWage(repl.ability, from); repl.until = s.season.year + 2; }
  return `${st.name} deixa o ${from.name} e junta-se ao teu staff (${fmtEur(wage)}/mês; indemnização ${fmtEur(fee)}).`;
}

/** Renovar um técnico do meu staff: +2 épocas, pede +10%. */
export function renewStaff(s: GameState, st: Staff): string {
  const my = s.clubs.find((x) => x.id === s.clubId)!;
  const wage = Math.round(st.wage * 1.1 / 50) * 50;
  if (staffBill(s, my.id) - st.wage + wage > staffBudget(my)) return `A direção não aprova a renovação de ${st.name} (${fmtEur(wage)}/mês).`;
  st.wage = wage; st.until = s.season.year + 2;
  return `${st.name} renovou até 30/06/${st.until} (${fmtEur(wage)}/mês).`;
}

/** Fim da época: contratos do staff que acabam. Os clubes da IA renovam os melhores (70%); os meus saem se não renovei. Livres envelhecem e alguns reformam-se. */
export function staffSeasonEnd(s: GameState, endingYear: number): string[] {
  const out: string[] = [];
  const r = rng(`staffend-${endingYear}`);
  for (const st of s.staff ?? []) {
    st.age++;
    if (!st.clubId || st.until > endingYear) continue;
    if (st.clubId === s.clubId) { out.push(`${st.name} (${st.role}) terminou contrato e saiu.`); st.clubId = null; continue; }
    if (r() < 0.7) st.until = endingYear + 1 + Math.floor(r() * 2);
    else st.clubId = null;
  }
  s.staff = (s.staff ?? []).filter((x) => x.clubId || x.age < 67);
  // as vagas dos clubes da IA preenchem-se com livres
  for (const c of s.clubs) {
    if (c.id === s.clubId) continue;
    for (const role of ['adjunto', 'fisico', 'gr', 'fisio', 'formacao'] as const) {
      if (s.staff.some((x) => x.clubId === c.id && x.role === role)) continue;
      const f = s.staff.filter((x) => !x.clubId && x.role === role).sort((a, b) => b.ability - a.ability).find((x) => staffWage(x.ability, c) <= staffBudget(c) / 4);
      if (f) { f.clubId = c.id; f.wage = staffWage(f.ability, c); f.until = endingYear + 2; }
    }
  }
  // treinador (tu): balanço da época
  const c = careerOf(s);
  const { pos } = posOf(s, s.clubId);
  const obj = objectiveOf(s, s.clubId);
  c.confidence = Math.max(0, Math.min(100, c.confidence + (obj.pos - pos) * 3));
  c.reputation = Math.max(1, Math.min(100, c.reputation + (obj.pos - pos) * 0.8));
  c.sackedSeason = {};
  return out;
}
