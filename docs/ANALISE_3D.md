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
