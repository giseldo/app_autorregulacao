-- Seed: catálogo de recomendações automáticas (dicas.csv do Streamlit)
-- e o mapeamento explícito construto → template, usado para sugerir
-- automaticamente um template quando um construto do MSLQ pontua baixo.
-- "Pensamento Crítico" não tem template dedicado — mesma lacuna que já
-- existia no app Streamlit (só 9 dicas cobrindo 12 dos 13 construtos).

insert into public.recommendation_templates (id, tipo, titulo, constructo_grupo, texto) values
(1, 'Escalas de Motivação', 'Motivação', 'Interesse (Orientação a metas intrínsecas, Orientação a metas extrínsecas, Valorização da atividade e Controle do aprendizado)', 'Leia rapidamente a lista com os conteúdos do seu material didático ou o programa da disciplina. / Faça uma lista dos três tópicos que mais te interessam e dos três tópicos que menos te interessam. / Preste atenção a esses tópicos em particular. / O que nos três tópicos mais interessantes faz com que você goste tanto deles? / O que faz os três outros tópicos desinteressantes? / Você encontra alguma característica dos três tópicos mais interessantes nos tópicos menos interessantes? / Se você conseguir identificar o quê, nos três tópicos mais interessantes, faz com que você goste deles, talvez você seja capaz de aplicar o que encontrou aos três menos interessantes. / E talvez você descubra que os tópicos desinteressantes não são tão desinteressantes assim!'),
(2, 'Escalas de Motivação', 'Motivação', 'Expectativa de Sucesso', 'Avalie como você aborda as tarefas da disciplina sob diferentes pontos de vista. / Descreva a eficácia e a ineficácia da sua abordagem a partir do seu ponto de vista. / Imagine como um colega de classe avaliaria a sua abordagem. / Ao analisar a forma como você lida com uma tarefa, você pode ser capaz de descobrir o que está fazendo certo e o que está fazendo errado e então pode mudar a sua abordagem. / A sua confiança em ter um bom desempenho pode aumentar ao compreender melhor a forma como você estuda, o que funciona e o que não funciona.'),
(3, 'Escalas de Motivação', 'Motivação', 'Ansiedade em testes', 'Desenvolver boas habilidades de estudo resulta em menor ansiedade. / Prepare-se bem para as aulas e tente terminar as tarefas pontualmente. / Não espere até o último minuto para realizar as tarefas ou para se preparar para uma prova. / Isso ajudará você a se tornar confiante em situações de teste e talvez reduza a sua ansiedade. / Ao fazer uma prova, concentre-se em um item de cada vez; se estiver com dificuldades em uma questão, siga em frente e volte a essa questão depois. / Lembre-se de que se você está bem preparado; se não conseguir responder algumas questões, tudo bem, você ainda será capaz de responder as outras.'),
(4, 'Escalas de Estratégias de Aprendizagem', 'Estratégia Cognitiva', 'Ensaio (memorização)', 'Liste os termos e tópicos importantes da disciplina. / Defina-os e os repita em voz alta. / Divida essa lista em listas menores compostas de termos que se relacionam. / Construa imagens ou rimas que te ajudarão a lembrar dessas listas. / Faça perguntas que ajudarão você a avaliar se você se lembra delas ou não.'),
(5, 'Escalas de Estratégias de Aprendizagem', 'Estratégia Cognitiva', 'Elaboração', 'Parafraseie e resuma as informações importantes. / Use suas próprias palavras para descrever o conteúdo visto durante as aulas ou em leituras específicas. / Faça de conta que você é o professor e está tentando explicar a matéria para os alunos. / Tente descobrir como cada tópico da matéria se relaciona com os outros. / Quais são as relações entre o que você ouviu em sala de aula, conversou em discussões e leu no livro?'),
(6, 'Escalas de Estratégias de Aprendizagem', 'Estratégia Cognitiva', 'Organização', 'Faça um resumo do seu material da disciplina e identifique onde seu texto e a aula se sobrepõem e não se sobrepõem. / Isso vai dar a você um ponto de partida para estabelecer conexões entre ideias apresentadas em dois contextos diferentes. / Faça gráficos, diagramas ou tabelas dos conceitos importantes. / Organogramas ou diagramas de árvore geralmente são bastante úteis para ajudar a entender como as ideias se reúnem diferentemente.'),
(7, 'Escalas de Estratégias de Aprendizagem', 'Autorregulação Metacognitiva', 'Autorregulação Metacognitiva', 'Leia rapidamente seu material antes de começar a ver como ele está organizado. / Olhe para os títulos e subtítulos do texto para ter uma ideia de como as coisas se relacionam umas com as outras. / Enquanto estiver lendo, faça perguntas a si mesmo sobre o parágrafo que acabou de ler e escreva palavras-chave nas margens do livro ou em um caderno. / Tente determinar quais conceitos você não compreende bem. / Apesar de esse método demorar bastante no início, você tem mais chance de se lembrar do que leu. / Isso economizará seu tempo depois quando estudar para a prova.'),
(8, 'Escalas de Estratégias de Aprendizagem', 'Administração dos estudos', 'Tempo e Ambiente de Estudo', 'Acompanhe o que você faz no seu tempo de estudo durante uma semana. / Escreva seus objetivos para cada período de estudo e anote o que você realmente cumpriu durante esse tempo. / Analise o resultado ao final de uma semana. / Talvez você precise mudar seu local de estudo, o período de estudo ou com quem você estuda. / Tente criar uma agenda que funcione bem para você.'),
(9, 'Escalas de Estratégias de Aprendizagem', 'Administração dos estudos', 'Administração de Esforços', 'Faça uma lista dos tópicos que você deixa para estudar no outro dia. / Tente analisar por que você adia estudar esses tópicos conversando com outros alunos. / Ao falar com eles, talvez você considere uma abordagem que te ajude a agir mais rapidamente ao invés de demorar a estudar o material.')
on conflict (id) do update set
  tipo = excluded.tipo,
  titulo = excluded.titulo,
  constructo_grupo = excluded.constructo_grupo,
  texto = excluded.texto;

insert into public.recommendation_template_constructs (template_id, constructo) values
(1, 'Orientação a Metas Intrínsecas'),
(1, 'Orientação a Metas Extrínsecas'),
(1, 'Valorização da Atividade'),
(1, 'Controle do Aprendizado'),
(2, 'Autoeficácia para Aprendizado'),
(3, 'Ansiedade em Testes'),
(4, 'Ensaio (memorização)'),
(5, 'Elaboração'),
(6, 'Organização'),
(7, 'Autorregulação Metacognitiva'),
(8, 'Tempo e Ambiente de Estudo'),
(9, 'Administração de Esforços')
on conflict (template_id, constructo) do nothing;
