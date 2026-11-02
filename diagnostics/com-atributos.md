# Diagnóstico da simulação tática — com-atributos

Semente **base**, 12 jogos, com atributos na coreografia (mesmos confrontos e semente em todas as versões), commit 3ddf3bc, 2026-11-02.

| Métrica | com-atributos | atual | Diferença |
|---|---|---|---|
| Minutos de jogo corrido analisados | 481.1 | 481.1 | +0 |
| Largura da equipa com bola (m) | 13.16 | 13.25 | -0.09 |
| Profundidade da equipa com bola (m) | 12.24 | 12.28 | -0.04 |
| Largura da equipa sem bola (m) | 7.1 | 9.52 | -2.42 |
| Profundidade da equipa sem bola (m) | 10.56 | 10.66 | -0.1 |
| Distância média entre colegas com bola (m) | 10.62 | 10.67 | -0.05 |
| Distância ao colega mais próximo com bola (m) | 7.73 | 7.71 | +0.02 |
| Distância média entre colegas sem bola (m) | 7.53 | 8.48 | -0.95 |
| Defensor → atacante mais próximo (m) | 3.11 | 2.55 | +0.56 |
| Portador → defensor mais próximo (m) | 1.98 | 1.6 | +0.38 |
| Linhas de passe livres por instante | 1.83 | 1.74 | +0.09 |
| Linhas de passe obstruídas (%) | 36.1 | 39.1 | -3 |
| Passes por minuto de jogo corrido | 30.7 | 30.9 | -0.2 |
| Passes que atravessam um adversário (%) | 2.1 | 20.5 | -18.4 |
| Tempo parado, jogadores com bola (%) | 12.1 | 4.3 | +7.8 |
| Tempo parado, jogadores sem bola (%) | 14.3 | 3.9 | +10.4 |
| Maior período seguido parado (s, média) | 1.42 | 0.44 | +0.98 |
| Desmarcações explícitas da coreografia (por min) | 15.7 | 17.7 | -2 |
| Sprints sem bola (por min) | 26.2 | 28.5 | -2.3 |
| Rotações / trocas de posição (por min) | 24.1 | 29.7 | -5.6 |
| Movimentos de apoio ao portador (por min) | 10.8 | 10.2 | +0.6 |
| Transições analisadas (perdas em jogo corrido) | 458 | 458 | +0 |
| Pós-perda: jogadores perto da bola logo (n.º) | 0.71 | 0.63 | +0.08 |
| Pós-perda: jogadores perto da bola aos 3 s (n.º) | 1.16 | 1.1 | +0.06 |
| Pós-perda: recuo do bloco em 3 s (m) | 8.75 | 9.17 | -0.42 |
| Pós-recuperação: avanço da bola em 3 s (m) | 9.02 | 9.27 | -0.25 |
| Pós-recuperação: jogadores a atacar o espaço no 1.º s (n.º) | 2.05 | 2.1 | -0.05 |

## Por jogo
| Jogo | Resultado | Largura c/ bola | Linhas livres | Obstruídas % | Passes/min | Atravessam % | Parado c/ bola % |
|---|---|---|---|---|---|---|---|
| slb-scp | 0-1 | 12.58 | 1.79 | 36.6 | 29.7 | 2.3 | 13.6 |
| scb-fun | 3-1 | 12.71 | 1.79 | 37.1 | 31.4 | 2.7 | 12.6 |
| lps-tor | 3-4 | 14.14 | 1.83 | 37.3 | 32.3 | 1.2 | 11.4 |
| rav-uvn | 3-6 | 13.3 | 1.73 | 40.8 | 33.1 | 1.5 | 11 |
| por-fam | 9-4 | 13.62 | 1.82 | 35.9 | 31.7 | 1.9 | 10.7 |
| ele-fzz | 2-1 | 13.07 | 1.77 | 36.5 | 31.9 | 2.8 | 12.2 |
| bar-epz | 6-4 | 12.48 | 1.81 | 36.5 | 25.3 | 2 | 15.5 |
| jca-pal | 3-1 | 13.18 | 1.93 | 32.3 | 25.6 | 1.9 | 14 |
| int-jae | 6-2 | 12.98 | 1.8 | 36.5 | 29.1 | 2.1 | 11.9 |
| val-man | 5-1 | 12.61 | 1.87 | 35 | 32.2 | 2.6 | 10.8 |
| zar-pen | 0-3 | 13.29 | 1.78 | 38 | 33.9 | 2.6 | 11.7 |
| par-noi | 4-7 | 13.97 | 2 | 32.2 | 32.5 | 2.1 | 11.6 |

Definições: {"stillSpeed":0.3,"lineMin":2,"lineMax":16,"blockR":0.9,"ballHitR":0.5,"ballLowZ":1,"sprint":4,"swapHyst":1,"supportGain":2,"supportMin":3,"supportMax":8,"transWin":3,"pressR":4}