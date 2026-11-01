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

## Próximos passos
1. Verificar estado atual da PR #3 e checks do SHA exato `ac61e633...`.
2. Inspecionar `src/core/types.ts` e validar atributos/posições usados por `movement.ts`.
3. Corrigir tipos e limites numéricos na mesma branch/PR, se necessário.
4. Inspecionar a interface entre `choreo.ts` e a renderização.
5. Integrar primeiro num cenário controlado de ataque organizado 4-0, sem alterar o resultado decidido pelo motor.
6. Comparar jogadores com atributos altos/baixos sob a mesma intenção; a diferença deve ser visível, moderada e coerente.
7. Validar build, diagnóstico e observação visual; registar limitações.

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
