-- Troca o banco de questões do MSLQ clássico (44 itens/13 construtos) pelo
-- instrumento realmente usado no experimento da tese (34 itens/6 construtos:
-- Motivação, Metacognição, Estratégias de Aprendizado, Autocontrole Emocional,
-- Ambiente de Estudo, Autonomia e Autodisciplina). Fonte: cabeçalho de
-- "PRÉ TESTE - TODOS.xlsx" (texto das 34 perguntas) + agrupamento por construto
-- de "RECOMENDAÇOES.xlsx" (cabeçalhos mesclados), cuja coluna "Média <construto>"
-- bate exatamente com a média simples dos itens do grupo — confirma que nenhum
-- item deste instrumento é de pontuação invertida (reversa = false em todos).
--
-- mslq_applications/mslq_answers estavam vazias em produção no momento da troca
-- (nenhum aluno havia respondido pelo app ainda), então não há dado real
-- perdido ao apagar as 44 linhas antigas.

delete from public.mslq_answers;
delete from public.mslq_questions;

insert into public.mslq_questions (id_questao, ordem, tipo, constructo, dsc_questao, reversa) values
('q1', 1, 'Motivação', 'Motivação', 'Estou confiante que posso concluir as atividades da disciplina com sucesso.', false),
('q2', 2, 'Motivação', 'Motivação', 'Eu acredito que sou capaz de aprender o conteúdo da minha disciplina.', false),
('q3', 3, 'Motivação', 'Motivação', 'Eu consigo me motivar a começar minhas tarefas, mesmo quando não estou com vontade.', false),
('q4', 4, 'Motivação', 'Motivação', 'Eu fico motivado(a) a estudar porque acho o conteúdo interessante.', false),
('q5', 5, 'Motivação', 'Motivação', 'Eu acho que as atividades da disciplina são relevantes para meus objetivos pessoais e profissionais.', false),
('q6', 6, 'Motivação', 'Motivação', 'Eu defino metas claras para o que quero alcançar em cada momento de estudo.', false),
('q7', 7, 'Metacognição', 'Metacognição', 'Durante o estudo, paro para verificar se realmente estou entendendo o conteúdo.', false),
('q8', 8, 'Metacognição', 'Metacognição', 'Mudo minha forma de estudar quando percebo que não estou entendendo o conteúdo.', false),
('q9', 9, 'Metacognição', 'Metacognição', 'Após uma atividade, penso se a estratégia de estudo que usei funcionou bem.', false),
('q10', 10, 'Metacognição', 'Metacognição', 'Eu planejo minha abordagem de estudo antes de começar uma tarefa.', false),
('q11', 11, 'Metacognição', 'Metacognição', 'Eu analiso minhas falhas para melhorar meu desempenho em futuras atividades.', false),
('q12', 12, 'Estratégias de Aprendizado', 'Estratégias de Aprendizado', 'Eu estabeleço metas específicas para guiar meu estudo.', false),
('q13', 13, 'Estratégias de Aprendizado', 'Estratégias de Aprendizado', 'Eu faço resumos ou mapas mentais para ajudar a compreender o material.', false),
('q14', 14, 'Estratégias de Aprendizado', 'Estratégias de Aprendizado', 'Eu organizo meus materiais de estudo para que sejam facilmente acessíveis durante o aprendizado.', false),
('q15', 15, 'Estratégias de Aprendizado', 'Estratégias de Aprendizado', 'Eu uso diferentes recursos, como vídeos, textos, exercícios, fóruns ou grupos de estudo, para complementar meu aprendizado.', false),
('q16', 16, 'Estratégias de Aprendizado', 'Estratégias de Aprendizado', 'Eu reviso regularmente, após cada momento de estudo, o material do curso para assegurar que eu compreendi o conteúdo.', false),
('q17', 17, 'Autocontrole Emocional', 'Autocontrole Emocional', 'Quando fico estressado(a) com minhas tarefas, eu sei como gerenciar esse estresse.', false),
('q18', 18, 'Autocontrole Emocional', 'Autocontrole Emocional', 'Eu consigo manter a calma e a concentração, mesmo quando enfrento dificuldades nas atividades.', false),
('q19', 19, 'Autocontrole Emocional', 'Autocontrole Emocional', 'Eu uso técnicas específicas para gerenciar minhas emoções durante o estudo.', false),
('q20', 20, 'Autocontrole Emocional', 'Autocontrole Emocional', 'Eu tento manter uma atitude positiva em relação às minhas tarefas de aprendizagem.', false),
('q21', 21, 'Autocontrole Emocional', 'Autocontrole Emocional', 'Eu lido bem com a frustração quando encontro dificuldades em meu estudo.', false),
('q22', 22, 'Ambiente de Estudo', 'Ambiente de Estudo', 'Quando encontro dificuldades, busco ajuda de colegas, monitores, professores, fóruns ou grupos de estudo.', false),
('q23', 23, 'Ambiente de Estudo', 'Ambiente de Estudo', 'Eu escolho um ambiente com poucas distrações para realizar minhas atividades de estudo.', false),
('q24', 24, 'Ambiente de Estudo', 'Ambiente de Estudo', 'Eu tenho um cronograma regular para minhas atividades de estudo.', false),
('q25', 25, 'Ambiente de Estudo', 'Ambiente de Estudo', 'Consulto o livro da disciplina ou acesso regularmente o AVA (Google Sala de Aula) da disciplina para consultar aulas, atividades e materiais complementares.', false),
('q26', 26, 'Ambiente de Estudo', 'Ambiente de Estudo', 'Eu mantenho meu espaço de estudo organizado e pronto para minhas sessões de aprendizado.', false),
('q27', 27, 'Ambiente de Estudo', 'Ambiente de Estudo', 'Antes de estudar, verifico se tenho os materiais necessários para o estudo, como arquivos, links, caderno, livro, computador ou celular.', false),
('q28', 28, 'Autonomia e Autodisciplina', 'Autonomia e Autodisciplina', 'Me sinto confortável em tomar decisões sobre minha própria aprendizagem (por exemplo, escolher que tópicos estudar primeiro).', false),
('q29', 29, 'Autonomia e Autodisciplina', 'Autonomia e Autodisciplina', 'Eu assumo a responsabilidade pelo meu próprio progresso na disciplina.', false),
('q30', 30, 'Autonomia e Autodisciplina', 'Autonomia e Autodisciplina', 'Eu me sinto responsável pelo meu próprio aprendizado e progresso na disciplina.', false),
('q31', 31, 'Autonomia e Autodisciplina', 'Autonomia e Autodisciplina', 'Eu tomo decisões sobre minha própria aprendizagem, como escolher que tópicos estudar primeiro.', false),
('q32', 32, 'Autonomia e Autodisciplina', 'Autonomia e Autodisciplina', 'Eu frequentemente avalio meu próprio desempenho e progresso na disciplina.', false),
('q33', 33, 'Autonomia e Autodisciplina', 'Autonomia e Autodisciplina', 'Eu ajusto meus métodos de estudo de acordo com as necessidades da disciplina.', false),
('q34', 34, 'Autonomia e Autodisciplina', 'Autonomia e Autodisciplina', 'Eu mantenho um registro das minhas atividades e progresso na disciplina.', false);

-- Remapeia os 9 templates de recomendação (conteúdo mantido, de datasets/dicas.csv)
-- dos 13 construtos MSLQ antigos para os 6 novos. "Pensamento Crítico" não
-- existe mais como construto — a lacuna que ele representava deixa de existir.
delete from public.recommendation_template_constructs;

insert into public.recommendation_template_constructs (template_id, constructo) values
(1, 'Motivação'),                    -- Interesse
(2, 'Motivação'),                    -- Expectativa de Sucesso / Autoeficácia
(3, 'Autocontrole Emocional'),       -- Ansiedade em testes
(4, 'Estratégias de Aprendizado'),   -- Ensaio (memorização)
(5, 'Estratégias de Aprendizado'),   -- Elaboração
(6, 'Estratégias de Aprendizado'),   -- Organização
(7, 'Metacognição'),                 -- Autorregulação Metacognitiva
(8, 'Ambiente de Estudo'),           -- Tempo e Ambiente de Estudo
(9, 'Autonomia e Autodisciplina');   -- Administração de Esforços
