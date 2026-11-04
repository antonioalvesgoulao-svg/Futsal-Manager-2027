# HANDOFF — Futsal Manager 2027

Este documento é um snapshot; confirmar sempre o GitHub antes de continuar.

## Repositório
https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027

Stack: TypeScript, Vite, Three.js 0.169. O António testa no StackBlitz e prefere comunicação em português europeu, clara e direta.

## Regras inegociáveis
- É futsal 5v5, não futebol de 11.
- Prioridade: qualidade tática e credibilidade do jogo; grafismo em segundo plano.
- As movimentações têm de refletir os atributos individuais. Jogadores diferentes não podem executar a mesma intenção com igual velocidade, timing, leitura, agilidade, coordenação e consistência.
- Atributos físicos, cognitivos, técnicos e coletivos têm efeitos distintos.
- Qualidade de movimento não é probabilidade de sucesso de passe/remate.
- O motor de resultados é a autoridade do resultado; melhorias visuais/táticas não podem alterá-lo por acidente.
- Trabalhar em branches e PRs. Nunca fazer merge para main sem aprovação explícita do António.
- Não afirmar que testes passaram sem evidência.

## Arquitetura
- `src/core/engine/match.ts`: motor de resultados.
- `src/core/visual/choreo.ts`: coreografia visual partilhada por 2D/3D.
- `src/core/diagnostics/metrics.ts`, `tools/diag/run.ts`: diagnóstico.
- `src/core/tactics.ts`: sistemas e instruções táticas.
- `src/core/types.ts`, `src/core/attributes.ts`: tipos e atributos.
- `src/ui/three/`: visualização 3D.
O sistema atual usa trajetórias/padrões coreografados; não assumir física integral da bola nem agentes autónomos completos.

## Estado conhecido em 1 novembro 2026

### PR #1 — diagnóstico
https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/pull/1
- Branch: `fix/diagnostics-phase0-hardening`
- Aberta, draft, não merged (confirmar estado atual).
- HEAD conhecido: `830b8d3beaa103050ee6e3b5fcf2ce779e01b56b`.
- CI para este HEAD foi confirmada como sucesso nos runs 41356257764 e 41356261073.
- Correções de métricas, duração por intervalos, rotações e identificação de métricas geométricas como proxies.

### PR #3 — movimento sensível aos atributos
https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/pull/3
- Branch: `feat/attribute-aware-movement-clean`
- Aberta, draft, não merged (confirmar estado atual).
- HEAD conhecido: `ac61e633d6803e534216124665280f27a08fca89`.
- Adiciona `src/core/visual/movement.ts`, isolado, ainda sem integração na coreografia ou alteração visível no jogo.
- CI para este SHA não estava confirmada no último ponto de situação.
- PR #2 foi fechada sem merge por ter sido criada a partir da base errada.

### Main
SHA base conhecido: `15a3bb3ca4f450c09395f35e621220e9dc23697d`. Confirmar o SHA atual; não assumir que continua igual.

## Verificações técnicas feitas na continuação (1/11/2026)
- `Player.position` é a união `GR | FIX | FIX/ALA | ALA | ALA/PIV | PIV | UNI`; os papéis usados em `movementRoleFit` correspondem aos tipos.
- `Player.attrs` usa `Attributes`, escala numérica 1–20. Todas as chaves usadas em `movement.ts` existem: `visao`, `decisoes`, `posicionamento`, `trabalhoEquipa`, `antecipacao`, `aceleracao`, `agilidade`, `resistencia`, `agressividade` e `rececao`.
- O HEAD da PR #3 continua `ac61e633...`, aberta, draft, não merged e mergeable. A consulta de runs associados a este SHA não devolveu execuções.
- O caminho `.github/workflows/validacao.yml` não existe na `main` consultada. A CI mencionada na PR #1 está na branch/PR de diagnóstico, não se pode assumir que valide a PR #3. Não foi possível confirmar build/diagnóstico executados para a PR #3.
- `Choreo` recebe atualmente `Possession`, táticas, período, estado inicial e nomes. `Possession` contém IDs de jogadores em campo, mas não contém atributos nem objetos `Player`. A futura integração exige fornecer um mapa de jogadores/atributos à coreografia a partir do ponto de chamada, sem alterar o resultado do motor.

## Próximos passos
1. Localizar todos os pontos que instanciam `Choreo` e identificar onde existe acesso aos plantéis/objetos `Player`.
2. Desenhar uma passagem explícita e opcional de dados dos jogadores à coreografia, mantendo compatibilidade com bolas paradas e cenários sem dados.
3. Integrar primeiro uma única intenção de ataque organizado 4-0 (apoio ou ataque ao espaço), não todas de uma vez.
4. Aplicar os atributos ao timing, aceleração, agilidade e coordenação, sem alterar as ações/resultados decididos pelo motor.
5. Criar um cenário comparativo repetível com dois jogadores de atributos diferentes e validar visualmente e por métricas.
6. Confirmar uma via de build/CI disponível para estas branches; não afirmar validação sem execução.

## Comandos conhecidos
Consultar `package.json`:
- `npm ci`
- `npm run build`
- `npm run diag -- --seed base --jogos 12 --nome ci`

Não há framework de testes unitários conhecido neste snapshot.

