# Futsal Manager 2027 — instruções para agentes de IA

Estas instruções aplicam-se a qualquer assistente de programação (ChatGPT/Codex, Claude Code, Cursor ou equivalente).

## Antes de começar
1. Ler `HANDOFF.md` para conhecer o estado e o próximo passo.
2. Ler `docs/ARCHITECTURE.md` e `docs/GAMEPLAY_RULES.md`.
3. Ler também `CLAUDE.md` para o contexto funcional e histórico mais extenso.
4. Verificar o estado real do GitHub: branch atual, commits recentes, PRs abertas/fechadas e checks CI. A documentação pode estar desatualizada.
5. Inspecionar os ficheiros relevantes antes de propor ou alterar código. Não assumir que uma descrição antiga corresponde à implementação atual.
6. Antes de terminar qualquer etapa relevante, atualizar a documentação afetada e o `HANDOFF.md` com o estado real, decisões, ficheiros, SHA/PR, validações executadas e próximo passo. Não deixar a documentação para uma futura sessão.

## Regras de colaboração com o António
- Comunicar em português europeu, de forma clara, direta e prática.
- O António não é programador: explicar impacto, riscos e como testar sem exigir comandos manuais desnecessários.
- Tomar iniciativa em tarefas técnicas reversíveis. Perguntar apenas quando existir uma decisão real de produto/jogabilidade ou risco significativo.
- Não pedir autorização repetidamente para cada passo técnico.
- Nunca fazer merge de uma Pull Request para `main` sem aprovação explícita do António.
- Não fazer push direto para `main`. Criar uma branch de trabalho e abrir/atualizar uma PR.
- Não fechar PRs, apagar branches ou descartar trabalho sem necessidade clara.
- Não afirmar que algo foi testado, validado, implementado ou publicado sem evidência concreta.
- Distinguir claramente: implementado, compilado, testado em simulação, testado visualmente e aprovado pelo utilizador.
- Preservar alterações existentes e evitar reescritas amplas sem necessidade.

## Princípios de produto inegociáveis
- É um **manager de futsal**, não um simulador de futebol de 11.
- O jogo é 5v5, com guarda-redes, substituições volantes, espaço reduzido, faltas acumuladas, 4-0, 3-1, 2-2, 5x4, pivô, fixo, alas e transições próprias do futsal.
- A prioridade é a qualidade tática e a credibilidade do jogo; o grafismo é secundário.
- As movimentações devem refletir os atributos individuais. Jogadores diferentes não podem executar automaticamente o mesmo movimento com a mesma velocidade, timing, qualidade, leitura ou fiabilidade.
- Atributos físicos, técnicos, cognitivos e coletivos devem ter efeitos distintos e coerentes. Qualidade de movimento não é a mesma coisa que probabilidade de sucesso de passe/remate.
- Não tornar todos os jogadores taticamente perfeitos. Atributos, posição, fadiga, contexto e qualidade de decisão devem produzir diferenças observáveis.
- O motor de resultados é a autoridade do resultado desportivo. A camada visual/tática não pode alterar resultados por acidente.
- Preservar a experiência de jogo existente e introduzir mudanças em passos pequenos e verificáveis.

## Fluxo técnico obrigatório
1. Criar uma branch descritiva a partir da base correta. Se uma alteração depender de uma PR ainda não integrada, criar uma PR empilhada sobre a branch dessa PR e declarar explicitamente a dependência; não abrir uma PR para `main` que esconda essa dependência.
2. Fazer uma alteração focada, com escopo e risco explícitos.
3. Executar os comandos de validação disponíveis no projeto (consultar `package.json`); no mínimo `npm run build` e, quando aplicável, `npm run diag -- --seed base --jogos 12 --nome ci`.
4. Se não for possível executar localmente, dizer isso e não simular resultados.
5. Rever o diff e confirmar que não há alterações acidentais.
6. Commitar na branch e abrir/atualizar uma PR para `main`.
7. Reportar SHA, branch, PR, testes efetivamente executados e limitações.
8. Aguardar aprovação explícita antes de qualquer merge.
9. Em cada marco técnico relevante, atualizar obrigatoriamente tanto `HANDOFF.md` como este `AGENTS.md`: o primeiro regista o estado concreto do projeto e o segundo mantém atuais as instruções para os agentes seguintes. Atualizar ainda `docs/ARCHITECTURE.md` quando mudar a arquitetura/fronteira entre módulos, `docs/GAMEPLAY_RULES.md` quando mudar regras ou princípios de jogo, `CLAUDE.md` quando mudar instruções específicas do Claude e `README.md` quando mudar a navegação/documentação pública.

