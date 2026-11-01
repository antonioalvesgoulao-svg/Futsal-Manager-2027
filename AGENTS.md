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
1. Criar uma branch descritiva a partir da base correta.
2. Fazer uma alteração focada, com escopo e risco explícitos.
3. Executar os comandos de validação disponíveis no projeto (consultar `package.json`); no mínimo `npm run build` e, quando aplicável, `npm run diag -- --seed base --jogos 12 --nome ci`.
4. Se não for possível executar localmente, dizer isso e não simular resultados.
5. Rever o diff e confirmar que não há alterações acidentais.
6. Commitar na branch e abrir/atualizar uma PR para `main`.
7. Reportar SHA, branch, PR, testes efetivamente executados e limitações.
8. Aguardar aprovação explícita antes de qualquer merge.
9. Atualizar `HANDOFF.md` após cada marco técnico. Atualizar também `docs/ARCHITECTURE.md` quando mudar a arquitetura/fronteira entre módulos, `docs/GAMEPLAY_RULES.md` quando mudar regras ou princípios de jogo, `CLAUDE.md` quando mudar instruções específicas do Claude e `README.md` quando mudar a navegação/documentação pública. Atualizar `AGENTS.md` quando mudar o processo comum a agentes ou algum princípio inegociável.

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
- A documentação é parte integrante da entrega: uma alteração relevante não está concluída até o `HANDOFF.md` e os documentos técnicos aplicáveis estarem atualizados. Não é necessário alterar todos os ficheiros em cada commit; atualizar apenas os que foram afetados.