## Checklist ao retomar noutra IA
- Ler `AGENTS.md`, este ficheiro, `docs/ARCHITECTURE.md`, `docs/GAMEPLAY_RULES.md` e `CLAUDE.md`.
- Confirmar branch, main, PRs, commits e CI no GitHub.
- Inspecionar o código atual antes de editar.
- Não fazer merge sem aprovação explícita.
- Atualizar este handoff no fim de cada marco com SHA, PR, testes e próximo passo.


## Integração inicial dos atributos na coreografia (1 novembro 2026)

### PR #5 — integração física no ataque 4-0
https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/pull/5
- Branch: `feat/integrate-attribute-movement`.
- PR aberta, draft, não merged. Criada como PR empilhada sobre a branch da PR #3 (`feat/attribute-aware-movement-clean`), não diretamente sobre `main`.
- HEAD conhecido: `fea819c794d85102642bc1bb3f68cb110afc9d15`.
- A PR #5 depende da PR #3; manter essa relação explícita e não alterar a base sem rever a dependência.
- `live.ts` constrói um mapa de jogadores a partir de `hs.squad` e `as.squad` e passa-o opcionalmente a `Choreo`.
- `Choreo` calcula os perfis físicos por jogador. (Atualizado: agora todos os jogadores de campo, em todos os sistemas, recebem) aceleração e agilidade individuais no bake das trajetórias.
- O guarda-redes é excluído. Outros sistemas e jogadores defensores mantêm os parâmetros anteriores.
- Foi removido `speedFactor` do perfil: o modelo não tem atributo explícito de velocidade máxima e não devemos inferi-lo a partir de aceleração.
- Decisão, trabalho de equipa, resistência e adequação posicional ainda não alteram a coreografia. Precisam de intenções táticas explícitas e de uma integração própria.
- O motor de resultados não foi alterado.
- Não foi possível executar `npm run build` nem diagnóstico/simulação neste ambiente. Não há execução CI confirmada para este HEAD; não declarar build ou testes aprovados.

### Próximo passo técnico
1. Confirmar que a PR #3 continua aberta e rever a integração como PR empilhada.
2. Obter uma execução real de build/CI para a branch de integração; a CI não pode ser presumida a partir de outras branches.
3. Criar um cenário repetível 4-0 com dois jogadores de aceleração/agilidade muito diferentes e comparar trajetórias/timing, garantindo que os resultados do motor permanecem idênticos.
4. Rever se o efeito físico é visualmente perceptível mas moderado; só depois avançar para tagging de intenções (apoio, rotação, ataque ao espaço).


## Testes físicos e CI inicial (1 novembro 2026)

### Alterações na PR #5
- Extraída a integração da trajetória para `bakeMovementTrajectory` em `src/core/visual/movement.ts`. A função é usada pelo `Track.bake` em `choreo.ts`, pelo que os testes exercitam o mesmo integrador que alimenta as trajetórias renderizadas.
- A aceleração limita a alteração de velocidade; a agilidade reduz a janela de resposta do alvo. Não é introduzida velocidade máxima individual.
- Criado `tools/tests/movement.test.ts`: compara trajetórias sintéticas com aceleração 5 vs 18 e agilidade 5 vs 18, e confirma estruturalmente que `src/core/engine/match.ts` não depende da camada visual.
- Adicionado `npm test` e workflow `.github/workflows/validacao-atributos.yml` com push nas branches PR #3/#5, workflow_dispatch, `npm ci`, `npm run build`, testes (PR #5) e `npm run diag`.
- O workflow foi colocado nas branches de feature, porque `main` ainda não contém workflow CI para eventos pull_request.

### Execuções CI observadas
- PR #3 HEAD `ef382e103403ee77ce36b554ce2dfe119375134d`: run [41358028406](https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/actions/runs/41358028406). `npm ci` e `npm run build` concluídos com sucesso; diagnóstico ainda estava em execução na última consulta.
- PR #5 HEAD `6618c00770b761196e52768491de0350a8942eff`: run [41358023935](https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/actions/runs/41358023935). `npm ci`, `npm run build` e `npm test` concluídos com sucesso; diagnóstico ainda estava em execução na última consulta.
- Run [41358019952](https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/actions/runs/41358019952) pertence ao commit anterior `ab2efe1210f9d2d61b6b29850cacd8175ddde45b`, não deve ser apresentado como validação do HEAD atual.
- As execuções ainda não tinham conclusão global quando esta nota foi escrita. Atualizar este estado após nova consulta.

### Estado e sequência de PRs
- PR #3 continua draft e aponta para `main`; PR #5 continua draft e aponta para `feat/attribute-aware-movement-clean` (dependência explícita).
- Ambas estão reportadas como mergeable, mas mergeable não significa validada nem aprovada.
- Não fazer merge sem aprovação explícita. A ordem correta é concluir CI/diagnóstico da PR #3, rever/aceitar PR #3 e só depois rever a PR #5 sobre a base integrada.


