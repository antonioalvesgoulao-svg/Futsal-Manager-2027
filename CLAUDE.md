# Futsal Manager 2027 — guia do projeto

Jogo de gestão de futsal no browser, inspirado no Football Manager. Projeto pessoal do António (sem fins comerciais).
O António não programa: o Claude escreve o código, testa e envia para o GitHub; o António testa no StackBlitz e dá feedback.

## Como trabalhar com o António
- Comunicar em **português europeu**, de forma concisa; tabelas em vez de texto longo
- Explicar o essencial do que mudou, sem pormenores técnicos desnecessários
- Testar sempre antes de entregar: `npx tsc`, `npx vite build` e um teste no browser (Playwright com o Chromium pré-instalado; para WebGL usar `--use-angle=swiftshader`)
- Fazer commit e push para `main` no fim de cada passo concluído
- O António valoriza **realismo**: regras oficiais, competições reais, dados reais. Validar com dados reais sempre que possível
- O António revê os números; dizer claramente o que é estimativa
- Experiência de jogo primeiro, grafismo depois

## Limites (já decididos, não reabrir)
- **Não** reproduzir logótipos, marcadores oficiais, fotos de jogadores, nem canais de TV reais ou imitações (nomes derivados + mesmas cores + mesmo símbolo). Os canais foram retirados do jogo a pedido do António
- Nomes reais de jogadores, clubes, pavilhões e cores reais dos clubes: **sim**
- Grafismo próprio: marcadores originais de inspiração portuguesa (azulejo, calçada, verde/vermelho)

## Tecnologia
- TypeScript + Vite, sem framework de UI (HTML gerado em strings), Three.js para o 3D
- Gravações em `localStorage` (3 espaços) + exportar/importar ficheiro. `SAVE_VERSION` em `src/core/types.ts`: subir quando a estrutura muda
- Abrir: `stackblitz.com/github/antonioalvesgoulao-svg/Futsal-Manager-2027`

## Estrutura
| Pasta / ficheiro | Conteúdo |
|---|---|
| `src/data/por/` | Liga Placard 2026/27: `clubs.json` (reputation, level, wealth em escala mundial 1-100), `players.json` (212 jogadores, zerozero), `history.json` (5 épocas de historial por jogador), `coaches.json`, `overrides.json` |
| `src/core/attributes.ts` | 26 atributos de futsal (1-20), geração por nível/idade/posição, potencial |
| `src/core/moneyball.ts` | Nível do jogador a partir do historial: nível da equipa, força da liga (golos em ligas fracas descontados), jogos, produtividade |
| `src/core/engine/match.ts` | Motor posse a posse (`createMatch` passo a passo; `simulateMatch` de uma vez). Regista `actions` por posse (remate, assistência, roubo, falta) |
| `src/core/visual/choreo.ts` | Coreografia de cada posse, **comum ao 2D e 3D**: bola de pé em pé, 4x4 tático, bolas paradas |
| `src/core/visual/intro.ts` | Cerimónia 3D antes do jogo: árbitros e equipas saem do túnel, alinham no centro; depois os 5 iniciais das duas equipas lado a lado (10 s) e os suplentes (5 s); clique no ecrã passa ao momento seguinte (`lineupHtml` em `broadcast.ts`, estilo do marcador) |
| `src/core/tactics.ts` | Sistemas, pressão, ritmo, marcação, GR avançado, rotação, quintetos, bolas paradas |
| `src/core/season/` | Calendário e competições portuguesas |
| `src/core/game.ts` | Ciclo de jogo (avançar, jogar, fim de época) |
| `src/core/development.ts` | Evolução, reformas, jovens da formação |
| `src/ui/screens/` | Ecrãs (início, plantel, táticas, calendário, competições, dia de jogo, ao vivo, definições) |
| `src/ui/three/highlight3d.ts` | Momentos importantes em 3D (4 câmaras, repetição, `seek` para testes) |
| `src/ui/three/arena3d.ts` | Pavilhão 3D: bancadas à medida da lotação, adeptos animados, teto, ecrã, placas LED com anúncios fictícios |
| `src/ui/three/player3d.ts` | Jogadores 3D: corpo contínuo com esqueleto (SkinnedMesh; camisola, calções, meias e pele em malhas com os mesmos ossos), pele com material próprio, cara com olhos/sobrancelhas/boca; animações |
| `src/ui/three/ultras3d.ts` | Claques (Benfica e Sporting, só em dérbis e finais): bandeiras, faixas, tifo no início da entrada (12 s), depois tochas seguras por adeptos (chama, faíscas, fumo que se acumula, luz a tremeluzir) na entrada e nos golos |
| `src/ui/three/roof3d.ts` | Tetos conforme as fotos: arcos em treliça ou maciços, malha de triângulos (plana/cúpula), asnas com projetores, vigas, LED. `viewFrom` em highlight3d para comparar com fotos |
| `src/core/attendance.ts` | Pavilhões (lotação real quando conhecida, `capacityReal`) e assistência ao estilo FM |
| `src/ui/audio.ts` | Som gerado no browser (Web Audio, sem gravações): público conforme a ocupação e a excitação, cânticos, palmas, "uuuh", festa do golo, assobios, apito (curto/longo/triplo), buzina, toques na bola, poste, rede, sapatilhas. Volume nas Definições e botão no jogo ao vivo |
| `src/core/appearance.ts` | Aspeto de cada jogador (pele, cabelo, barba, altura, cor das sapatilhas) por nacionalidade/idade; GR sem luvas (pedido do António); `LOOKS` para correções manuais |

