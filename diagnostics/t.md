# Diagnóstico da simulação tática — t

Semente **base**, 12 jogos, com atributos na coreografia (mesmos confrontos e semente em todas as versões), commit 3ddf3bc, 2026-11-01.

| Métrica | t | com-atributos | Diferença |
|---|---|---|---|
| Minutos de jogo corrido analisados | 481.1 | 481.1 | +0 |
| Largura da equipa com bola (m) | 13.14 | 13.3 | -0.16 |
| Profundidade da equipa com bola (m) | 12.26 | 12.33 | -0.07 |
| Largura da equipa sem bola (m) | 7.08 | 9.53 | -2.45 |
| Profundidade da equipa sem bola (m) | 10.66 | 10.71 | -0.05 |
| Distância média entre colegas com bola (m) | 10.61 | 10.71 | -0.1 |
| Distância ao colega mais próximo com bola (m) | 7.72 | 7.76 | -0.04 |
| Distância média entre colegas sem bola (m) | 7.57 | 8.51 | -0.94 |
| Defensor → atacante mais próximo (m) | 3.13 | 2.56 | +0.57 |
| Portador → defensor mais próximo (m) | 1.87 | 1.62 | +0.25 |
| Linhas de passe livres por instante | 1.79 | 1.73 | +0.06 |
| Linhas de passe obstruídas (%) | 37.2 | 39.3 | -2.1 |
| Passes por minuto de jogo corrido | 30.6 | 30.5 | +0.1 |
| Passes que atravessam um adversário (%) | 2.3 | 20.7 | -18.4 |
| Tempo parado, jogadores com bola (%) | 8.5 | 4.3 | +4.2 |
| Tempo parado, jogadores sem bola (%) | 9.9 | 3.9 | +6 |
| Maior período seguido parado (s, média) | 0.9 | 0.44 | +0.46 |
| Desmarcações explícitas da coreografia (por min) | 16.4 | 17.6 | -1.2 |
| Sprints sem bola (por min) | 26.3 | 28.2 | -1.9 |
| Rotações / trocas de posição (por min) | 25.6 | 29.8 | -4.2 |
| Movimentos de apoio ao portador (por min) | 10.6 | 9.8 | +0.8 |
| Transições analisadas (perdas em jogo corrido) | 458 | 458 | +0 |
| Pós-perda: jogadores perto da bola logo (n.º) | 0.67 | 0.66 | +0.01 |
| Pós-perda: jogadores perto da bola aos 3 s (n.º) | 1.19 | 1.12 | +0.07 |
| Pós-perda: recuo do bloco em 3 s (m) | 9.26 | 9.3 | -0.04 |
| Pós-recuperação: avanço da bola em 3 s (m) | 9.47 | 9.01 | +0.46 |
| Pós-recuperação: jogadores a atacar o espaço no 1.º s (n.º) | 2.11 | 2.15 | -0.04 |

## Por jogo
| Jogo | Resultado | Largura c/ bola | Linhas livres | Obstruídas % | Passes/min | Atravessam % | Parado c/ bola % |
|---|---|---|---|---|---|---|---|
| slb-scp | 0-1 | 12.83 | 1.83 | 35.5 | 29.9 | 2.2 | 9.5 |
| scb-fun | 3-1 | 12.61 | 1.74 | 38.7 | 30.8 | 2.5 | 8.7 |
| lps-tor | 3-4 | 14.08 | 1.8 | 38.2 | 32.4 | 1.5 | 7.7 |
| rav-uvn | 3-6 | 13.45 | 1.7 | 41.9 | 32.4 | 1.5 | 7.7 |
| por-fam | 9-4 | 13.62 | 1.72 | 39.6 | 31.7 | 1.8 | 7.2 |
| ele-fzz | 2-1 | 12.76 | 1.72 | 38.4 | 31.5 | 3.3 | 8.9 |
| bar-epz | 6-4 | 12.61 | 1.81 | 36 | 24.8 | 2 | 10.7 |
| jca-pal | 3-1 | 13.14 | 1.84 | 35.2 | 25.5 | 2 | 10.3 |
| int-jae | 6-2 | 13.02 | 1.81 | 36.4 | 29.2 | 2.1 | 8.8 |
| val-man | 5-1 | 12.7 | 1.82 | 35.8 | 32.2 | 2.7 | 7.9 |
| zar-pen | 0-3 | 13.26 | 1.81 | 36.8 | 33.5 | 2.5 | 7.8 |
| par-noi | 4-7 | 13.63 | 1.89 | 35.7 | 32.9 | 3 | 8.1 |

Definições: {"stillSpeed":0.3,"lineMin":2,"lineMax":16,"blockR":0.9,"ballHitR":0.5,"ballLowZ":1,"sprint":4,"swapHyst":1,"supportGain":2,"supportMin":3,"supportMax":8,"transWin":3,"pressR":4}