### Atualização após sincronização da base (1 novembro 2026, 22:38 UTC)
- PR #3 HEAD `ef382e103403ee77ce36b554ce2dfe119375134d`: workflow [41358028406](https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/actions/runs/41358028406) terminou com conclusão `success`; build e diagnóstico concluídos.
- PR #5 foi sincronizada com o HEAD atual da PR #3 através de commit de merge na branch de feature, sem merge de qualquer PR para `main`.
- Novo HEAD PR #5: `564cc7ff7f10edb62510e9b37f347172367608da`. A comparação confirma 11 commits à frente e zero atrás da branch base; PR voltou a ser reportada como mergeable.
- Workflow para o novo HEAD PR #5: [41358144794](https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/actions/runs/41358144794), ainda em execução na última consulta. Instalação concluída; build em execução; testes e diagnóstico pendentes.
- O HEAD anterior PR #5 `6618c00770b761196e52768491de0350a8942eff` teve workflow [41358023935](https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/actions/runs/41358023935) concluído com sucesso (incluindo build e testes), mas não substitui a validação do novo HEAD.
- PR #3 e #5 continuam drafts, abertas e sem merge. Motivo: foram criadas deliberadamente como drafts enquanto faltava validação; a PR #5 depende da PR #3. Não fazer merge sem aprovação explícita.


---

## Snapshot de continuidade consolidado — 1 novembro 2026, 22:40 UTC

Esta secção é a atualização mais recente deste documento e prevalece sobre estados antigos descritos acima quando existir divergência. O estado foi confirmado diretamente no GitHub.

### Estado de `main` e do jogo existente

- `main` aponta para `15a3bb3ca4f450c09395f35e621220e9dc23697d` (confirmado em `branches/main`).
- O commit `15a3bb3` adicionou a Fase 0 de diagnóstico tático e tem como pai `84edfdea6bea7bbcfc3156de5797f1950adb0148`.
- O histórico imediatamente anterior de `main` contém desenvolvimento funcional substancial do manager. Não tratar o projeto como um protótipo novo nem reduzir o estado do jogo à camada tática.
- Entre os marcos recentes registados no histórico estão:
  - funcionalidades de carreira/gestão: novo jogo por liga, atributos do treinador, calendário mensal, comparação de jogadores e treino com fadiga;
  - mercado: janelas, filtros, negociações, propostas, papéis no plantel, satisfação e valor dinâmico;
  - observação de jogadores/equipas, atributos escondidos, scouting e preparação contra o sistema adversário;
  - gestão de treinadores e staff: contratos, interinos, evolução, exigência das direções e entrevistas;
  - palestras, GR avançado manual, escolha do 5x4, substituições nas táticas e folha do jogador;
  - bolas paradas: seleção dos executantes e desenho de jogadas de canto/livre;
  - regras disciplinares espanholas e competições/estrutura de Espanha;
  - pavilhões 3D, equipamentos, marcador 3D, penáltis, baliza deserta e celebrações/festa do título.
- Estes itens são evidência de commits no histórico, não uma declaração de que cada funcionalidade foi novamente testada nesta sessão. Antes de alterar qualquer uma, inspecionar o código atual e preservar o comportamento existente.

### Estado atual das Pull Requests (consulta direta)

