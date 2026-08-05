-- Seed: banco de questões MSLQ (44 perguntas / 13 construtos)
-- Fonte: datasets/mslq.csv (Streamlit). Escala de resposta: 1 a 7.
--
-- NOTA (diferença deliberada em relação ao Streamlit): q35, q36 e q41 são itens
-- de pontuação invertida no MSLQ original (marcados "(Reversa)" no próprio texto
-- da pergunta). O app Streamlit calculava a média dos construtos usando o valor
-- bruto dessas perguntas, sem inverter — o que não é o cálculo psicométrico
-- correto do MSLQ. Aqui marcamos `reversa = true` para esses 3 itens e o cálculo
-- de score do construto (na aplicação) usa (8 - valor) para eles antes de tirar
-- a média. Isso muda ligeiramente os números de "Autorregulação Metacognitiva" e
-- "Administração de Esforços" em relação ao que o Streamlit mostrava. Avise se
-- preferir replicar o comportamento antigo (sem inversão).

insert into public.mslq_questions (id_questao, ordem, tipo, constructo, dsc_questao, reversa) values
('q1', 1, 'Escalas de Motivacao', 'Orientação a Metas Intrínsecas', 'Prefiro um trabalho de classe desafiador em que eu possa aprender coisas novas.', false),
('q2', 2, 'Escalas de Motivacao', 'Orientação a Metas Intrínsecas', 'Costumo escolher tópicos de assuntos dos quais aprenderei algo, mesmo que exijam mais trabalhos.', false),
('q3', 3, 'Escalas de Motivacao', 'Orientação a Metas Extrínsecas', 'Comparado com outros alunos desta turma, espero ter sucesso.', false),
('q4', 4, 'Escalas de Motivacao', 'Orientação a Metas Extrínsecas', 'Eu acho que vou receber uma boa nota nesta aula.', false),
('q5', 5, 'Escalas de Motivacao', 'Valorização da Atividade', 'É importante para mim aprender o que está sendo ensinado na aula.', false),
('q6', 6, 'Escalas de Motivacao', 'Valorização da Atividade', 'Gosto do que estou aprendendo na aula.', false),
('q7', 7, 'Escalas de Motivacao', 'Valorização da Atividade', 'Acho que vou poder usar o que aprendi nesta aula em outras aulas.', false),
('q8', 8, 'Escalas de Motivacao', 'Valorização da Atividade', 'Acho que o que estou aprendendo nesta aula é útil para meu aprendizado.', false),
('q9', 9, 'Escalas de Motivacao', 'Valorização da Atividade', 'Eu acho que o que estamos aprendendo nesta aula é interessante.', false),
('q10', 10, 'Escalas de Motivacao', 'Valorização da Atividade', 'Entender esse assunto é importante para mim.', false),
('q11', 11, 'Escalas de Motivacao', 'Controle do Aprendizado', 'Comparado com os outros alunos, acho que sou um bom aluno.', false),
('q12', 12, 'Escalas de Motivacao', 'Controle do Aprendizado', 'Minhas habilidades de estudo são excelentes em comparação com outras pessoas nesta classe.', false),
('q13', 13, 'Escalas de Motivacao', 'Controle do Aprendizado', 'Comparado com outros alunos desta turma, acho que sei bastante sobre o conteúdo.', false),
('q14', 14, 'Escalas de Motivacao', 'Autoeficácia para Aprendizado', 'Estou certo de que posso entender as ideias ensinadas neste curso.', false),
('q15', 15, 'Escalas de Motivacao', 'Autoeficácia para Aprendizado', 'Espero me sair muito bem nesta aula.', false),
('q16', 16, 'Escalas de Motivacao', 'Autoeficácia para Aprendizado', 'Tenho certeza de que posso fazer um excelente trabalho nos problemas e tarefas atribuídos a esta classe.', false),
('q17', 17, 'Escalas de Motivacao', 'Autoeficácia para Aprendizado', 'Eu sei que poderei aprender o material para esta aula.', false),
('q18', 18, 'Escalas de Motivacao', 'Ansiedade em Testes', 'Fico tão nervoso durante uma prova que não consigo lembrar dos assuntos que aprendi.', false),
('q19', 19, 'Escalas de Motivacao', 'Ansiedade em Testes', 'Sinto uma sensação desconfortável e chateada quando faço uma prova.', false),
('q20', 20, 'Escalas de Motivacao', 'Ansiedade em Testes', 'Preocupo-me muito com testes.', false),
('q21', 21, 'Escalas de Motivacao', 'Ansiedade em Testes', 'Quando faço uma prova, penso em como estou mal.', false),
('q22', 22, 'Escalas de Motivacao', 'Ansiedade em Testes', 'Quando estudo para uma prova, tento lembrar o máximo de fatos que consigo.', false),
('q23', 23, 'Escalas de Estratégias de aprendizagem', 'Ensaio (memorização)', 'Quando faço a lição de casa, tento lembrar o que o professor disse em sala de aula para que eu possa responder as perguntas corretamente.', false),
('q24', 24, 'Escalas de Estratégias de aprendizagem', 'Ensaio (memorização)', 'Trabalho em exercícios práticos e respondo às perguntas do final do capítulo, mesmo quando não precise.', false),
('q25', 25, 'Escalas de Estratégias de aprendizagem', 'Ensaio (memorização)', 'Quando estudo para uma prova, pratico, repetindo os fatos importantes repetidamente para eu mesmo.', false),
('q26', 26, 'Escalas de Estratégias de aprendizagem', 'Ensaio (memorização)', 'Uso o que aprendi com as tarefas de casa antigas e o livro didático para fazer novas atribuições.', false),
('q27', 27, 'Escalas de Estratégias de aprendizagem', 'Ensaio (memorização)', 'Quando leio os materiais para esta aula, digo repetidamente as palavras para mim mesmo para que me ajude a lembrar.', false),
('q28', 28, 'Escalas de Estratégias de aprendizagem', 'Elaboração', 'Quando estudo para uma prova, tento reunir as informações da aula em um caderno.', false),
('q29', 29, 'Escalas de Estratégias de aprendizagem', 'Elaboração', 'Ao ler, tento conectar as coisas sobre as quais estou lendo com o que já conheço.', false),
('q30', 30, 'Escalas de Estratégias de aprendizagem', 'Organização', 'É difícil para mim decidir quais são as principais ideias no que leio.', false),
('q31', 31, 'Escalas de Estratégias de aprendizagem', 'Organização', 'Ao estudar, faço anotações para me lembrar do assunto que estudei.', false),
('q32', 32, 'Escalas de Estratégias de aprendizagem', 'Organização', 'Descrevo os capítulos do meu livro para me ajudar a estudar.', false),
('q33', 33, 'Escalas de Estratégias de aprendizagem', 'Pensamento Crítico', 'Quando estudo, coloco ideias importantes em minhas próprias palavras.', false),
('q34', 34, 'Escalas de Estratégias de aprendizagem', 'Autorregulação Metacognitiva', 'Faço perguntas para ter certeza de que conheço o material que tenho estudado.', false),
('q35', 35, 'Escalas de Estratégias de aprendizagem', 'Autorregulação Metacognitiva', 'Costumo achar que sei sobre o assunto da aula, mas não sei do que se trata. (Reversa).', true),
('q36', 36, 'Escalas de Estratégias de aprendizagem', 'Autorregulação Metacognitiva', 'Acho que quando o professor está falando, penso em outras coisas e realmente não ouço o que ele está dizendo. (Reversa).', true),
('q37', 37, 'Escalas de Estratégias de aprendizagem', 'Autorregulação Metacognitiva', 'Quando estou estudando um conteúdo, tento fazer com que tudo se encaixe.', false),
('q38', 38, 'Escalas de Estratégias de aprendizagem', 'Autorregulação Metacognitiva', 'Quando estou lendo, paro de vez em quando e repito o que li.', false),
('q39', 39, 'Escalas de Estratégias de aprendizagem', 'Tempo e Ambiente de Estudo', 'Antes de começar a estudar, penso nas coisas que precisarei fazer para aprender.', false),
('q40', 40, 'Escalas de Estratégias de aprendizagem', 'Administração de Esforços', 'Mesmo quando vou mal em uma prova, tento aprender com meus erros.', false),
('q41', 41, 'Escalas de Estratégias de aprendizagem', 'Administração de Esforços', 'Quando o trabalho é difícil, desisto ou estudo apenas as partes fáceis. (Reversa).', true),
('q42', 42, 'Escalas de Estratégias de aprendizagem', 'Administração de Esforços', 'Eu sempre tento entender o que o professor está dizendo, mesmo que isso não faça sentido.', false),
('q43', 43, 'Escalas de Estratégias de aprendizagem', 'Administração de Esforços', 'Mesmo quando os materiais de estudo são monótonos e desinteressantes, continuo fazendo a tarefa até terminar.', false),
('q44', 44, 'Escalas de Estratégias de aprendizagem', 'Administração de Esforços', 'Trabalho duro para obter uma boa nota, mesmo quando não gosto de uma aula.', false)
on conflict (id_questao) do update set
  ordem = excluded.ordem,
  tipo = excluded.tipo,
  constructo = excluded.constructo,
  dsc_questao = excluded.dsc_questao,
  reversa = excluded.reversa;