## Diagnóstico e calibração
- Métricas geométricas são proxies; não as apresentar como prova de intenção tática.
- Comparar simulações com a mesma seed, parâmetros e versão de schema.
- Registar parâmetros, seed, número de jogos, commit e duração da amostra.
- Não ajustar o motor de resultados para mascarar problemas visuais/táticos.
- Alterações de comportamento devem ser avaliadas com métricas e observação de lances representativos.

## Contexto e continuidade
- `HANDOFF.md` contém o ponto de situação conhecido e a próxima tarefa.
- `docs/ARCHITECTURE.md` descreve a arquitetura e as fronteiras entre sistemas.
- `docs/GAMEPLAY_RULES.md` regista os princípios e regras específicas de futsal.
- `CLAUDE.md` contém contexto histórico detalhado e instruções adicionais.
- O GitHub é a fonte de verdade. Se houver divergência entre estes documentos e o código/estado atual do GitHub, verificar e atualizar a documentação antes de continuar.
- A documentação é parte integrante da entrega: uma alteração relevante não está concluída até `HANDOFF.md` e `AGENTS.md` estarem atualizados, juntamente com os documentos técnicos aplicáveis. Não é necessário alterar todos os restantes ficheiros em cada commit; atualizar os que foram afetados.
- PRs empilhadas devem identificar no título/corpo a PR e branch de que dependem. Não declarar uma PR pronta para merge isoladamente se a sua base ainda não estiver integrada.


## Preservação do estado funcional já desenvolvido

- O projeto já contém um conjunto substancial de funcionalidades de manager, competições, mercado, scouting, staff, regras, bolas paradas e apresentação 3D. Não o tratar como um protótipo novo nem limitar a leitura do projeto às PRs de diagnóstico/movimento.
- Ao retomar trabalho, cruzar o `HANDOFF.md` com o histórico recente de commits e o código atual de `main` e das branches relevantes. O handoff é um mapa de continuidade, não uma lista exaustiva de funcionalidades nem substituto da inspeção do repositório.
- Preservar funcionalidades existentes ao desenvolver a simulação tática. Validar regressões em áreas adjacentes quando uma alteração as possa afetar.

## Testes e diagnóstico com atributos (1/11/2026)
- `npm test` corre os testes do movimento e o cenário 4-0 de jogo completo (`tools/tests/scenario40.test.ts`). O cenário confirma que o motor dá o mesmo jogo com e sem dados dos jogadores na coreografia.
- `npm run diag -- ... --atributos` mede a coreografia como o jogo ao vivo. Sem `--atributos`, os números continuam comparáveis com `diagnostics/atual.json`. Comparar sempre versões corridas com a mesma opção.
- Os GR e os defensores mudam quando os atacantes mudam: reagem ao lance e as posses encadeiam-se. Não exigir trajetórias iguais fora dos jogadores alterados.
- Locomoção 3D (`pose` em player3d): a passada depende de `Actor.fwd`/`Actor.side` (frente, costas, lado). Não voltar a rodar o corpo para a direção da corrida a baixa velocidade. Os defensores olham para o jogo.
- Física individual (aceleração/agilidade) aplica-se a todos os jogadores de campo em todos os sistemas. Os GR mantêm os seus limites.
- Voo do GR (`pose`, case 'dive' em player3d.ts): versão aprovada pelo António a 2/11/2026 (commit 7c54d23). Não alterar sem pedido dele.