| PR | Branch | Base | HEAD | Estado |
|---|---|---|---|---|
| [#1 Diagnóstico](https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/pull/1) | `fix/diagnostics-phase0-hardening` | `main` | `830b8d3beaa103050ee6e3b5fcf2ce779e01b56b` | aberta, draft, não merged, mergeable |
| [#3 Movimento por atributos](https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/pull/3) | `feat/attribute-aware-movement-clean` | `main` | `ef382e103403ee77ce36b554ce2dfe119375134d` | aberta, draft, não merged, mergeable |
| [#4 Continuidade/documentação](https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/pull/4) | `docs/ai-handoff` | `main` | `0cb859e8a8172c83c56fa8aa34a2c4c1a1342d30` antes desta atualização | aberta, draft, não merged, mergeable |
| [#5 Integração física 4-0](https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/pull/5) | `feat/integrate-attribute-movement` | `feat/attribute-aware-movement-clean` | `564cc7ff7f10edb62510e9b37f347172367608da` | aberta, draft, não merged, mergeable |

- PR #2 está fechada sem merge; não reutilizar a sua branch.
- PR #5 está empilhada sobre PR #3; a sua base é exatamente o HEAD atual da PR #3. Não alterar esta relação sem rever a dependência.
- Nenhuma destas PRs foi integrada em `main`. Não fazer merge sem aprovação explícita do António.
- A PR #4 contém esta documentação. O HEAD será atualizado pelo commit desta atualização documental.

### Validações confirmadas por SHA exata

- PR #1, SHA `830b8d3beaa103050ee6e3b5fcf2ce779e01b56b`: runs [41356257764](https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/actions/runs/41356257764) e [41356261073](https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/actions/runs/41356261073) concluídos com sucesso.
- PR #3, SHA `ef382e103403ee77ce36b554ce2dfe119375134d`: run [41358028406](https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/actions/runs/41358028406) concluído com sucesso.
- PR #5, SHA `564cc7ff7f10edb62510e9b37f347172367608da`: run [41358144794](https://github.com/antonioalvesgoulao-svg/Futsal-Manager-2027/actions/runs/41358144794) concluído com `success`. Esta é a validação do HEAD atual da PR #5, incluindo o workflow `validacao-atributos.yml`.
- Runs de commits anteriores não substituem a validação do HEAD atual. Ao surgir um novo commit, confirmar novamente o run associado à nova SHA.

### Implementação tática existente — estado consolidado

- Fase 0: métricas e relatório comparável de comportamento/movimento, com limitações geométricas explicitamente identificadas como proxies.
- PR #3: camada isolada `src/core/visual/movement.ts`, que traduz atributos em perfis e qualidade por intenção; ainda não constitui agentes autónomos nem inteligência tática completa.
- PR #5: integração inicial de aceleração/agilidade no bake das trajetórias dos jogadores de campo da equipa em posse, apenas no ataque organizado 4-0. O mapa `playersById` é passado de `live.ts` para `Choreo`; guarda-redes, defensores e restantes sistemas preservam o comportamento anterior.
- `bakeMovementTrajectory` é a função pura usada por `Track.bake`. Os testes comparam trajetórias sintéticas para aceleração 5 vs 18 e agilidade 5 vs 18, e verificam que o motor de resultados não importa a camada visual.
- A validação automática cobre instalação, build, testes e diagnóstico. A CI não prova por si só que o efeito esteja visualmente bem calibrado numa partida completa.
- Ainda não foi demonstrado um teste visual de partida completa com jogadores de atributos contrastantes. Esta continua a ser uma lacuna real.

### Próximos passos reais — não recomeçar

1. Fazer revisão técnica final das PRs #1, #3, #4 e #5, incluindo diffs e dependências; não fazer merge sem aprovação.
2. Na linha tática, criar um cenário controlado e repetível de partida/ataque 4-0 com jogadores de aceleração e agilidade contrastantes. Comparar trajetórias e timing visualmente e confirmar que o motor de resultados produz os mesmos resultados com a camada visual ativada/desativada.
3. Só depois de validar o efeito físico em jogo, avançar para intenções cognitivas/táticas reais (apoio, rotação, ataque ao espaço, leitura de linhas de passe e coordenação), em passos pequenos.
4. Não declarar que o simulador já tem agentes autónomos: a coreografia continua a dirigir os lances e a integração atual é limitada.
5. Preservar e continuar todas as funcionalidades de gestão, competições, mercado, staff, regras e apresentação já existentes no jogo. Qualquer alteração futura deve partir do código real em `main` e das branches relevantes, não de uma descrição abstrata do projeto.

### Instrução para a próxima IA

O estado correto não é simplesmente “retomar a tarefa indicada num handoff antigo”. Primeiro compara este snapshot com o GitHub atual e com os commits mais recentes. Usa este documento como mapa, não como substituto da inspeção do código. Continua o trabalho já desenvolvido, sem reconstruir funcionalidades existentes, sem apagar decisões anteriores e sem fazer merge para `main` sem autorização.

---

## Cenário 4-0 com atributos contrastantes — 1 novembro 2026 (Claude)

Branch `claude/awesome-hypatia-l5i9xc`: PR empilhada sobre a PR #5 (`feat/integrate-attribute-movement`). Inclui também, por merge, os commits de documentação da PR #4 (`docs/ai-handoff`), para ter os documentos atuais. Não houve merge para `main`.

### O que foi feito
- `tools/tests/scenario40.test.ts`: jogo completo Benfica–Sporting (semente `cenario-40`, as duas equipas em 4-0), corrido 3 vezes:
  - sem dados dos jogadores;
  - com um jogador de campo do Benfica com aceleração/agilidade 5/5;
  - com o mesmo jogador a 18/18.

  Faz parte do `npm test`.
- `tools/diag/run.ts`: nova opção `--atributos`, que passa os jogadores à coreografia como o jogo ao vivo.
  - Sem a opção, o resumo é igual ao da linha de base `diagnostics/atual.json` (verificado).
  - O JSON regista `atributos: true|false`.
- `diagnostics/com-atributos.{json,md}`: diagnóstico de 12 jogos com `--atributos`.
- O workflow `validacao-atributos.yml` corre também nesta branch, com os testes.

### Resultados
Executados localmente: `npx tsc`, `npx vite build`, `npm test`, `npm run diag`.

| Verificação | Resultado |
|---|---|
| Motor: jogo sem dados / lento / rápido (todas as posses e resultado) | idêntico nos três casos |
| Jogador lento 5/5: aceleração p95, velocidade média, velocidade p95 | 7,99 m/s²; 2,76 m/s; 7,27 m/s |
| Jogador rápido 18/18: aceleração p95, velocidade média, velocidade p95 | 10,05 m/s² (+26%); 2,79 m/s; 7,40 m/s |
| GR entre os casos lento e rápido | até 4 m de diferença: reagem ao lance e as posses encadeiam-se (esperado, não é falha) |
| Diagnóstico de 12 jogos, com vs sem atributos | diferenças ≤0,1 em todas as métricas |

### Conclusões
- O efeito físico existe e é moderado nas arrancadas (+26% de aceleração). Quase não muda a velocidade média, porque a velocidade máxima é igual para todos (decisão anterior: não há atributo de velocidade máxima).
- No diagnóstico global o efeito é quase nulo: só conta no ataque organizado 4-0, e a maioria das equipas da amostra não joga em 4-0 (tática por omissão 3-1).
- Sem teste visual no browser: nenhum ficheiro do jogo foi alterado neste marco, só testes e diagnóstico.

### Próximo passo
1. Decisão de gameplay pedida ao António: alargar a física individual a todos os sistemas e à defesa (pressão, recuperação), ou manter só no 4-0 até haver validação visual.
2. Depois: intenções táticas explícitas (apoio, rotação, ataque ao espaço) com `decisionFactor` e `teamworkFactor`, em passos pequenos.

## Locomoção 3D e física individual em todos os sistemas — 1 novembro 2026 (Claude)

Pedido do António: 3D mais fluido, mais realista e mais próximo do futsal. Opção A aprovada implicitamente ("faz o que for necessário").

### Alterações
- `src/ui/three/highlight3d.ts`:
  - Abaixo de ~5,5 m/s, quem se desloca de costas ou de lado em relação à bola continua virado para o jogo. Antes rodava o corpo a partir de 3,2 m/s.
  - Calcula a velocidade no referencial do corpo (`Actor.fwd` e `Actor.side`).
- `src/ui/three/player3d.ts` (`pose`): passada conforme a direção.
  - Para a frente: igual a antes.
  - De costas: passada invertida, mais curta e mais baixa.
  - De lado: abre e fecha as pernas (passo lateral), joelhos fletidos e braços abertos.

  Antes as pernas faziam sempre a passada de frente e o corpo deslizava.
- `src/core/visual/choreo.ts`: aceleração e agilidade individuais em todos os sistemas (3-1, 4-0, 2-2, 5x4) e também nos defensores. Os GR ficam excluídos.

### Medições
| Medição | Resultado |
|---|---|
| Lance SCP–SLB (Playwright + swiftshader): tempo dos defensores a 1-5,5 m/s | 41% de frente, 39% de costas, 20% de lado |
| Esse mesmo tempo antes da alteração | 59% era deslizar com a passada de frente |
| Diagnóstico de 12 jogos com `--atributos` vs `atual` | diferenças ≤0,2 |
| Motor e `npm test` | resultados iguais; testes OK |
| `tsc` e `vite build` | OK |

### Próximo passo (gameplay tático, por ordem)
1. Passes que atravessam adversários (20,5%) e linhas de passe obstruídas (39%): a coreografia deve escolher recetores com linha livre e mover o apoio para abrir a linha.
2. Jogadores sempre em movimento (só 4% do tempo parados; 28 sprints/min sem bola): no futsal real há mais pausas posicionais e arranques no momento certo. Introduzir paragens com timing pela `decisionFactor`.
3. Intenções táticas (apoio, rotação, ataque ao espaço) com `decisionFactor` e `teamworkFactor`.

## GR, remates, reposições e corrida 3D — 1 novembro 2026 (Claude)
- Pormenor em `docs/ANALISE_3D.md`; medições com `tools/diag/gk.ts`.
- `choreo.ts`:
  - GR na bissetriz dos postes, com reação e passos de ajuste.
  - Reação ao remate pelos reflexos; sem gesto a remates para fora.
  - Força dos remates pelo atributo; reposições pela distância e pelo espaço livre.
  - Novo `attrsOf`/`au()` para ler atributos (0,5 sem dados).
- `player3d.ts`: corrida nova e agarrar à altura da bola.
- `highlight3d.ts`:
  - aceleração e rotação para a inclinação;
  - lado do voo estável;
  - o GR vira-se mais depressa durante a defesa.
- Motor intacto (`npm test`); tsc, build e diag OK.
- Imagens (Playwright) de corrida, voo e reposição: plausíveis; o gesto do voo ainda precisa de trabalho.
- Ainda não visto pelo António.

## Correção dos problemas da época (2 novembro 2026, Claude)
Pedido do António: corrigir tudo o que a análise da época encontrou (ver `docs/ANALISE_3D.md`, secção "Correções da época").

Alterações em `choreo.ts`:
- `separate()` depois do bake (3 passagens): os corpos não se atravessam.
  - Distância mínima: colegas 0,75 m, adversários 0,5 m, GR 0,6 m.
  - Exceções: contacto voluntário (carga, desarme, proteção, festejo, confronto); quem tem a bola não cede.
  - A correção é suavizada no tempo, sem empurrar ninguém para fora do campo.
  - Os adversários de quem passa saem da trajetória da bola.
- Defesa à zona/mista: só o portador é apertado; os outros recuam para o lado da baliza e fecham o meio.
- Os defensores longe da bola ignoram pequenas diferenças (zona morta de 0,9 m) e só aceleram quando ficam para trás.
- Ritmo:
  - `liven` passa a ajustar a cada 3,2 s (antes 1,3 s), com amplitude de 1,1 m;
  - a variação das posições da estrutura passa de 1,6 m para 0,7 m.
- Pivô e drible um pouco menos frequentes.

Alterações no 3D:
- `player3d.ts`: novo gesto do voo do GR (impulso, rotação para a horizontal, voo à altura da bola).
- `highlight3d.ts`: câmara TV mais recuada (7,6 m de altura, 11 m atrás da linha).

Desempenho: a coreografia demora 23 ms por posse no browser (mediana), uma vez a cada ~20 s de jogo.

Validação: tsc, build, `npm test` (motor intacto) e diag. Jogo ao vivo no browser sem erros.

## Árbitros e jogadores fora da quadra (2 novembro 2026, Claude)
- Equipamentos dos árbitros (indicação do António), em `REF_KITS`/`refKitFor` (`kits.ts`):
  - opções: amarelo, verde fluorescente, amarelo fluorescente ou todo preto, sempre com calção preto;
  - nunca coincidem com a camisola nem com a 2.ª cor do padrão dos jogadores de campo; se possível, também evitam a cor dos GR.
  - Se nenhum ficar distinto, o visitante (ou, em último caso, a casa) muda de equipamento em `matchKits`.
  - Em 372 combinações PT/ES: amarelo 218, verde fluorescente 130, preto 24. Mínimo: Barcelona–Palma com árbitros de preto.
- `keepInside()` em `choreo.ts`: em jogo corrido quem está dentro da quadra não sai.
  - O suplente que entra pela zona de substituição pode estar um instante fora.
  - Nunca joga a bola (receber, passar, rematar) fora da quadra.
- Verificado num jogo inteiro (4-0 contra 2-2): no máximo 10 jogadores em campo; a figura sem etiqueta junto à câmara era o árbitro.

## Realização TV e plano para a "sensação de TV" (2 novembro 2026, Claude)
- O António quer que o 3D pareça um jogo de futsal visto na TV, como o FM consegue com o futebol.
- Feito: realização da câmara TV (ver `docs/ANALISE_3D.md`).
- Próximos passos, por ordem de impacto:
  1. Decisão por leitura do jogo (Fase 1 da evolução tática).
  2. Defesa coordenada (gatilhos de pressão, coberturas).
  3. Física simples da bola.
  4. Animações: apoios, receções, tipos de remate e de defesa do GR.
  5. Fadiga visível.
- O António pediu estas melhorias ("conto contigo") a 2/11.
- 2/11: aplicados os 5 pontos (decisão por leitura e identidade dos sistemas, defesa coordenada, física da bola, animações, fadiga visível). Ver `docs/ANALISE_3D.md`. O António autorizou ("deves aplicar todos").

## Auditoria 2026: implementação (2 novembro 2026, Claude)
- Ver `docs/ANALISE_3D.md` (secção "Auditoria de 2026").
- Novas ferramentas: `tools/diag/engine.ts` (motor, 5 épocas), `tools/diag/careers.ts` (despedimentos), `tools/diag/ball.ts` (sincronização jogador–bola).
- Os testes criam equipas novas em cada corrida, porque a IA muda a tática durante o jogo.
- Ainda por fazer:
  - restos de saltos da bola (~0,16% do tempo);
  - mais variedade de gestos de GR e de desarmes;
  - transições entre câmaras e repetições.

---

## Snapshot para a próxima IA — 2 novembro 2026 (Claude)

**Onde está o trabalho mais recente:**
- branch `claude/awesome-hypatia-l5i9xc`, PR #6 (draft, sem merge);
- a PR inclui as PR #3, #4 e #5 (e tem por base a #5);
- `main` continua no commit da Fase 0 (`15a3bb3`): o que se abre no StackBlitz por omissão NÃO tem as melhorias.

**Feito na PR #6** (pormenor e números em `docs/ANALISE_3D.md`):
- 3D: corrida, GR (posição, reação, voo aprovado pelo António, defesa com o pé), separação dos corpos, defesa à zona, pressão por gatilhos e imediata, desmarcações e espaço, proteção de bola aos saltinhos, câmara TV, repetições, árbitros, marcador do 3D, troféu.
- IA tática: `tacticalAI.ts` escolhe o sistema pelo perfil do plantel; mudanças táticas durante o jogo.
- Direção: `shouldSack`.
- Sincronização bola–jogador.

**Ferramentas de validação** (correr antes e depois de mexer):
| Comando | Para quê |
|---|---|
| `npm test` | o motor dá o mesmo jogo com e sem a coreografia |
| `npm run diag -- --seed base --jogos 12 --nome x --atributos` | métricas táticas |
| `tools/diag/engine.ts` | 5 épocas do motor; real: 6,38 golos, 49,6/13,5/37,0 |
| `tools/diag/seasons.ts` | épocas pela coreografia 3D, anomalias |
| `tools/diag/ball.ts` | sincronização da bola |
| `tools/diag/careers.ts` | despedimentos |

Todas as ferramentas em `tools/diag` correm com: `npx esbuild <ficheiro> --bundle --platform=node --format=esm --outfile=diagnostics/.x.mjs && node diagnostics/.x.mjs`.

**Pendente:**
- Etapa 12: outras ligas (a próxima é Itália, com dados no futsalportugal.com).
- Etapas 13-14.
- 3D:
  - ritmo de corrida ~146 m/min (real ~115-120, estimativa);
  - restos de saltos da bola (~0,13% do tempo);
  - GR a sair aos pés;
  - transições entre câmaras;
  - jogador lesionado a coxear.
- Dados: equipamentos alternativos de Espanha; equipas técnicas de 7 clubes portugueses.

**Regras do António:**
- Português europeu, conciso, tabelas.
- Realismo; dizer o que é estimativa.
- Testar no commit exato (tsc, build, testes, browser).
- Nunca fazer merge para `main` sem autorização.
- Não alterar o voo do GR aprovado.

## Champions League de futsal — dados recolhidos (2/11/2026)
- **Formato desde 2025/26** (UEFA):
  - 56 equipas de 52 federações;
  - ronda preliminar com 32 equipas em 8 mini-torneios;
  - ronda principal de 8 grupos de 4 (os detentores e as federações mais bem colocadas entram aqui);
  - oitavos e quartos a duas mãos;
  - Final Four (2026: Pesaro).
- **Ronda principal 2026/27** (futsalportugal.com, competição 57; o país de alguns clubes está por confirmar):
  - G1: FC Barcelona, Semey FC, Futsal Minerva, FK Lučenec
  - G2: Anderlecht, Kairat Almaty, TFK Beitar, United Galati
  - G3: Sporting CP, Stalitsa Minsk, MNK Olmissum, Étoile Lavalloise
  - G4: SL Benfica, HIT Kiev, ElPozo Murcia, Tigers Roermond
  - G5: Piast Gliwice, Buba Mara, Araz Naxçivan, Újpest
  - G6: Kauno Žalgiris, Unisport, Differdange 03, Doukas SAC
  - G7: L84 Torino, Luxol St. Andrews, Mad Max, Hjørring
  - G8: SC Athletic, FK Chrudim, Athletic Club Graz, Loznica-Grad 2018
- **Federações com 2 clubes:** Portugal, Espanha e Cazaquistão.
- **Fontes de dados:**
  - futsalportugal.com tem ligas completas só de Portugal, Espanha, Itália e Brasil (e a Champions);
  - as outras ligas precisam de outra fonte (zerozero através do Chrome do António);
  - neste servidor a Wikipédia está bloqueada.

## Itália (Serie A) — 2 novembro 2026 (Claude, branch `claude/awesome-hypatia-l5i9xc`, PR #6)

- Feito: formato oficial (Comunicati 027-029: 14 clubes, play-in 7-8/9-10 jogo único com `tieToHome`, play-off à melhor de 3 com jogo 1 em casa do pior, playout 11.º x 12.º a 2 mãos, Coppa Italia Final Eight, Supercoppa Final Four), castigos FIGC, 207 jogadores e 74 elementos de equipas técnicas reais (`src/data/ita/`, gerados por `tools/ita/collect.py`, `collect_players.py`, `build_ita.py`), emblemas, marcador/anúncios em italiano.
- Validação 3 épocas (`tools/diag/engine.ts`, agora com `porLiga`): Serie A 5,48 golos/jogo (PT 6,43, ES 6,31). Falta média real italiana para calibrar.
- Estimativas: lotações, reputação/riqueza/orçamento, nível de quem não tem historial, nacionalidade de 112 jogadores (Itália), árbitros fictícios (`REF_PAIRS_ITA`), interiores 3D genéricos.
- Por fazer: equipas italianas em `TEAM_LEVELS`/`LEAGUE_OF` do moneyball; calibrar golos; dados do António no modelo `docs/modelo_ligas_equipas.xlsx` (modelo de recolha para novas ligas).
- PR #6 não está em `main`; não fazer merge sem aprovação do António.

### Itália — dados reais (2 novembro 2026, noite)
- Média real Serie A 2021/22-2025/26 (divisionecalcioa5.it, jornadas da fase regular; 2022/23 incompleta por erro de ligação): 6,14 golos/jogo, casa 47,3%, empates 19,7%, fora 33,0%, <3 golos 7,7%. Calibração: `MatchOptions.goalFactor` (só Itália, `ITA_GOAL_FACTOR` = 1,16 em game.ts) → simulação 6,13 golos/jogo; Portugal e Espanha iguais (6,43 / 6,31). Empates: `MatchOptions.tieCaution` (só Itália, `ITA_TIE` = últimos 12 min da 2.ª parte empatados → eficácia ×0,5) + `ITA_GOAL_FACTOR` 1,24 → 5 épocas: 6,14 golos, casa 46,6%, empates 20,0% (real 6,14 / 47,3 / 19,7).
- Árbitros reais: 86 da C.A.N. 5 Élite (AIA, lista do António) em 43 duplas sorteadas; topo e temperamento estimativa.
- Cores dos clubes tiradas dos sites oficiais — nem sempre coincidem com o equipamento (Came Treviso não é verde, corrigida pelo António; Benevento, Giovinazzo, Padova, Capurso estimativa). Lotações reais de 6 pavilhões.
- Nacionalidades: 34 de 112 estimadas pelo nome (continuam `nationalityEstimated`).
- Por fazer: `TEAM_LEVELS`/`LEAGUE_OF` do moneyball; interiores 3D dos pavilhões (sem fotos); empates.
- PR #8 já está em `main` (aprovada pelo António).
- Atributos (moneyball): 1 299 fichas de jogo oficiais da Serie A e play-off 2021/22-2026/27 (`tools/ita/collect_matches.py` + `build_matchstats.py`) → jogos, golos e cartões por época para 204 de 207 jogadores (épocas italianas substituem as do futsalportugal). Jogos = 5 iniciais + quem entrou; nas fichas sem substituições (muitas desde 2024/25) contam todos os da ficha (estimativa). Clubes italianos em `TEAM_LEVELS`/`LEAGUE_OF` (Serie A = 70, estimativa). Nível médio dos 8 melhores subiu ~0,9 (Roma, Catania, Giovinazzo mais). Sem assistências nem minutos (não publicados).
- Equipamentos (3/11): 15 padrões (`KitPattern` em kits.ts, desenho comum ao 3D e SVG em `src/ui/kitPattern.ts`), mangas, gola, punhos (`cuffs`), risca lateral dos calções (`shortsStripe`) e GR real (`ClubKits.goalkeeper`, usado se não chocar). Itália: equipamentos reais dos 14 clubes a partir das fotos/notas do António (Petrarca pela descrição); imagem em `docs/equipamentos_italia.png`.
- Pavilhões (3/11): 13 interiores italianos (`ARENAS_ITA` em attendance.ts) a partir das fotos do António; lado sem foto repete o oposto (pedido do António). Lotações do António: Del Mauro 5 300, PalaCesaroni 2 000, Pala Pinto 2 500. Palazzetto Guazzaroni (Active Network) sem fotos: genérico. Vista 3D em `docs/pavilhoes_italia.jpg`. Pala Del Mauro com corrimãos (`rails`), entradas de setor (`vomitories`, 4 por lateral, 2 por topo) e bancadas até perto do teto (`roofGap` 1,8 m). PalaVesuvio com pista de atletismo (`ArenaProfile.track`, 7 m: as bancadas recuam e a pista é desenhada à volta; `docs/palavesuvio_pista.jpg`).
- Jogo rápido (3/11, pedido do António; `src/ui/screens/quick.ts`, botão no menu inicial): qualquer equipa das 3 ligas contra qualquer outra, em qualquer pavilhão (`Fixture.arenaId`, lido em `arenaOf`) ou campo neutro; escolhe quem controlo (casa, fora ou só ver) e se é a eliminar. Estado temporário (`newGame`), não é gravado. Competição/marcador/árbitros/anúncios pela liga da equipa da casa.
- Pavilhões italianos revistos foto a foto (3/11, pedido do António: "tal e qual como nas fotos"): cores por lado/anel (`seatZones`, com `ends`/`middle` e 'cimento'), degraus pintados (`stepZones`, `stepBand`), escadas pintadas (`stairColor`), entradas de setor por lado e anel (`vomZones`; Del Mauro: 2 por lateral no 1.º anel, 4 por topo no 2.º), sem faixa de cor nas paredes (`noBand`). Vista em `docs/pavilhoes_italia.jpg`.

## IA tática (3/11, pedido do António com 2 gravações; golo do Kutchy)
- Causas encontradas: (1) contra-ataque: o motor escolhia passe/remate ao acaso (62% passe) → 1x0 a esperar pelo colega; (2) na coreografia do contra-ataque os defensores ultrapassados ficavam "presos" atrás e em 40% dos 1x0 ninguém defendia; (3) defesa à zona: quem marcava o lado contrário fechava ao meio até 80% (deixava o segundo poste livre: lance do Kutchy) e quem estava longe da bola reagia devagar às desmarcações; (4) colegas sem distância mínima de ocupação.
- Motor (`shot`, contra): `counterNum` [atacantes, defensores] pela aceleração/trabalho de equipa e aceleração/posicionamento/concentração; quem conduz decide rematar ou passar pela situação (sozinho perante o GR remata sempre, salvo colega já ao lado e bola aguentada, ~10%; 2x1 tende a passar) e pelos atributos (decisões, finalização, compostura, visão). Golos validados (5 épocas: PT 6,44, ES 6,14, IT 6,29).
- Coreografia: perseguidor do portador e recuperação para a frente da baliza (`counterRun`); marcação pela ameaça (`threatOf` em `defend`: perto da baliza, por dentro, a atacar a baliza → marcado de perto mesmo longe da bola), leitura antecipada de quem corre, sprint a acompanhar desmarcações, troca de marcação no individual quando os atacantes cruzam, 2 m mínimos entre defensores, em inferioridade fica livre o menos perigoso; ataque com 2,5 m mínimos entre colegas (`separate`).
- Testes: `tools/diag/ia.ts` (cenários 1-12; antes/depois em `diagnostics/ia-antes.json` e `ia-depois.json`); diagnóstico tático `diagnostics/ia-tatica.md` vs `main-antes`.

## Correções de sincronização e 3D (4/11, pedido do António: 7 problemas)
| Problema | Causa | Correção |
|---|---|---|
| Golos do 2D sem correspondência no 3D (hat-trick do Erick Mendonça) | Na recarga a coreografia dava o remate ao atacante mais perto da bola, não ao marcador do motor (golo visto com outro jogador) | `rebound` usa sempre `a.shooter` |
| Cantos sem a bola sair | Bola só saía pela linha de fundo por sorteio (30%), independente do canto; o motor dava canto mesmo com a bola agarrada pelo GR | `shot`: `cornerNext` decide se sai pela linha de fundo; motor só dá canto se a bola não ficou nas mãos (0,4 dos não agarrados) |
| Penáltis por faltas fora da área | Só 1,5 s para conduzir até à área (deslizava até lá); a queda era de outro jogador quando a bola não estava com a vítima | 4,4 s de condução, chega antes do contacto; a vítima do motor recebe a bola antes |
| GR não defende remates à figura | Alvo do golo sorteado sem olhar ao GR | golo entra longe do corpo (≥0,95 m) ou rasteiro/alto |
| GR cai cedo | Gesto começava 0,1 s após o remate | começa só o tempo do gesto antes da bola (voo 0,45 s, espargata 0,33 s, outros 0,3 s) |
| Pés no chão | Pose sem contacto com o piso (solas 5-23 cm abaixo) | `pose` mede a sola mais baixa e sobe o corpo (exceto o voo aprovado) |
| Pivô a proteger | Colegas sem chaves durante a proteção | `pivotSupport` (apoio, segundo poste, equilíbrio); o fixo marca o pivô |
- Testes: `tools/diag/sync.ts` (20 jogos): golos com remate visível 100%, marcador certo 97,3→100%, cantos com bola fora 82,7→100%, penáltis dentro da área 50→100%, golos a <0,5 m do GR 37,8→0%, gestos >0,6 s antes da bola 7→2,6%, pivô: colegas parados 23→20,5%. Motor 5 épocas: PT 6,33, ES 6,01, IT 6,08.
