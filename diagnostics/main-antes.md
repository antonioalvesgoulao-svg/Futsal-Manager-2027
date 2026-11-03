# Diagnóstico da simulação tática — main-antes

Semente **base**, 12 jogos (mesmos confrontos e semente em todas as versões), commit 6410164, 2026-11-03.

| Métrica | Valor |
|---|---|
| Minutos de jogo corrido analisados | 481.2 |
| Largura da equipa com bola (m) | 13.41 |
| Profundidade da equipa com bola (m) | 10.94 |
| Largura da equipa sem bola (m) | 7.22 |
| Profundidade da equipa sem bola (m) | 9.52 |
| Distância média entre colegas com bola (m) | 10.54 |
| Distância ao colega mais próximo com bola (m) | 7.65 |
| Distância média entre colegas sem bola (m) | 7.28 |
| Defensor → atacante mais próximo (m) | 3.11 |
| Portador → defensor mais próximo (m) | 2.03 |
| Linhas de passe livres por instante | 2 |
| Linhas de passe obstruídas (%) | 30.8 |
| Passes por minuto de jogo corrido | 31.8 |
| Passes que atravessam um adversário (%) | 1.9 |
| Tempo parado, jogadores com bola (%) | 9.3 |
| Tempo parado, jogadores sem bola (%) | 6.1 |
| Maior período seguido parado (s, média) | 0.85 |
| Desmarcações explícitas da coreografia (por min) | 14.6 |
| Sprints sem bola (por min) | 28.3 |
| Rotações / trocas de posição (por min) | 31.2 |
| Movimentos de apoio ao portador (por min) | 11 |
| Transições analisadas (perdas em jogo corrido) | 462 |
| Pós-perda: jogadores perto da bola logo (n.º) | 0.59 |
| Pós-perda: jogadores perto da bola aos 3 s (n.º) | 1.56 |
| Pós-perda: recuo do bloco em 3 s (m) | 7.53 |
| Pós-recuperação: avanço da bola em 3 s (m) | 7.79 |
| Pós-recuperação: jogadores a atacar o espaço no 1.º s (n.º) | 1.78 |

## Por jogo
| Jogo | Resultado | Largura c/ bola | Linhas livres | Obstruídas % | Passes/min | Atravessam % | Parado c/ bola % |
|---|---|---|---|---|---|---|---|
| slb-scp | 2-2 | 13.72 | 2 | 30.6 | 30.5 | 2 | 9.5 |
| scb-fun | 10-2 | 13.92 | 2.03 | 29.1 | 31.9 | 2.1 | 9.2 |
| lps-tor | 6-1 | 13.1 | 1.97 | 32.4 | 32.5 | 2.8 | 10.5 |
| rav-uvn | 6-2 | 14.33 | 2.26 | 22.4 | 33.7 | 0.9 | 8.7 |
| por-fam | 6-6 | 14.29 | 2.15 | 25.7 | 31.1 | 1.8 | 8 |
| ele-fzz | 4-0 | 13.56 | 1.94 | 33.4 | 33.2 | 1.9 | 9.2 |
| bar-epz | 2-2 | 13.38 | 1.89 | 33 | 30 | 1.9 | 10 |
| jca-pal | 2-3 | 13.39 | 1.92 | 33.3 | 29.9 | 1.6 | 10.3 |
| int-jae | 4-2 | 13.04 | 1.84 | 35.9 | 30.7 | 2.3 | 9.2 |
| val-man | 3-2 | 12.58 | 2.03 | 29.9 | 32.5 | 1.5 | 8.4 |
| zar-pen | 2-4 | 13.21 | 1.94 | 33.2 | 33 | 2.9 | 10.2 |
| par-noi | 1-4 | 12.42 | 2.07 | 29.3 | 32.6 | 1.5 | 9.8 |

Definições: {"stillSpeed":0.3,"lineMin":2,"lineMax":16,"blockR":0.9,"ballHitR":0.5,"ballLowZ":1,"sprint":4,"swapHyst":1,"supportGain":2,"supportMin":3,"supportMax":8,"transWin":3,"pressR":4}