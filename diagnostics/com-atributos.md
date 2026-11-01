# Diagnóstico da simulação tática — com-atributos

Semente **base**, 12 jogos, com atributos na coreografia (mesmos confrontos e semente em todas as versões), commit e19727f, 2026-11-01.

| Métrica | com-atributos | atual | Diferença |
|---|---|---|---|
| Minutos de jogo corrido analisados | 481.1 | 481.1 | +0 |
| Largura da equipa com bola (m) | 13.27 | 13.25 | +0.02 |
| Profundidade da equipa com bola (m) | 12.33 | 12.28 | +0.05 |
| Largura da equipa sem bola (m) | 9.51 | 9.52 | -0.01 |
| Profundidade da equipa sem bola (m) | 10.71 | 10.66 | +0.05 |
| Distância média entre colegas com bola (m) | 10.7 | 10.67 | +0.03 |
| Distância ao colega mais próximo com bola (m) | 7.75 | 7.71 | +0.04 |
| Distância média entre colegas sem bola (m) | 8.5 | 8.48 | +0.02 |
| Defensor → atacante mais próximo (m) | 2.56 | 2.55 | +0.01 |
| Portador → defensor mais próximo (m) | 1.62 | 1.6 | +0.02 |
| Linhas de passe livres por instante | 1.73 | 1.74 | -0.01 |
| Linhas de passe obstruídas (%) | 39.3 | 39.1 | +0.2 |
| Passes por minuto de jogo corrido | 30.5 | 30.9 | -0.4 |
| Passes que atravessam um adversário (%) | 20.8 | 20.5 | +0.3 |
| Tempo parado, jogadores com bola (%) | 4.3 | 4.3 | +0 |
| Tempo parado, jogadores sem bola (%) | 3.9 | 3.9 | +0 |
| Maior período seguido parado (s, média) | 0.44 | 0.44 | +0 |
| Desmarcações explícitas da coreografia (por min) | 17.6 | 17.7 | -0.1 |
| Sprints sem bola (por min) | 28.2 | 28.5 | -0.3 |
| Rotações / trocas de posição (por min) | 29.7 | 29.7 | +0 |
| Movimentos de apoio ao portador (por min) | 9.9 | 10.2 | -0.3 |
| Transições analisadas (perdas em jogo corrido) | 458 | 458 | +0 |
| Pós-perda: jogadores perto da bola logo (n.º) | 0.67 | 0.63 | +0.04 |
| Pós-perda: jogadores perto da bola aos 3 s (n.º) | 1.12 | 1.1 | +0.02 |
| Pós-perda: recuo do bloco em 3 s (m) | 9.34 | 9.17 | +0.17 |
| Pós-recuperação: avanço da bola em 3 s (m) | 9.02 | 9.27 | -0.25 |
| Pós-recuperação: jogadores a atacar o espaço no 1.º s (n.º) | 2.15 | 2.1 | +0.05 |

## Por jogo
| Jogo | Resultado | Largura c/ bola | Linhas livres | Obstruídas % | Passes/min | Atravessam % | Parado c/ bola % |
|---|---|---|---|---|---|---|---|
| slb-scp | 0-1 | 13.1 | 1.69 | 40.1 | 29.2 | 22.9 | 4.2 |
| scb-fun | 3-1 | 12.92 | 1.7 | 40.4 | 31.2 | 21.3 | 4.4 |
| lps-tor | 3-4 | 14.06 | 1.79 | 38.5 | 32.7 | 22.7 | 4.8 |
| rav-uvn | 3-6 | 13.53 | 1.69 | 41.8 | 32.7 | 19.2 | 4.2 |
| por-fam | 9-4 | 13.79 | 1.67 | 41.2 | 31.9 | 23.3 | 4.1 |
| ele-fzz | 2-1 | 13.01 | 1.67 | 40.7 | 31.7 | 22.3 | 4.6 |
| bar-epz | 6-4 | 13.11 | 1.73 | 39.5 | 25 | 20.9 | 4.5 |
| jca-pal | 3-1 | 13.25 | 1.9 | 32.6 | 25 | 14.4 | 4.7 |
| int-jae | 6-2 | 13.16 | 1.67 | 41.1 | 29.1 | 22.6 | 4.3 |
| val-man | 5-1 | 12.47 | 1.71 | 39.4 | 31.8 | 20.2 | 3.5 |
| zar-pen | 0-3 | 13.21 | 1.72 | 39.9 | 33.4 | 20.7 | 4.2 |
| par-noi | 4-7 | 13.67 | 1.81 | 38.2 | 32.6 | 18 | 4.4 |

Definições: {"stillSpeed":0.3,"lineMin":2,"lineMax":16,"blockR":0.9,"ballHitR":0.5,"ballLowZ":1,"sprint":4,"swapHyst":1,"supportGain":2,"supportMin":3,"supportMax":8,"transWin":3,"pressR":4}