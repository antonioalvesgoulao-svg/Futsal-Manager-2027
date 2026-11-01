# Diagnóstico da simulação tática — com-atributos

Semente **base**, 12 jogos, com atributos na coreografia (mesmos confrontos e semente em todas as versões), commit 7fb634c, 2026-11-01.

| Métrica | com-atributos | atual | Diferença |
|---|---|---|---|
| Minutos de jogo corrido analisados | 481.1 | 481.1 | +0 |
| Largura da equipa com bola (m) | 13.24 | 13.25 | -0.01 |
| Profundidade da equipa com bola (m) | 12.3 | 12.28 | +0.02 |
| Largura da equipa sem bola (m) | 9.52 | 9.52 | +0 |
| Profundidade da equipa sem bola (m) | 10.68 | 10.66 | +0.02 |
| Distância média entre colegas com bola (m) | 10.68 | 10.67 | +0.01 |
| Distância ao colega mais próximo com bola (m) | 7.72 | 7.71 | +0.01 |
| Distância média entre colegas sem bola (m) | 8.49 | 8.48 | +0.01 |
| Defensor → atacante mais próximo (m) | 2.55 | 2.55 | +0 |
| Portador → defensor mais próximo (m) | 1.6 | 1.6 | +0 |
| Linhas de passe livres por instante | 1.73 | 1.74 | -0.01 |
| Linhas de passe obstruídas (%) | 39.3 | 39.1 | +0.2 |
| Passes por minuto de jogo corrido | 30.9 | 30.9 | +0 |
| Passes que atravessam um adversário (%) | 20.5 | 20.5 | +0 |
| Tempo parado, jogadores com bola (%) | 4.3 | 4.3 | +0 |
| Tempo parado, jogadores sem bola (%) | 3.9 | 3.9 | +0 |
| Maior período seguido parado (s, média) | 0.44 | 0.44 | +0 |
| Desmarcações explícitas da coreografia (por min) | 17.7 | 17.7 | +0 |
| Sprints sem bola (por min) | 28.5 | 28.5 | +0 |
| Rotações / trocas de posição (por min) | 29.6 | 29.7 | -0.1 |
| Movimentos de apoio ao portador (por min) | 10.1 | 10.2 | -0.1 |
| Transições analisadas (perdas em jogo corrido) | 458 | 458 | +0 |
| Pós-perda: jogadores perto da bola logo (n.º) | 0.61 | 0.63 | -0.02 |
| Pós-perda: jogadores perto da bola aos 3 s (n.º) | 1.07 | 1.1 | -0.03 |
| Pós-perda: recuo do bloco em 3 s (m) | 9.28 | 9.17 | +0.11 |
| Pós-recuperação: avanço da bola em 3 s (m) | 9.34 | 9.27 | +0.07 |
| Pós-recuperação: jogadores a atacar o espaço no 1.º s (n.º) | 2.1 | 2.1 | +0 |

## Por jogo
| Jogo | Resultado | Largura c/ bola | Linhas livres | Obstruídas % | Passes/min | Atravessam % | Parado c/ bola % |
|---|---|---|---|---|---|---|---|
| slb-scp | 0-1 | 12.82 | 1.67 | 41 | 29.8 | 22.7 | 4.4 |
| scb-fun | 3-1 | 12.92 | 1.71 | 40.1 | 31.5 | 20.6 | 4.3 |
| lps-tor | 3-4 | 13.9 | 1.78 | 39.1 | 33.5 | 21.6 | 4.8 |
| rav-uvn | 3-6 | 13.63 | 1.7 | 41.2 | 33.2 | 18.8 | 4.1 |
| por-fam | 9-4 | 13.79 | 1.71 | 40 | 32.3 | 21.8 | 3.8 |
| ele-fzz | 2-1 | 12.86 | 1.66 | 40.9 | 32.2 | 22.6 | 4.5 |
| bar-epz | 6-4 | 12.98 | 1.71 | 39.9 | 25.3 | 22.1 | 4.6 |
| jca-pal | 3-1 | 13.16 | 1.91 | 33 | 25.2 | 14.8 | 4.6 |
| int-jae | 6-2 | 13.08 | 1.7 | 39.6 | 29.6 | 20.8 | 4.3 |
| val-man | 5-1 | 12.56 | 1.72 | 39 | 32.2 | 19.9 | 3.7 |
| zar-pen | 0-3 | 13.45 | 1.7 | 40.7 | 33.5 | 20.4 | 4.3 |
| par-noi | 4-7 | 13.77 | 1.81 | 38.4 | 33 | 19 | 4.4 |

Definições: {"stillSpeed":0.3,"lineMin":2,"lineMax":16,"blockR":0.9,"ballHitR":0.5,"ballLowZ":1,"sprint":4,"swapHyst":1,"supportGain":2,"supportMin":3,"supportMax":8,"transWin":3,"pressR":4}