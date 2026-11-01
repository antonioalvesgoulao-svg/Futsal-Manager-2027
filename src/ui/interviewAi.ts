// Entrevista de emprego com respostas escritas.
// - Com chave da API Anthropic (Definições; fica só neste browser, nunca na gravação): o Claude faz de direção do clube e
//   avalia cada resposta conforme o perfil do clube (valores, cultura, plantel, finanças).
// - Sem chave: avaliação local por palavras-chave (aproxima a resposta escrita à opção mais parecida).
import Anthropic from '@anthropic-ai/sdk';
import { clubProfile, type Question } from '../core/career';
import type { GameState } from '../core/types';

const KEY = 'fm2027-anthropic-key';
export const getApiKey = () => { try { return localStorage.getItem(KEY) ?? ''; } catch { return ''; } };
export const setApiKey = (k: string) => { try { if (k) localStorage.setItem(KEY, k); else localStorage.removeItem(KEY); } catch { /* sem armazenamento */ } };

export interface Answer { option: number | null; text: string }
export interface Evaluation { scores: number[]; comments: string[]; verdict: string; byAi: boolean }

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const STOP = new Set(['para', 'com', 'que', 'uma', 'dos', 'das', 'nos', 'mais', 'muito', 'entre', 'como', 'pelo', 'pela', 'sao', 'nao', 'sim', 'aqui', 'onde']);
const words = (s: string) => norm(s).split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !STOP.has(w));

/** Sem IA: a resposta escrita conta como a opção com mais palavras em comum (por radical); escrita sem relação com nenhuma opção vale 4. */
function localScore(q: Question, text: string) {
  const tw = words(text);
  if (!tw.length) return { score: 0, comment: 'Resposta vazia.' };
  let best = -1, bestHits = 0;
  q.options.forEach((o, i) => {
    const ow = words(o);
    const hits = ow.filter((w) => tw.some((t) => t.slice(0, 5) === w.slice(0, 5))).length;
    if (hits > bestHits) { bestHits = hits; best = i; }
  });
  if (best < 0) return { score: 4, comment: 'A direção não percebeu bem a ideia.' };
  return { score: q.score[best], comment: `Entendido como: "${q.options[best]}".` };
}

/** Avalia as respostas (opção escolhida ou texto livre). Usa o Claude se houver chave; senão, a avaliação local. */
export async function evaluateAnswers(s: GameState, clubId: string, qs: Question[], answers: Answer[]): Promise<Evaluation> {
  const key = getApiKey();
  const written = answers.some((a) => a.option === null && a.text.trim());
  if (key && written) {
    try { return await aiEvaluate(s, clubId, qs, answers, key); } catch (e) {
      const ev = local(qs, answers);
      ev.verdict = `Não foi possível usar a IA (${e instanceof Anthropic.AuthenticationError ? 'chave inválida' : e instanceof Anthropic.RateLimitError ? 'limite de pedidos' : 'erro de ligação'}); avaliação local.`;
      return ev;
    }
  }
  return local(qs, answers);
}

function local(qs: Question[], answers: Answer[]): Evaluation {
  const scores: number[] = [], comments: string[] = [];
  qs.forEach((q, i) => {
    const a = answers[i];
    if (a.option !== null) { scores.push(q.score[a.option] ?? 0); comments.push(''); }
    else { const r = localScore(q, a.text); scores.push(r.score); comments.push(r.comment); }
  });
  return { scores, comments, verdict: '', byAi: false };
}

async function aiEvaluate(s: GameState, clubId: string, qs: Question[], answers: Answer[], apiKey: string): Promise<Evaluation> {
  const P = clubProfile(s, clubId);
  // a chave é do próprio jogador e fica no browser dele: é o único caso em que o SDK pode correr no browser
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const profile = {
    clube: P.club.name, reputacao: P.club.reputation, riqueza: P.club.wealth, titulos: P.palm, objetivo: P.objective <= 2 ? 'ser campeão' : P.objective <= 4 ? 'top 4' : P.objective <= 8 ? 'play-off' : 'época tranquila',
    culturaDeVitoria: P.winning, apostaEmJovens: P.youthPolicy, gastaEmJogadoresFeitos: P.spender, clubeModesto: P.modest,
    idadeMediaPlantel: Number(P.avgAge.toFixed(1)), percentagemJovens: Math.round(P.youth * 100), percentagemEstrangeiros: Math.round(P.foreign * 100),
  };
  const qa = qs.map((q, i) => ({ pergunta: q.q, resposta: answers[i].option !== null ? q.options[answers[i].option!] : answers[i].text.trim() || '(sem resposta)' }));
  const response = await client.beta.messages.create({
    model: 'claude-opus-5-5',
    max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: {
      effort: 'low',
      format: {
        type: 'json_schema',
        schema: {
          type: 'object', additionalProperties: false, required: ['avaliacoes', 'veredicto'],
          properties: {
            avaliacoes: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['nota', 'comentario'], properties: { nota: { type: 'integer' }, comentario: { type: 'string' } } } },
            veredicto: { type: 'string' },
          },
        },
      },
    },
    system: 'És a direção de um clube de futsal português num jogo de gestão (estilo Football Manager), a entrevistar um candidato a treinador principal. Avalias cada resposta de 0 a 10 conforme o encaixe nos valores, na cultura, no plantel e nas finanças do clube (dados no pedido), e também a clareza e a convicção. Respostas vagas, contraditórias ou sem relação com a pergunta valem pouco. Comentários curtos (máx. 15 palavras) em português europeu, na voz da direção. Veredicto: uma frase.',
    messages: [{ role: 'user', content: `Perfil do clube:\n${JSON.stringify(profile)}\n\nEntrevista (uma avaliação por pergunta, pela mesma ordem):\n${JSON.stringify(qa)}` }],
  });
  if (response.stop_reason === 'refusal') throw new Error('refusal');
  const text = response.content.find((b) => b.type === 'text');
  if (!text || text.type !== 'text') throw new Error('sem resposta');
  const out = JSON.parse(text.text) as { avaliacoes: { nota: number; comentario: string }[]; veredicto: string };
  return {
    scores: qs.map((_, i) => Math.max(0, Math.min(10, out.avaliacoes[i]?.nota ?? 0))),
    comments: qs.map((_, i) => out.avaliacoes[i]?.comentario ?? ''),
    verdict: out.veredicto, byAi: true,
  };
}
