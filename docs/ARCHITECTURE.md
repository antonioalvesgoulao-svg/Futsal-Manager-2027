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
