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
