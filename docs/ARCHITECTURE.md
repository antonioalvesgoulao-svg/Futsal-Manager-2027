# Arquitetura

## Stack
TypeScript, Vite, Three.js 0.169. Interface sem framework dedicado; execução no browser/StackBlitz.

## Componentes principais
- `src/core/engine/match.ts`: motor de jogo e autoridade dos resultados.
- `src/core/visual/choreo.ts`: coreografia visual dos lances, partilhada por 2D e 3D.
- `src/core/diagnostics/metrics.ts` e `tools/diag/run.ts`: métricas de diagnóstico.
- `src/core/tactics.ts`: sistemas e instruções táticas.
- `src/core/types.ts` e `src/core/attributes.ts`: tipos e atributos.
- `src/ui/three/`: renderização 3D.

## Fronteira essencial
O motor decide o resultado desportivo; a coreografia representa visualmente o lance. O sistema atual usa trajetórias e padrões coreografados, não uma simulação física integral nem agentes autónomos completos.

Melhorias visuais/táticas não devem alterar os resultados decididos pelo motor. Qualquer alteração ao motor deve ser isolada, justificada e validada separadamente.

## Direção da evolução tática
Evoluir gradualmente: perceção do espaço e dos jogadores; papel/posição e contexto; escolha de intenção; movimento com aceleração, velocidade e agilidade; coordenação coletiva; tradução em ações visuais; validação por métricas e observação.

A primeira integração deve focar um cenário controlado de ataque organizado 4-0. Manter coreografias existentes como fallback para bolas paradas e situações especiais.

## Atributos individuais
Os atributos devem afetar dimensões diferentes:
- aceleração/velocidade: chegar ao espaço;
- agilidade: mudar de direção;
- resistência: manter qualidade com fadiga;
- visão, decisões e antecipação: leitura e timing;
- posicionamento: ocupação espacial;
- trabalho de equipa: sincronização;
- receção/passe/condução/remate: execução técnica separada da qualidade de movimento.

Jogadores com a mesma intenção podem executá-la de forma diferente. Não tornar todos perfeitos e não confundir qualidade de movimento com probabilidade de sucesso técnico.

## Diagnóstico e validação
As métricas atuais incluem largura/profundidade, distâncias, linhas de passe, tempo parado, corridas, rotações e transições. Algumas são proxies geométricas, não prova de intenção ou eficácia tática. Comparações exigem seed, parâmetros e schema consistentes.

Comandos conhecidos: `npm ci`, `npm run build`, `npm run diag -- --seed base --jogos 12 --nome ci`. Consultar sempre `package.json` antes de executar.


## Dependência de dados para a camada de movimento
A coreografia `Choreo` recebe atualmente uma `Possession`, táticas, período, estado inicial e nomes. A estrutura `Possession` transporta IDs dos jogadores em campo, não os objetos `Player` nem os atributos. Portanto, `movement.ts` não pode influenciar legitimamente o movimento até que o chamador forneça à coreografia um mapa de jogadores/atributos. Essa passagem deve ser opcional e compatível com os caminhos atuais; não se deve duplicar atributos dentro de cada posse nem alterar o motor de resultados apenas para alimentar a apresentação.


## Primeira integração de atributos físicos (PR #5)

O chamador `src/ui/screens/live.ts` tem acesso aos plantéis produzidos por `setupFor`. Passa à coreografia um mapa opcional `playersById`, sem acrescentar objetos Player à estrutura `Possession` nem alterar o motor de resultados.

A `Choreo` converte esses jogadores em `MovementProfile`. Na primeira fase, apenas o ataque organizado em 4-0 aplica os fatores individuais de aceleração e agilidade ao bake das trajetórias dos jogadores de campo da equipa em posse. O guarda-redes, a equipa defensora e os restantes sistemas mantêm os limites anteriores. A velocidade máxima continua global porque o modelo de atributos não contém um atributo de velocidade máxima.

A agilidade influencia o horizonte de antecipação do alvo durante o bake; a aceleração influencia o limite de alteração da velocidade. Estes efeitos são moderados e não representam qualidade de decisão ou sucesso técnico. A próxima validação deve comparar jogadores com atributos físicos contrastantes num cenário 4-0 controlado, confirmando também que o resultado do motor permanece inalterado.
