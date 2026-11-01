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
- `Choreo` calcula os perfis físicos por jogador. Apenas os jogadores de campo da equipa em posse, quando o sistema ofensivo é 4-0, recebem aceleração e agilidade individuais no bake das trajetórias.
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
