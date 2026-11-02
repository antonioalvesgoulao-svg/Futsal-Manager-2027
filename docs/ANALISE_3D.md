# Análise do 3D: guarda-redes, remates, reposições e movimento (1/11/2026)

Medido em 6 jogos (`tools/diag/gk.ts`) e no diagnóstico de 12 jogos, com imagens Playwright de um livre com voo do GR e de uma reposição. As referências reais são **estimativas**: não há dados públicos por jogo.

| # | Área | Problema medido / no código | Gravidade |
|---|---|---|---|
| 1 | GR: reação | Em 63% dos remates (237 de 374) o gesto de defesa começa antes ou no instante do remate. O GR adivinha em vez de reagir | Alta |
| 2 | GR: deslocação | Fica sempre em cima da linha bola–centro da baliza (erro 0,03 m) e segue a bola 4×/s como um robô. Não faz passos de ajuste antes do remate, não se fixa (posição de espera) nem varia com os atributos (reflexos, saídas, 1x1) | Alta |
| 3 | GR: gestos | Para agarrar, os braços ficam sempre à altura do peito, seja bola rasteira ou alta. Mergulha a remates que vão para fora. Sem "passo lateral + queda" nem defesa com o pé de pé | Média |
| 4 | Remates | A bola sai quase sempre a ~21 m/s (75 km/h, p90 82 km/h). Real: 70-110 km/h, de bico, com o peito do pé ou colocados (estimativa). Não depende do atributo remate nem da distância. A preparação é igual em todos | Alta |
| 5 | Reposição do GR | Duração fixa de 0,6 s seja qual for a distância: p90 34 m/s (impossível à mão). O destino é um colega ao acaso, muitas vezes marcado (p10 a 1,4 m do adversário). Depois de agarrar vai sempre para o mesmo sítio (ala a 9 m). Não há lançamento longo ao pivô, bola rolada curta ao fixo, nem leitura da pressão | Alta |
| 6 | Passes | 20,5% atravessam um adversário; 39% das linhas estão tapadas | Alta |
| 7 | Ritmo sem bola | Só 4% do tempo parados e 28 sprints/min sem bola: movimento constante, sem pausas posicionais | Média |
| 8 | Locomoção | Corrigido: passos de costas e laterais (PR #6) | Feito |

Ordem proposta: 1+2+3 (GR) → 4 (remates) → 5 (reposições) → 6 → 7. Tudo na coreografia/3D: o motor de resultados não muda.

## Correções feitas (1/11/2026, PR #6)
| Área | Antes | Depois |
|---|---|---|
| Corrida | cadência fixa por tempo, coxa ±0,58 rad, tronco rígido | cadência pela distância percorrida (ciclo 1,25 m + 0,32 m por m/s, sem pés a deslizar), joelho alto e coxa até ~0,95 rad a sprintar, braços em oposição com cotovelos a 90°, tronco em contra-rotação, inclinação ao acelerar e nas curvas, passada própria por jogador |
| GR posição | sempre em cima da linha bola–centro, 4 atualizações/s | bissetriz dos postes; profundidade pela distância, pelo ângulo (fechado = junto ao poste) e pelas saídas; reage 0,15 s depois; passos laterais até 4,5 m/s; parado quando está no sítio |
| GR defesa | gesto antes do remate em 63% | gesto 0,08-0,2 s depois do remate (reflexos); técnica pela distância lateral à bola; sem gesto a bolas que vão para fora; agarra à altura da bola; lado do voo fixo pela direção do rematador |
| Remates | ~21 m/s sempre | potentes 22-33 m/s ou colocados 14-22 m/s pelo atributo remate e pela distância (med 72 km/h, p90 111 km/h) |
| Reposições | 0,6 s fixos (até 34 m/s), colega ao acaso | rolada curta ~9 m/s ou lançamento ~15 m/s; colega mais livre; depois de agarrar escolhe entre ala, fixo e lançamento longo pelo espaço (adversário mais próximo med 4,1 → 6,2 m) |

Falta: o gesto do voo do GR (pose), passes por linhas livres, pausas posicionais.

## Enquadramento do GR com a baliza (1/11/2026, feedback do António)
O António viu nas imagens o GR no meio da área a mergulhar com o rematador ao primeiro poste e a baliza aberta. Causa: a "saída ao encontro do atacante" empurrava o GR em frente (eixo da quadra) e não na direção da bola, e também em ataque organizado.

Correção:
- `gkSpot` dá a posição de baliza: bissetriz dos postes, nunca à frente da bola (−0,8 m), sempre entre os postes. Usado no jogo corrido, nos remates e nos livres sem barreira.
- Ângulo fechado: o GR fica no primeiro poste.
- Saída só no 1x1 (contra-ataque ou nenhum defensor no caminho), proporcional à distância.
- Antes do remate o GR coloca-se na posição de baliza.

| No instante do remate (364 remates, 6 jogos) | Antes | Depois |
|---|---|---|
| Distância do GR ao ponto certo, mediana / p90 | 0,62 / 3,88 m | 0,51 / 1,26 m |
| GR à frente do rematador | — | 0 |

## Época completa (1/11/2026)
Os 132 jogos da Liga Placard (2 voltas, todos os confrontos) passaram pela coreografia do 3D, com atributos: 5 292 min de jogo corrido. Ferramenta: `tools/diag/season.ts`; resultados em `diagnostics/epoca.json`. Foram também vistos 12 fotogramas 3D de um Sporting–Braga. Referências reais = estimativas.

| # | Problema | Medido | Referência real (estimativa) | Prioridade |
|---|---|---|---|---|
| 1 | Jogadores atravessam-se (corpos sobrepostos, <0,4 m) | 268 s por jogo: colegas 166 s, adversários 69 s, portador 20 s, GR 15 s | ~0 (encostam, não se atravessam) | Muito alta |
| 2 | Correm demais | 151 m/min por jogador | ~115-120 m/min (estudos de elite) | Alta |
| 3 | Marcação colada a todos (pares 1x1 em todo o campo) | Defensor mais próximo do portador: 1,1 m (mediana) | Zona: bloco compacto, só o portador apertado | Alta |
| 4 | Passes que atravessam adversários | 20,5% | ~0 | Alta |
| 5 | Ações repetitivas: proteções de bola e fintas | 226 proteções e 93 fintas por jogo | Muito menos (estimativa) | Média |
| 6 | Voo do GR parece um salto para cima | Imagens | — | Média |
| 7 | Jogadores fora do campo em jogo corrido | ~2 s por jogo | 0 | Baixa |
| 8 | Árbitro/jogador junto à câmara TV tapa a imagem | Imagens | — | Baixa |

Está bem (manter): GR enquadrado no remate (0,49 m da posição certa); sem saltos de posição; bola nunca solta do portador; distância dos remates (mediana 8,4 m); 83% dos remates com defensor no caminho.

## 5 épocas com táticas sorteadas (2/11/2026)
660 jogos e 26 456 min de jogo corrido, com `tools/diag/seasons.ts --epocas 5`; resultados em `diagnostics/epocas5.json`. Sistemas sorteados: 3-1 297, 2-2 143, 4-0 143, 1-2-1 77.

| Medida (por jogo) | Valor | Leitura |
|---|---|---|
| Saltos de posição (>10 m/s) | 1,2 | Bom (eram 75 durante as correções) |
| Corpos sobrepostos | 16 s | Quase só contacto voluntário; colegas 1 s |
| Jogadores fora da quadra | 0,3 s | Entradas de suplentes |
| Remates acima de 130 km/h | 0,39 | Raro; resta afinar |
| Defesas sem gesto do GR | 0,02 | Bom |
| GR a 0,55 m da posição certa no remate | p90 1,49 m | Bom |
| Jogadores parados >4 s perto da bola | 9,7 | A melhorar |
| GR defensor a mais de 7 m da baliza | 11 s | Sobretudo GR atacante a voltar depois de perder a bola (realista) |
| Ritmo | 135 m/min | Referência real ~115-120 (estimativa); parado 19,5% |
| Golos | 5,7 | Mais baixo por causa das táticas sorteadas (o motor não mudou) |

## Correções depois das 5 épocas (2/11/2026)
| Problema | Antes | Depois (12 jogos de teste) |
|---|---|---|
| Parados >4 s perto da bola | 5,2-9,7 por jogo | 1,7 (`breathe()`: ajuste de ~0,4 m para o lado após 2,2 s imóvel) |
| Remates acima de 130 km/h | 0,4-0,6 por jogo | 0 (limite de alcance dentro de `shot()`; máx. ~110 km/h; +1,5 m de margem no voo) |
| Ritmo | 131-135 m/min | 129 (defensores 121, atacantes 138: as rotações do ataque mantêm-se) |

## Realização TV (2/11/2026, objetivo do António: "parecer que estamos a ver um jogo na TV", como o FM)
A câmara TV (`updateCamera` em `highlight3d.ts`) passou de seguir a bola com zoom fixo a uma realização de transmissão:
- segue o centro do lance (a bola mais os jogadores a menos de 10 m) e antecipa ~0,5 s o movimento da bola;
- o plano tem a largura do lance mais uma margem (15-34 m): fecha quando o jogo se concentra e abre nas transições e nas bolas paradas;
- movimento suavizado no tempo (independente da velocidade do computador);
- o lance fica a meio da imagem também do lado de lá.

As outras câmaras não mudam.

## Aproximação ao futsal real, todos os pontos (2/11/2026, pedido do António)
| Ponto | O que mudou (`choreo.ts`, `player3d.ts`, `highlight3d.ts`, `live.ts`) |
|---|---|
| Decisão por leitura | A escolha da jogada depende de como o adversário defende (individual: bloqueios ×1,9, cortina, paralela; zona: "U", pivô, inversões), da pressão (alta: jogo direto e saída pelo GR; baixa: circulação e 1x1) e da inteligência do portador (decisões+visão: quem lê pior faz mais circulação segura) |
| Identidade dos sistemas (medido, % das jogadas) | 3-1 e 1-2-1: pivô 40-51%, paralela e diagonal; 4-0: passe e corte ~63%, bloqueios 21% contra individual; 2-2: cruzamentos ~50% |
| Ritmo | Construção mais lenta no próprio meio-campo (×1,2), aceleração no último terço (×0,85), lance seguinte rápido depois de uma jogada que ganha espaço; quem decide pior fica mais tempo com a bola |
| Defesa coordenada | Gatilho de pressão: passe para trás faz o bloco subir junto ~1,5 s (exceto bloco baixo); cobertura à zona/mista atrás e por dentro de quem pressiona |
| Física da bola | Passes rasteiros abrandam com o atrito; bolas soltas a rolar abrandam; pequeno ressalto no fim das bolas no ar |
| Animações | Receção orientada (0,3 s); gesto do remate conforme a força (potente/colocado/bico); travagem com o corpo atrás e joelhos fletidos |
| Fadiga visível | Abaixo de ~68 de energia: passada mais curta, tronco curvado, braços caídos (mãos nos joelhos parado). A energia vem do motor (`snapshot`) |

Medido (12 jogos): passes por minuto 30,7 → 31,7; linhas tapadas 36% → 33,5%; passes por dentro de adversários 2,1% → 1,7%; bloco defensivo 7,1 → 6,8 m de largura. Os resultados do motor não mudam (`npm test`). Ritmo 136 m/min, porque a pressão por gatilhos aumenta a corrida dos defensores.

## Auditoria de 2026 — implementação (2/11/2026)
### Inteligência tática (`src/core/tacticalAI.ts`, `coaches.ts`, motor)
- Antes: a IA escolhia 3-1 sempre que havia um pivô com jogo de costas ≥15.
- Agora: avaliação global do plantel (`systemScores`):
  - pivô (jogo de costas, força, finalização);
  - fixo (desarme, posicionamento, passe, visão);
  - alas (drible, aceleração, remate, agilidade);
  - mobilidade técnica e número de universais (4-0);
  - físico e dois homens fortes na frente (2-2).
- A personalidade do treinador soma ±0,6 (`chooseSystem`).
- O adversário também conta: contra individual valoriza o 4-0; contra zona, o pivô e o 1-2-1.
- Durante o jogo (`aiTacticalAdjust`, só equipas da IA, `TeamSetup.ai`):
  - a perder nos últimos 10 min: pressão alta, ritmo rápido e 4-0 se o plantel servir;
  - a ganhar nos últimos 6 min: posse paciente e pressão sem risco.
- Execução no campo, medida na coreografia (% das jogadas):
  - 3-1: pivô ~50%;
  - 4-0: passe e corte ~63%, bloqueios contra individual;
  - 2-2: cruzamentos ~50%;
  - 1-2-1: pivô, paralela e "U".

### Motor (`tools/diag/engine.ts`, 5 épocas PT+ES, 1 860 jogos, `diagnostics/motor-*.json`)
| | Real | Antes | Depois |
|---|---|---|---|
| Golos/jogo | 6,38 | 6,28 | 6,34 |
| Casa / empate / fora | 49,6 / 13,5 / 37,0 | 48,8 / 14,1 / 37,0 | 49,7 / 12,5 / 37,8 |
| Sistemas no início | — | 3-1 93%, 4-0 7% | 3-1 44%, 4-0 31%, 1-2-1 17%, 2-2 8% |

- Vantagem caseira testada: 2,6 dá 48,2% de vitórias em casa; 3,0 dá 49,7%; 3,4 dá 50,5%. Mantém-se 3,0 (o real é 49,6%).
- Campeões: Sporting e Barcelona dominam, coerente com a qualidade dos plantéis.

### Direção (`career.ts`)
- Comentário corrigido (24, não 15).
- Um jogo isolado mexe no máximo ±9 na confiança.
- Despedimento (`shouldSack`) só com: confiança <24, ≥10 jogos, últimos 8 jogos ≤ −4 pontos face ao esperado, e época abaixo de 80% dos pontos esperados.
- `tools/diag/careers.ts`, 3 épocas, 28 clubes: 1, 3 e 5 despedimentos por época (com a regra antiga: 1, 4, 2).

### Jogador–bola (`tools/diag/ball.ts`, 12 jogos)
- Bola contínua entre segmentos (`ballAt`/`segAt`), em vez de saltar.
- Dono só quando a bola chega ao pé (`holderAt`).
- A bola volta ao centro antes do pontapé de saída.
- Passes nunca acima de ~22 m/s (`fixPassSpeeds`).

| | Antes | Depois |
|---|---|---|
| Saltos da bola (instantes) | 3 123 | 1 366 |
| Posse sem contacto | — | 0,56% |
| Passes acima de 22 m/s | 2,9% | 1,35% |
| Bola longe do pé a conduzir | 3,7% | 3,0% |

Desempenho: 30 ms por lance (dilatação em janela deslizante e cache de quem tem a bola).

### Continuação (2/11/2026)
| Ponto | Feito | Medido (12 jogos) |
|---|---|---|
| Transição defensiva (5) | `turnover`: ~2,5 s depois da perda, os 2 mais próximos (1 com bloco baixo) pressionam já a bola, a sprintar; os outros recuam para trás da linha da bola | Jogadores perto da bola aos 3 s: 1,16 → 1,51; avanço de quem recupera em 3 s: 9,0 → 8,0 m; recuo do bloco 8,8 → 7,7 m (os que pressionam ficam à frente) |
| Sem bola (4) | `escapeMarkers`: atacante sem bola colado ao defensor (<1,3 m) desmarca-se ~0,9 m para o espaço e para o lado da bola | Linhas livres 1,83 → 1,95; linhas tapadas 36% → 32% (39% no início da auditoria) |
| GR (6) | Defesa com o pé, de pé (rasteiras a meia distância do corpo), `footsave` | Pose verificada em imagem |
| TV (8) | Repetição automática das grandes defesas (voo, espargata, pé, cruz), 0,45x, vista de trás da baliza | — |
| Bola | Continuidade também no início de passes e voos | Saltos 1 353 → 1 124 (~0,13% do tempo) |

Motor igual (6,34 golos, 49,7/12,5/37,8). Saltos de jogadores 0,3 por jogo. Desempenho: 39 ms por lance.