## Regras oficiais implementadas
2 x 20 min de tempo útil; faltas acumuladas por parte, 6.ª = livre direto sem barreira (10 m ou local da falta); no prolongamento contam as da 2.ª parte; 1 desconto de tempo por parte; expulsão = 2 min de inferioridade (acaba se sofrer golo); buzina (remate antes do fim conta); prolongamento 2 x 5 min; penáltis 5 + pares até desempatar; substituições volantes ilimitadas; GR avançado como instrução tática.

## Competições (formatos reais)
- Liga Placard: 12 clubes, 2 voltas; play-off 8 primeiros (quartos e meias à melhor de 3, final à melhor de 5)
- Taça da Liga: final eight com os 8 primeiros no fim da 1.ª volta, janeiro, campo neutro
- Taça de Portugal: eliminatória inicial + final eight em abril
- Supertaça: campeão x vencedor da Taça (ou finalista)

## Validação (5 épocas reais 2021/22 a 2025/26, zerozero)
Real: 6,38 golos/jogo, casa 49,6%, fora 37,0%, empates 13,5%, <3 golos 6,1%. Manter a simulação próxima destes valores após mexer no motor (script de 5 épocas com play-off).
Última validação (1/11, 3 696 jogos da Liga, já com recargas): 6,43 golos/jogo, casa 51,7%, fora 34,7%, empates 13,6%, <3 golos 6,3% (pGoal base 0,17; recarga em 25% das defesas para a frente (estimativa); vantagem casa 3,0/-0,8; momento do jogo: quem perde +0,55 por golo, quem ganha -0,2).

## Feedback recente do António (prioridade)
- Vídeo de 31/10/2026: transições artificiais, cantos sem marcador nem organização, 3D sem animações. Resposta (`choreo.ts` reescrito):
  - percursos contínuos com inércia (velocidade máx. 7,4 m/s, aceleração 9 m/s²), continuidade entre posses
  - padrões reais: paralela, diagonal, bola no pivô + corte, bloqueio e continuação, finta 1x1, passe e corte (4-0), cruzamento (2-2), inversão (5x4), segundo poste, contra-ataques com contagem real (2x1, 3x2)
  - defesa: pressão conforme a linha escolhida, cobertura/ajuda, individual mantém pares, zona troca marcações; 5x4 deixa livre o mais longe da bola
  - bolas paradas organizadas: cantos (4 jogadas do motor), livres com barreira a 5 m (3 jogadas), 10 m e penálti com todos atrás da linha da bola, festejos, reposições do GR, pontapé de saída
  - ações por jogador (`Frame.acts`): passe, remate, mergulho, defesa, carrinho, finta, bloqueio, proteção do pivô, bloqueio de remate, queda, festejo. 3D com corpo articulado; 2D com setas de desmarcação e marcas de ação
  - pavilhões e adeptos (pedido de 31/10): lotações da Wikipédia (Famalicão 1 200, Venda Nova 1 800 e Ferreira do Zêzere 700 indicadas pelo António; todas as lotações são reais); campos neutros indicados pelo António: Gondomar (3 005, Câmara), Odivelas (2 000, indicada pelo António), Vila do Conde (800), rodam por competição e época; disposição das bancadas é aproximação (fotos do interior: João Rocha da Wikimedia; Fidelidade, Braga (AMCO Arena, 1 400, inaugurada em 2023; já não joga em Gualtar), Fundão, Porto Salvo, Ferreira do Zêzere, Ponte de Sor, Vila do Conde, Venda Nova, Portimão, Famalicão, Torres Vedras, Gondomar e Odivelas enviadas pelo António: todos os 14 feitos a partir de fotos). Assistência = procura por reputação × adversário × classificação/forma × importância × acaso, limitada à lotação (calibração estimada)
  - ritmo: lenta 2,2x (lances decisivos 1,3x) ≈ 23 min, média 4,5x (2x) ≈ 11 min, rápida 9x ≈ 5 min
