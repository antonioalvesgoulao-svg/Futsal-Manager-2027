# Diagnóstico da simulação tática — t

Semente **base**, 12 jogos, com atributos na coreografia (mesmos confrontos e semente em todas as versões), commit 95dae93, 2026-11-02.

| Métrica | t | com-atributos | Diferença |
|---|---|---|---|
| Minutos de jogo corrido analisados | 481.1 | 481.1 | +0 |
| Largura da equipa com bola (m) | 13.2 | 13.16 | +0.04 |
| Profundidade da equipa com bola (m) | 12.15 | 12.24 | -0.09 |
| Largura da equipa sem bola (m) | 6.84 | 7.1 | -0.26 |
| Profundidade da equipa sem bola (m) | 10.29 | 10.56 | -0.27 |
| Distância média entre colegas com bola (m) | 10.61 | 10.62 | -0.01 |
| Distância ao colega mais próximo com bola (m) | 7.71 | 7.73 | -0.02 |
| Distância média entre colegas sem bola (m) | 7.33 | 7.53 | -0.2 |
| Defensor → atacante mais próximo (m) | 2.92 | 3.11 | -0.19 |
| Portador → defensor mais próximo (m) | 2.11 | 1.98 | +0.13 |
| Linhas de passe livres por instante | 1.91 | 1.83 | +0.08 |
| Linhas de passe obstruídas (%) | 33.5 | 36.1 | -2.6 |
| Passes por minuto de jogo corrido | 31.7 | 30.7 | +1 |
| Passes que atravessam um adversário (%) | 1.7 | 2.1 | -0.4 |
| Tempo parado, jogadores com bola (%) | 11.9 | 12.1 | -0.2 |
| Tempo parado, jogadores sem bola (%) | 8.1 | 14.3 | -6.2 |
| Maior período seguido parado (s, média) | 1.09 | 1.42 | -0.33 |
| Desmarcações explícitas da coreografia (por min) | 17.5 | 15.7 | +1.8 |
| Sprints sem bola (por min) | 27.1 | 26.2 | +0.9 |
| Rotações / trocas de posição (por min) | 24.4 | 24.1 | +0.3 |
| Movimentos de apoio ao portador (por min) | 10.6 | 10.8 | -0.2 |
| Transições analisadas (perdas em jogo corrido) | 458 | 458 | +0 |
| Pós-perda: jogadores perto da bola logo (n.º) | 0.67 | 0.71 | -0.04 |
| Pós-perda: jogadores perto da bola aos 3 s (n.º) | 1.17 | 1.16 | +0.01 |
| Pós-perda: recuo do bloco em 3 s (m) | 8.61 | 8.75 | -0.14 |
| Pós-recuperação: avanço da bola em 3 s (m) | 8.37 | 9.02 | -0.65 |
| Pós-recuperação: jogadores a atacar o espaço no 1.º s (n.º) | 1.94 | 2.05 | -0.11 |

## Por jogo
| Jogo | Resultado | Largura c/ bola | Linhas livres | Obstruídas % | Passes/min | Atravessam % | Parado c/ bola % |
|---|---|---|---|---|---|---|---|
| slb-scp | 0-1 | 12.37 | 1.92 | 32.1 | 31.8 | 1.8 | 13.1 |
| scb-fun | 3-1 | 12.96 | 1.89 | 34.3 | 32.6 | 1.3 | 12.3 |
| lps-tor | 3-4 | 14.2 | 1.84 | 36.9 | 31 | 2 | 11.4 |
| rav-uvn | 3-6 | 13.19 | 1.78 | 38.9 | 32.5 | 1.2 | 12 |
| por-fam | 9-4 | 13.47 | 1.79 | 37 | 30.6 | 1.7 | 10.9 |
| ele-fzz | 2-1 | 12.87 | 1.87 | 33.9 | 32.8 | 1.7 | 12.5 |
| bar-epz | 6-4 | 12.76 | 1.92 | 33.2 | 29.8 | 2.1 | 14 |
| jca-pal | 3-1 | 13.39 | 1.99 | 31.4 | 29.5 | 1.5 | 12.1 |
| int-jae | 6-2 | 13.17 | 1.93 | 31.7 | 31.3 | 2.5 | 11.8 |
| val-man | 5-1 | 13.2 | 2 | 30.2 | 33.1 | 1.5 | 10.9 |
| zar-pen | 0-3 | 13.14 | 1.92 | 33.7 | 33.1 | 2 | 11.1 |
| par-noi | 4-7 | 13.63 | 2.06 | 29.9 | 32.6 | 1.8 | 11.9 |

Definições: {"stillSpeed":0.3,"lineMin":2,"lineMax":16,"blockR":0.9,"ballHitR":0.5,"ballLowZ":1,"sprint":4,"swapHyst":1,"supportGain":2,"supportMin":3,"supportMax":8,"transWin":3,"pressR":4}