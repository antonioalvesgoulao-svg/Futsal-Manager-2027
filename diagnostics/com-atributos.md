# Diagnóstico da simulação tática — com-atributos

Semente **base**, 12 jogos, com atributos na coreografia (mesmos confrontos e semente em todas as versões), commit 3942fae, 2026-11-01.

| Métrica | com-atributos | sem-attr | Diferença |
|---|---|---|---|
| Minutos de jogo corrido analisados | 481.1 | 481.1 | +0 |
| Largura da equipa com bola (m) | 13.25 | 13.25 | +0 |
| Profundidade da equipa com bola (m) | 12.28 | 12.28 | +0 |
| Largura da equipa sem bola (m) | 9.53 | 9.52 | +0.01 |
| Profundidade da equipa sem bola (m) | 10.66 | 10.66 | +0 |
| Distância média entre colegas com bola (m) | 10.67 | 10.67 | +0 |
| Distância ao colega mais próximo com bola (m) | 7.72 | 7.71 | +0.01 |
| Distância média entre colegas sem bola (m) | 8.49 | 8.48 | +0.01 |
| Defensor → atacante mais próximo (m) | 2.55 | 2.55 | +0 |
| Portador → defensor mais próximo (m) | 1.6 | 1.6 | +0 |
| Linhas de passe livres por instante | 1.74 | 1.74 | +0 |
| Linhas de passe obstruídas (%) | 39.2 | 39.1 | +0.1 |
| Passes por minuto de jogo corrido | 30.9 | 30.9 | +0 |
| Passes que atravessam um adversário (%) | 20.6 | 20.5 | +0.1 |
| Tempo parado, jogadores com bola (%) | 4.3 | 4.3 | +0 |
| Tempo parado, jogadores sem bola (%) | 3.9 | 3.9 | +0 |
| Maior período seguido parado (s, média) | 0.44 | 0.44 | +0 |
| Desmarcações explícitas da coreografia (por min) | 17.7 | 17.7 | +0 |
| Sprints sem bola (por min) | 28.5 | 28.5 | +0 |
| Rotações / trocas de posição (por min) | 29.7 | 29.7 | +0 |
| Movimentos de apoio ao portador (por min) | 10.2 | 10.2 | +0 |
| Transições analisadas (perdas em jogo corrido) | 458 | 458 | +0 |
| Pós-perda: jogadores perto da bola logo (n.º) | 0.63 | 0.63 | +0 |
| Pós-perda: jogadores perto da bola aos 3 s (n.º) | 1.11 | 1.1 | +0.01 |
| Pós-perda: recuo do bloco em 3 s (m) | 9.2 | 9.17 | +0.03 |
| Pós-recuperação: avanço da bola em 3 s (m) | 9.29 | 9.27 | +0.02 |
| Pós-recuperação: jogadores a atacar o espaço no 1.º s (n.º) | 2.09 | 2.1 | -0.01 |

## Por jogo
| Jogo | Resultado | Largura c/ bola | Linhas livres | Obstruídas % | Passes/min | Atravessam % | Parado c/ bola % |
|---|---|---|---|---|---|---|---|
| slb-scp | 0-1 | 12.9 | 1.67 | 40.6 | 29.5 | 21.8 | 4.4 |
| scb-fun | 3-1 | 13.04 | 1.71 | 40 | 31.5 | 21.2 | 4.2 |
| lps-tor | 3-4 | 13.92 | 1.79 | 38.6 | 33.5 | 20.6 | 4.9 |
| rav-uvn | 3-6 | 13.61 | 1.71 | 40.9 | 33 | 18.6 | 4.1 |
| por-fam | 9-4 | 13.78 | 1.71 | 39.9 | 32.3 | 22.5 | 3.9 |
| ele-fzz | 2-1 | 12.84 | 1.69 | 40 | 32.3 | 22.8 | 4.5 |
| bar-epz | 6-4 | 12.98 | 1.71 | 39.9 | 25.3 | 22 | 4.5 |
| jca-pal | 3-1 | 13.18 | 1.9 | 33.1 | 25.1 | 14.4 | 4.6 |
| int-jae | 6-2 | 13.19 | 1.69 | 39.9 | 29.7 | 20.8 | 4.3 |
| val-man | 5-1 | 12.41 | 1.71 | 39.3 | 32 | 21.2 | 3.7 |
| zar-pen | 0-3 | 13.46 | 1.72 | 40 | 33.4 | 20.4 | 4.3 |
| par-noi | 4-7 | 13.75 | 1.79 | 38.8 | 33 | 19.7 | 4.4 |

Definições: {"stillSpeed":0.3,"lineMin":2,"lineMax":16,"blockR":0.9,"ballHitR":0.5,"ballLowZ":1,"sprint":4,"swapHyst":1,"supportGain":2,"supportMin":3,"supportMax":8,"transWin":3,"pressR":4}