- Feedback 3D (1/11): bancos com cadeiras (ambos na cor da equipa da casa) e suplentes sentados (lado oposto à câmara de TV, com mesa e zona de substituição), túnel insuflável ao centro a sair do interior (placas abertas na passagem, mesa ao lado), GR de futsal (voo só aos ângulos altos; espargata lateral pelo chão; abertura em cruz de perto), GR agarra e repõe à mão, 3D em ecrã inteiro (pixel ratio 1,25, sombras 1024, tecidos em MeshStandard para fluidez). Jogo mais parecido com futsal: ~36 passes/min de posse, ~0,9 s com a bola por toque, marcação a ~2,2 m no meio-campo ofensivo (só 15 % do tempo com atacantes livres a >3 m). Referências reais são estimativas
- Estilo do GR (tática `gkStyle`: clássico/construtor/atacante): o construtor ajuda a sair da pressão; o atacante sai a jogar com os pés, às vezes remata de longe (~0,5 remates/jogo, estimativa) e arrisca a baliza deserta. Defesas agarradas (`Action.caught`) dão contra-ataques com reposição rápida à mão (~1,5/jogo). No 3D, se o lance perigoso dá origem a contra-ataque, a imagem continua sem cortes (`continueWith`). Estudos de elite: 58% das ações do GR são ofensivas; não há números públicos por jogo de remates/conduções do GR
- Durante o jogo: botão Substituições (pausa; quem sai → quem entra, `m.substitute`), mudar sistema e rotação; rotação 'manual' = o motor não troca jogadores (só expulsões/inferioridade)
- Arbitragem (`src/core/referees.ts`): duplas com temperamento (tolerância ao contacto → faltas; cartões; severidade nos confrontos). 24 árbitros reais (lista do António) em 12 duplas sorteadas; temperamento sorteado à volta das médias da Liga (estimativa ~4 amarelos e ~0,3 vermelhos/jogo). Quem já tem amarelo comete menos faltas para cartão. Jogos grandes (importância ≥0,5) vão para as duplas de topo
- Confrontos (`maybeBrawl` no motor): depois de faltas, probabilidade 0,15%+3%×tensão² (tensão = importância + resultado apertado no fim); mais jogadores em jogos grandes; cartões conforme a dupla. 3D/2D: jogadores juntam-se e empurram, árbitros separam, cartões
- Vídeos: o António arrasta clipes mp4 (30 s–2 min) para a conversa; extraio fotogramas com ffmpeg
- Não consigo ver vídeos do YouTube nem imagens da internet (rede do ambiente bloqueia sites de imagens); posso analisar fotos, capturas e gravações que o António envie
- Equipamentos (`src/core/kits.ts`): principal e alternativo reais dos 12 clubes (dados do António, 1/11), escolha no dia de jogo; visitante muda se chocar. GR sem dados reais: cor fixa por clube entre laranja/calções pretos, azul-claro, amarelo, verde fluorescente, laranja fluorescente (pedido do António); árbitros passam a preto se um GR jogar de amarelo
- Camisolas com nome (apelido) e número nas costas, número à frente e nos calções; números oficiais do zerozero, alteráveis no perfil do jogador (troca se o número estiver ocupado)
- Gráfico de golo no terço inferior (`goalBarHtml` em broadcast.ts), 2D e 3D; repetição automática do golo em câmara lenta (0,4x) noutro ângulo
- Pontapés de linha lateral (desarmes que mandam a bola fora, 40%) e recargas (ressaltos)
- Definição "Qualidade gráfica do 3D": alta = reflexos no piso (Reflector), sombras 2048
- Corredor do túnel desce em rampa (2,2 m abaixo do piso, pedido do António) para a bancada continuar por cima; só 2-3 filas da frente ficam sem lugares
- Feedback 1/11 (tarde): túnel refeito como túnel retrátil real (estrutura em tesoura com lona, relva sintética) que entra na bancada do lado dos bancos por uma passagem (corredor para os balneários; bancada cortada, placas abertas); mesa do cronometrista à frente da boca do túnel com dois árbitros auxiliares sentados; mais espaço desse lado (bancada a 5 m da quadra); na entrada, casa passa à esquerda da mesa e visitantes à direita. Sem legenda a descrever o lance no 3D (tirava o suspense). 2D com nomes por baixo dos números. Equipamentos escolhidos graficamente no dia de jogo (os meus dois + como vão jogar as duas equipas, com GR)
- Identificação no 3D: etiqueta discreta por cima de cada jogador em campo (número na cor da camisola + apelido), tamanho ajustado à distância; botão "Nomes" para esconder. Números nas camisolas maiores
- Vídeos 31/10 18h (jogabilidade): GR já não recua para a linha de golo (defende à frente, desloca-se de lado até a mão/perna chegar à bola, extensão máxima no instante do contacto; defesa sem agarrar tem sempre gesto e a bola sai para canto longe dos postes); bola fora: o jogador vai buscá-la e leva-a à mão (cantos, pontapés de linha lateral; GR vai buscar a bola atrás da baliza); redes em malha de 10 cm que ondulam com o golo; jogadores sem bola fazem desmarcações curtas (nunca mais de ~1,3 s parados)
- Jogadas novas (1/11 noite): saída de pressão pelo GR (mais contra pressão alta), falso pivô (pivô sai, ala ataca as costas), movimento em U contra zona, pontapé de linha lateral com 3 variantes (curto, atrás para o fixo, bloqueio + diagonal); contra-ataques 2x0/2x1/3x2 com passe lateral; condução a toques; livres no local da falta. Quadro tático para o António desenhar jogadas: https://claude.ai/artifact/KLjj8UP8YX9S2fre6S36zH (coleção "jogadas"). YouTube: pesquisa funciona mas o download é bloqueado (verificação anti-robô); usar clipes curtos do António (limite 30 MB)
- Clipes reais do António (31/10 19h: Sporting-Benfica Liga Placard, Tigers-Benfica UEFA, Barcelona-Inter): ocupação de toda a largura (alas junto às linhas, fixo no meio-campo), bloco à zona compacto (lado contrário fecha o meio), portador marcado corpo a corpo e a proteger a bola de costas. Aplicado: estruturas mais largas, pressão no portador 0,65-1,1 m, ajuda à zona até 45%, proteção automática da bola com adversário encostado
- Clipes 31/10 20h (jogadas ensaiadas reais: cantos com remate de primeira e bloqueios ao GR, 5x4 em pirâmide com diagonal curta, saída de pressão da Ucrânia com cortina + passe de primeira para o pivô + corte): aplicados como "cortina" e "diagonalCurta" no choreo
- Clipe 2 min Tigers-Benfica (31/10 20h): GR atacante conduz até ao meio-campo (agora 15-19,5 m, a ~4,6 m/s); muitos choques com quedas (35% dos desarmes deitam quem perde a bola); confusões na área com GR no chão (recargas já existem)
- Clipes de defesas (LNFS, 31/10 20h10): GR sai ao encontro do atacante nos remates de perto (<8,5 m) e fecha em queda (abertura/espargata), saída começa 0,9 s antes do remate; voos horizontais só aos ângulos altos (já existia)
- Feedback 31/10 noite: placas LED com número inteiro de painéis (nada cortado); marcador 2D centrado sobre a quadra; contra-ataque sem passes para trás (quem tem espaço conduz para a baliza; 1x0 vai sozinho); livre de 10 m com o GR 1,5-3 m fora da linha (penálti continua na linha, regra); qualquer golo é mostrado em 3D (também quando surge logo a seguir a outro lance 3D)
- Comentário 2D ao estilo FM: barra grande por baixo da quadra (lance atual + anterior), só o essencial (remates, defesas, cantos, livres, cartões, golos, confrontos, faltas acumuladas); legenda pequena dentro da quadra retirada. Confrontos sempre em 3D (como os golos, em qualquer definição exceto "nenhum"), desde o lance que os provoca
- Bola nas mãos (GR que agarra, jogador que vai buscar a bola) fica à frente do peito, nunca dentro do corpo (antes desaparecia); agarrada junto ao chão só em voo/espargata
- Som (1/11 noite): gerado no browser. Cânticos retirados a pedido do António (soavam artificiais); fundo = conversa do público (vozes curtas) + ruído de sala muito baixo (o varrimento antigo soava a ondas do mar); apito com trilo da bolinha (~3,2 kHz, bem audível); "uuuh", "buuu" e golo feitos com vozes de multidão; assobios com os dedos; palmas ocasionais; petardos nos golos dos jogos grandes
- Som (1/11 noite, pedido do António): SÓ gravações reais em `public/sons/` (créditos em CREDITOS.txt): público (ciclo), golo, apito, três apitos do fim, petardo, assobios, uuuh, palmas, buzina. Nada sintético (sem sons da bola nem chiar; sem cânticos). Repetições: público abafado (passa-baixo 700 Hz, metade do volume). Golo do visitante: o pavilhão cala-se (público a 25% durante 4 s) e ouve-se ao longe a festa dos visitantes. Público = nº real de pessoas (log) × ocupação; apito e buzina fixos. freesound bloqueia este servidor: o António descarrega e envia os ficheiros. Cortar ficheiros m4a: converter primeiro para wav (cortar m4a diretamente com -ss deixou o golo mudo)
- Castigos (`src/core/discipline.ts`, Regulamento Disciplinar FPF 2025/26, texto colado pelo António): 2 amarelos = 1 jogo (Art. 169, não contam para acumulação); Liga Placard 1 jogo ao 5.º, 9.º, 12.º e depois a cada 3 amarelos (Art. 170; Taças e Supertaça sem acumulação); play-off recomeça a contagem se ainda não chegou ao 5.º (170.4); vermelho direto por impedir golo 1-2 jogos (168.1); vermelho em confronto 1-5 (Art. 154 sem lesão; distribuição estimada, quase sempre 1-2); cumpre na mesma competição, senão noutra da época (40.2), senão na seguinte (40.3); acumulação caduca no fim da época (40.9). Castigados ficam fora da convocatória; aviso no dia de jogo; 🟥/🟨 no plantel
- Regulamento da Liga Placard 2026/27 (PDF do António): ficha de jogo 5 + 7 suplentes, ou + 9 se 2 forem Sub-20 formados localmente (Art. 69.2; formado localmente estimado como português até 20 anos); desempates Art. 18.5 (confronto direto pontos e diferença, diferença geral, vitórias, golos marcados, sofridos). Para a etapa 10: máximo 20 seniores inscritos, 5 substituições após o limite (52.5), mínimo 7 formados localmente na ficha (53.1), 15 h entre jogos (52.8)
- Lesões (`src/core/injuries.ts`): Lopes et al. 2023 (elite masculino, Portugal): 25,9/1000 h de jogo (tempo útil em campo), 3/1000 h de treino (~7,5 h/semana, estimativa); zonas virilha 19%, joelho 19%, coxa 17%, tornozelo 15%; cruzado raro (~210 dias). Mais risco com idade >28 e pouca resistência (estimativa). Simulação: ~12 lesões visíveis por equipa/época, média ~12 dias (as de 1-3 dias entre jogos não se veem). Lesionados fora da convocatória; 🩹 no plantel; aviso no dia de jogo; notícias. Lesionados nunca jogam; sem GR disponível vai à baliza o jogador de campo com melhores atributos de GR (pedido do António). Perfil mostra a lesão (tipo, explicação, dias, regresso). Lesão a meio do jogo (motor, `injure`): sai e entra um suplente sem inferioridade; GR lesionado sem suplente = jogador de campo na baliza; comentário 2D; ~0,13 lesões/jogo. Ainda não: animação do jogador a sair a coxear
- Regulamento da Taça de Portugal 2026/27 (PDF do António): eliminatórias a uma mão com prolongamento e penáltis; na Final Eight quartos e meias vão diretos a penáltis (Art. 14.4, `noExtraTime`); a final tem prolongamento (14.5); ficha 5+7 (62.2)
- Moral (`src/core/morale.ts`, tudo estimativa, sem dados públicos no futsal): 0-100 (65 normal), escala FM (Excelente ≥88 … Muito fraca <30). Sobe/desce com resultado (×importância), nota do jogo, golos, minutos conforme estatuto (9 melhores esperam jogar), expulsão -3, lesão >7 dias -6, título +10; regressa 15%/jogo ao normal. Efeito: atributos ×0,93 a ×1,04. Coluna no plantel, perfil, notícias quando chega a excelente/fraca
- Treino (`src/core/training.ts`, ecrã Treino; estimativas): foco da equipa (equilibrado, técnica, tática, físico, finalização, GR, recuperação) + intensidade (baixa 0,75/normal/alta 1,25 na evolução; lesões em treino ×0,7/×1/×1,4; recuperação ×0,5) + foco individual por jogador. A evolução é contínua, dia a dia (pedido do António): cada avanço aplica dias/365 da mudança anual (`dailyDevelopment` em game.ts, `developPlayer` com `frac`); dias lesionado não evoluem; envelhecimento e revisão do potencial no fim da época; pré-época sem efeito da nota/minutos; até ~+0,5 por atributo com foco total. GR fazem sempre metade de treino específico. Teste 1 época Benfica: físico/alta físicos +0,70 vs equilibrado -0,01; técnico técnicos +0,72 vs +0,29
- Evolução dinâmica (`development.ts`, estimativa, pedido do António ao estilo FM/FIFA): crescimento = margem até ao potencial × ritmo por idade (≤19 0,45 … 26-27 0,1) × minutos + qualidade da época (nota média − 6,6); jovem sem jogar estagna; potencial sobe com grandes épocas (≤24) e desce a quem não joga (≤23). Lesão >3 semanas: -0,25 físicos por cada 30 dias parado (contados dia a dia) (×1,5 acima dos 30), >120 dias também -0,1 técnica/mental. Teste 3 épocas: nível médio da liga estável (11,17 → 11,09); jovens com margem >3 +0,7 a +0,9/época, com margem <1,5 ~0
- Travões da evolução diária: por época cada atributo sobe no máximo +3 (≤21), +2 (22-25), +1 (26+); nível nunca passa o potencial +1 durante a época. Teste 5 épocas: maior subida 1,7-2,6/época, só 1-3% sobem ≥1,5; nível médio desce devagar (11,17 → 10,65) porque os veteranos saem e entram juniores fracos: a resolver no mercado (etapa 10) e formação (etapa 11)
- Próximos melhoramentos possíveis: mais variantes de jogadas ensaiadas

## Roteiro
| Etapa | Estado |
|---|---|
| 1-6 Base, dados, atributos, motor, táticas, época | Feito |
| 7 Quadro tático gráfico, bolas paradas, jogo ao vivo 2D, 3D | Feito (a afinar com feedback) |
| 8 Ligação 3D ao motor | Coberta pela 7 |
| 9 Plantel e clube: treino, moral, lesões, castigos, contratos | Em curso (castigos, lesões, moral e treino feitos) |
| 10 Mercado e finanças | |
| 11 Staff e formação (treinadores com historial real) | |
| 12 20 ligas europeias + segundas divisões e taças | |
| 13 Champions League, seleções, Europeu, Mundial, Intercontinental | |
| 14 2 ligas por continente | |

Recolha de dados: o zerozero bloqueia pedidos diretos; usar o Chrome do António (Claude in Chrome) para ler páginas.
