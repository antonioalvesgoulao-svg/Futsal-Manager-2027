# Diagnóstico da simulação tática — t

Semente **base**, 12 jogos, com atributos na coreografia (mesmos confrontos e semente em todas as versões), commit 3caecc2, 2026-11-02.

| Métrica | t | com-atributos | Diferença |
|---|---|---|---|
| Minutos de jogo corrido analisados | 481.2 | 481.1 | +0.1 |
| Largura da equipa com bola (m) | 13.32 | 13.16 | +0.16 |
| Profundidade da equipa com bola (m) | 10.89 | 12.24 | -1.35 |
| Largura da equipa sem bola (m) | 7.19 | 7.1 | +0.09 |
| Profundidade da equipa sem bola (m) | 9.47 | 10.56 | -1.09 |
| Distância média entre colegas com bola (m) | 10.48 | 10.62 | -0.14 |
| Distância ao colega mais próximo com bola (m) | 7.57 | 7.73 | -0.16 |
| Distância média entre colegas sem bola (m) | 7.25 | 7.53 | -0.28 |
| Defensor → atacante mais próximo (m) | 3.1 | 3.11 | -0.01 |
| Portador → defensor mais próximo (m) | 1.96 | 1.98 | -0.02 |
| Linhas de passe livres por instante | 1.95 | 1.83 | +0.12 |
| Linhas de passe obstruídas (%) | 31.9 | 36.1 | -4.2 |
| Passes por minuto de jogo corrido | 31.2 | 30.7 | +0.5 |
| Passes que atravessam um adversário (%) | 2.2 | 2.1 | +0.1 |
| Tempo parado, jogadores com bola (%) | 10.6 | 12.1 | -1.5 |
| Tempo parado, jogadores sem bola (%) | 7.5 | 14.3 | -6.8 |
| Maior período seguido parado (s, média) | 0.96 | 1.42 | -0.46 |
| Desmarcações explícitas da coreografia (por min) | 14.5 | 15.7 | -1.2 |
| Sprints sem bola (por min) | 27.5 | 26.2 | +1.3 |
| Rotações / trocas de posição (por min) | 28.5 | 24.1 | +4.4 |
| Movimentos de apoio ao portador (por min) | 10.5 | 10.8 | -0.3 |
| Transições analisadas (perdas em jogo corrido) | 462 | 458 | +4 |
| Pós-perda: jogadores perto da bola logo (n.º) | 0.65 | 0.71 | -0.06 |
| Pós-perda: jogadores perto da bola aos 3 s (n.º) | 1.52 | 1.16 | +0.36 |
| Pós-perda: recuo do bloco em 3 s (m) | 7.68 | 8.75 | -1.07 |
| Pós-recuperação: avanço da bola em 3 s (m) | 7.92 | 9.02 | -1.1 |
| Pós-recuperação: jogadores a atacar o espaço no 1.º s (n.º) | 1.71 | 2.05 | -0.34 |

## Por jogo
| Jogo | Resultado | Largura c/ bola | Linhas livres | Obstruídas % | Passes/min | Atravessam % | Parado c/ bola % |
|---|---|---|---|---|---|---|---|
| slb-scp | 2-2 | 13.74 | 1.94 | 31.9 | 30.6 | 1.5 | 11 |
| scb-fun | 10-2 | 13.95 | 2 | 30.2 | 32.5 | 2.5 | 9.9 |
| lps-tor | 6-1 | 13.01 | 1.94 | 32.7 | 31.6 | 2.2 | 12.4 |
| rav-uvn | 6-2 | 14.33 | 2.27 | 22.4 | 32.5 | 1.2 | 9.8 |
| por-fam | 6-6 | 14.27 | 2.09 | 26.7 | 30.8 | 2.3 | 8.6 |
| ele-fzz | 4-0 | 13.67 | 1.88 | 34.7 | 32 | 1.4 | 10.8 |
| bar-epz | 2-2 | 13.49 | 1.8 | 35.6 | 29.2 | 2.1 | 12.1 |
| jca-pal | 2-3 | 13.25 | 1.89 | 33.3 | 30.6 | 2.4 | 11.1 |
| int-jae | 4-2 | 12.54 | 1.74 | 38.6 | 30.7 | 3.8 | 10.6 |
| val-man | 3-2 | 12.5 | 2 | 30.8 | 31.3 | 2.5 | 9.2 |
| zar-pen | 2-4 | 12.79 | 1.86 | 34.9 | 30.9 | 2.2 | 12.4 |
| par-noi | 1-4 | 12.35 | 2.05 | 29.5 | 32 | 2 | 10.5 |

Definições: {"stillSpeed":0.3,"lineMin":2,"lineMax":16,"blockR":0.9,"ballHitR":0.5,"ballLowZ":1,"sprint":4,"swapHyst":1,"supportGain":2,"supportMin":3,"supportMax":8,"transWin":3,"pressR":4}