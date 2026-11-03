# Diagnóstico da simulação tática — ia-tatica

Semente **base**, 12 jogos (mesmos confrontos e semente em todas as versões), commit 6410164, 2026-11-03.

| Métrica | ia-tatica | main-antes | Diferença |
|---|---|---|---|
| Minutos de jogo corrido analisados | 481.1 | 481.2 | -0.1 |
| Largura da equipa com bola (m) | 13.42 | 13.41 | +0.01 |
| Profundidade da equipa com bola (m) | 11.17 | 10.94 | +0.23 |
| Largura da equipa sem bola (m) | 7.81 | 7.22 | +0.59 |
| Profundidade da equipa sem bola (m) | 9.12 | 9.52 | -0.4 |
| Distância média entre colegas com bola (m) | 10.63 | 10.54 | +0.09 |
| Distância ao colega mais próximo com bola (m) | 7.75 | 7.65 | +0.1 |
| Distância média entre colegas sem bola (m) | 7.3 | 7.28 | +0.02 |
| Defensor → atacante mais próximo (m) | 2.97 | 3.11 | -0.14 |
| Portador → defensor mais próximo (m) | 1.91 | 2.03 | -0.12 |
| Linhas de passe livres por instante | 1.95 | 2 | -0.05 |
| Linhas de passe obstruídas (%) | 33.8 | 30.8 | +3 |
| Passes por minuto de jogo corrido | 32.1 | 31.8 | +0.3 |
| Passes que atravessam um adversário (%) | 2 | 1.9 | +0.1 |
| Tempo parado, jogadores com bola (%) | 9 | 9.3 | -0.3 |
| Tempo parado, jogadores sem bola (%) | 5.7 | 6.1 | -0.4 |
| Maior período seguido parado (s, média) | 0.81 | 0.85 | -0.04 |
| Desmarcações explícitas da coreografia (por min) | 14.7 | 14.6 | +0.1 |
| Sprints sem bola (por min) | 28.8 | 28.3 | +0.5 |
| Rotações / trocas de posição (por min) | 33.4 | 31.2 | +2.2 |
| Movimentos de apoio ao portador (por min) | 10.4 | 11 | -0.6 |
| Transições analisadas (perdas em jogo corrido) | 453 | 462 | -9 |
| Pós-perda: jogadores perto da bola logo (n.º) | 0.67 | 0.59 | +0.08 |
| Pós-perda: jogadores perto da bola aos 3 s (n.º) | 1.28 | 1.56 | -0.28 |
| Pós-perda: recuo do bloco em 3 s (m) | 8.15 | 7.53 | +0.62 |
| Pós-recuperação: avanço da bola em 3 s (m) | 7.5 | 7.79 | -0.29 |
| Pós-recuperação: jogadores a atacar o espaço no 1.º s (n.º) | 1.84 | 1.78 | +0.06 |

## Por jogo
| Jogo | Resultado | Largura c/ bola | Linhas livres | Obstruídas % | Passes/min | Atravessam % | Parado c/ bola % |
|---|---|---|---|---|---|---|---|
| slb-scp | 4-0 | 13.88 | 1.96 | 33.5 | 31.5 | 1 | 9.3 |
| scb-fun | 3-4 | 13.49 | 1.89 | 35 | 32.8 | 2.5 | 8.6 |
| lps-tor | 3-2 | 13.44 | 1.9 | 35.8 | 32.4 | 2.2 | 8.6 |
| rav-uvn | 6-3 | 14.27 | 2.3 | 22.7 | 33.7 | 0.8 | 9.3 |
| por-fam | 3-10 | 14.32 | 2.17 | 25.9 | 30.9 | 1.8 | 8.2 |
| ele-fzz | 1-3 | 14.02 | 1.88 | 36.4 | 32.8 | 2.6 | 9.7 |
| bar-epz | 5-1 | 13.43 | 1.84 | 37 | 30.7 | 2.1 | 9.7 |
| jca-pal | 2-5 | 13.72 | 1.89 | 35.1 | 30.3 | 1.7 | 10 |
| int-jae | 5-6 | 12.97 | 1.68 | 42.3 | 31.3 | 2.8 | 8.3 |
| val-man | 5-1 | 12.43 | 2.03 | 30.7 | 32 | 2.3 | 8.3 |
| zar-pen | 1-2 | 12.87 | 1.76 | 40.1 | 32.7 | 2.8 | 9.6 |
| par-noi | 4-2 | 12.25 | 2.08 | 30.5 | 33.8 | 1.8 | 9.3 |

Definições: {"stillSpeed":0.3,"lineMin":2,"lineMax":16,"blockR":0.9,"ballHitR":0.5,"ballLowZ":1,"sprint":4,"swapHyst":1,"supportGain":2,"supportMin":3,"supportMax":8,"transWin":3,"pressR":4}