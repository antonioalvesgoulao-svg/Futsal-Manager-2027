# Futsal Manager 2027 — guia do projeto

Jogo de gestão de futsal no browser, inspirado no Football Manager. Projeto pessoal do António (sem fins comerciais).
O António não programa: o Claude escreve o código, testa e envia para o GitHub; o António testa no StackBlitz e dá feedback.

## Como trabalhar com o António
- Comunicar em **português europeu**, de forma concisa; tabelas em vez de texto longo
- Explicar o essencial do que mudou, sem pormenores técnicos desnecessários
- Testar sempre antes de entregar: `npx tsc`, `npx vite build` e um teste no browser (Playwright com o Chromium pré-instalado; para WebGL usar `--use-angle=swiftshader`)
- Fazer commit e push para `main` no fim de cada passo concluído
- O António valoriza **realismo**: regras oficiais, competições reais, dados reais. Validar com dados reais sempre que possível
- O António revê os números; dizer claramente o que é estimativa
- Experiência de jogo primeiro, grafismo depois

## Limites (já decididos, não reabrir)
- **Não** reproduzir logótipos, marcadores oficiais, fotos de jogadores, nem canais de TV reais ou imitações (nomes derivados + mesmas cores + mesmo símbolo). Os canais foram retirados do jogo a pedido do António
- Nomes reais de jogadores, clubes, pavilhões e cores reais dos clubes: **sim**
- Grafismo próprio: marcadores originais de inspiração portuguesa (azulejo, calçada, verde/vermelho)

## Tecnologia
- TypeScript + Vite, sem framework de UI (HTML gerado em strings), Three.js para o 3D
- Gravações em `localStorage` (3 espaços) + exportar/importar ficheiro. `SAVE_VERSION` em `src/core/types.ts`: subir quando a estrutura muda
- Abrir: `stackblitz.com/github/antonioalvesgoulao-svg/Futsal-Manager-2027`

## Estrutura
| Pasta / ficheiro | Conteúdo |
|---|---|
| `src/data/por/` | Liga Placard 2026/27: `clubs.json` (reputation, level, wealth em escala mundial 1-100), `players.json` (212 jogadores, zerozero), `history.json` (5 épocas de historial por jogador), `coaches.json`, `overrides.json` |
| `src/core/attributes.ts` | 26 atributos de futsal (1-20), geração por nível/idade/posição, potencial |
| `src/core/moneyball.ts` | Nível do jogador a partir do historial: nível da equipa, força da liga (golos em ligas fracas descontados), jogos, produtividade |
| `src/core/engine/match.ts` | Motor posse a posse (`createMatch` passo a passo; `simulateMatch` de uma vez). Regista `actions` por posse (remate, assistência, roubo, falta) |
| `src/core/visual/choreo.ts` | Coreografia de cada posse, **comum ao 2D e 3D**: bola de pé em pé, 4x4 tático, bolas paradas |
| `src/core/tactics.ts` | Sistemas, pressão, ritmo, marcação, GR avançado, rotação, quintetos, bolas paradas |
| `src/core/season/` | Calendário e competições portuguesas |
| `src/core/game.ts` | Ciclo de jogo (avançar, jogar, fim de época) |
| `src/core/development.ts` | Evolução, reformas, jovens da formação |
| `src/ui/screens/` | Ecrãs (início, plantel, táticas, calendário, competições, dia de jogo, ao vivo, definições) |
| `src/ui/three/highlight3d.ts` | Momentos importantes em 3D (pavilhão, 4 câmaras, repetição) |

## Regras oficiais implementadas
2 x 20 min de tempo útil; faltas acumuladas por parte, 6.ª = livre direto sem barreira (10 m ou local da falta); no prolongamento contam as da 2.ª parte; 1 desconto de tempo por parte; expulsão = 2 min de inferioridade (acaba se sofrer golo); buzina (remate antes do fim conta); prolongamento 2 x 5 min; penáltis 5 + pares até desempatar; substituições volantes ilimitadas; GR avançado como instrução tática.

## Competições (formatos reais)
- Liga Placard: 12 clubes, 2 voltas; play-off 8 primeiros (quartos e meias à melhor de 3, final à melhor de 5)
- Taça da Liga: final eight com os 8 primeiros no fim da 1.ª volta, janeiro, campo neutro
- Taça de Portugal: eliminatória inicial + final eight em abril
- Supertaça: campeão x vencedor da Taça (ou finalista)

## Validação (5 épocas reais 2021/22 a 2025/26, zerozero)
Real: 6,38 golos/jogo, casa 49,6%, fora 37,0%, empates 13,5%, <3 golos 6,1%. Manter a simulação próxima destes valores após mexer no motor (script de 5 épocas com play-off).

## Feedback recente do António (prioridade)
- Vídeo de 31/10/2026: transições artificiais, cantos sem marcador nem organização, 3D sem animações. Resposta (`choreo.ts` reescrito):
  - percursos contínuos com inércia (velocidade máx. 7,4 m/s, aceleração 9 m/s²), continuidade entre posses
  - padrões reais: paralela, diagonal, bola no pivô + corte, bloqueio e continuação, finta 1x1, passe e corte (4-0), cruzamento (2-2), inversão (5x4), segundo poste, contra-ataques com contagem real (2x1, 3x2)
  - defesa: pressão conforme a linha escolhida, cobertura/ajuda, individual mantém pares, zona troca marcações; 5x4 deixa livre o mais longe da bola
  - bolas paradas organizadas: cantos (4 jogadas do motor), livres com barreira a 5 m (3 jogadas), 10 m e penálti com todos atrás da linha da bola, festejos, reposições do GR, pontapé de saída
  - ações por jogador (`Frame.acts`): passe, remate, mergulho, defesa, carrinho, finta, bloqueio, proteção do pivô, bloqueio de remate, queda, festejo. 3D com corpo articulado; 2D com setas de desmarcação e marcas de ação
  - ritmo: lenta 1,5x (lances decisivos 1x), média 5x (2x), rápida 12x
- Não consigo ver vídeos do YouTube; posso analisar gravações de ecrã que o António envie (extraio fotogramas)
- Próximos melhoramentos possíveis: pontapés de linha lateral, mais variantes de jogadas ensaiadas, ressaltos/recargas

## Roteiro
| Etapa | Estado |
|---|---|
| 1-6 Base, dados, atributos, motor, táticas, época | Feito |
| 7 Quadro tático gráfico, bolas paradas, jogo ao vivo 2D, 3D | Feito (a afinar com feedback) |
| 8 Ligação 3D ao motor | Coberta pela 7 |
| 9 Plantel e clube: treino, moral, lesões, castigos, contratos | Próxima |
| 10 Mercado e finanças | |
| 11 Staff e formação (treinadores com historial real) | |
| 12 20 ligas europeias + segundas divisões e taças | |
| 13 Champions League, seleções, Europeu, Mundial, Intercontinental | |
| 14 2 ligas por continente | |

Recolha de dados: o zerozero bloqueia pedidos diretos; usar o Chrome do António (Claude in Chrome) para ler páginas.
