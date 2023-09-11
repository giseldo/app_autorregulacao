import streamlit as st
import numpy as np

import matplotlib.pyplot as plt
import pandas as pd
from math import pi

st.title("Dados do aluno")

df = st.session_state["data"]

alunos = df["nome"]

aluno_selecionado = st.sidebar.selectbox("Aluno", alunos)

dados_aluno_selecionado = df[df["nome"] == aluno_selecionado].iloc[0]
st.title(dados_aluno_selecionado["nome"])

grafico, resumo, dados, notas, dicas_automaticas, dicas_do_professor,   = st.tabs(["Gráfico MSLQ", "Resumo MSLQ", "Dados MSLQ", "Notas Atividades", "Dicas Automaticas", "Dicas do professor"])

q1 = dados_aluno_selecionado["q1"]
q2 = dados_aluno_selecionado["q2"]
q3 = dados_aluno_selecionado["q3"]
q4 = dados_aluno_selecionado["q4"]
q5 = dados_aluno_selecionado["q5"]
q6 = dados_aluno_selecionado["q6"]
q7 = dados_aluno_selecionado["q7"]
q8 = dados_aluno_selecionado["q8"]
q9 = dados_aluno_selecionado["q9"]
q10 = dados_aluno_selecionado["q10"]
q11 = dados_aluno_selecionado["q11"]
q12 = dados_aluno_selecionado["q12"]
q13 = dados_aluno_selecionado["q13"]
q14 = dados_aluno_selecionado["q14"]
q15 = dados_aluno_selecionado["q15"]
q16 = dados_aluno_selecionado["q16"]
q17 = dados_aluno_selecionado["q17"]
q18 = dados_aluno_selecionado["q18"]
q19 = dados_aluno_selecionado["q19"]
q20 = dados_aluno_selecionado["q20"]
q21 = dados_aluno_selecionado["q21"]
q22 = dados_aluno_selecionado["q22"]

with dados:
    st.write("Q1 - motivacao - Orientação a Metas Intrínsecas - Prefiro um trabalho de classe desafiador em que eu possa aprender coisas novas:",  q1)
    st.write("Q2 - motivacao - Orientação a Metas Intrínsecas - Costumo escolher tópicos de assuntos dos quais aprenderei algo -  mesmo que exijam mais trabalhos:", q2)
    st.write("Q3 - motivacao - Orientação a Metas Extrínsecas - Comparado com outros alunos desta turma -  espero ter sucesso:", q3)
    st.write("Q4 - motivacao - Orientação a Metas Extrínsecas - Eu acho que vou receber uma boa nota nesta aula:", q4)
    st.write("Q5 - motivacao - Valorização da Atividade - É importante para mim aprender o que está sendo ensinado na aula:", q5)
    st.write("Q6 - motivacao - Valorização da Atividade - Gosto do que estou aprendendo na aula:", q6)
    st.write("Q7 - motivacao - Valorização da Atividade - Acho que vou poder usar o que aprendi nesta aula em outras aulas:", q7)
    st.write("Q8 - motivacao - Valorização da Atividade - Acho que o que estou aprendendo nesta aula é útil para meu aprendizado:", q8)
    st.write("Q9 - motivacao - Valorização da Atividade - Eu acho que o que estamos aprendendo nesta aula é interessante:", q9)
    st.write("Q10 - motivacao - Valorização da Atividade - Entender esse assunto é importante para mim:", q10)
    st.write("Q11 - motivacao - Controle do Aprendizado - Comparado com os outros alunos -  acho que sou um bom aluno:", q11)
    st.write("Q12 - motivacao - Controle do Aprendizado - Minhas habilidades de estudo são excelentes em comparação com outras pessoas nesta classe:", q12)
    st.write("Q13 - motivacao - Controle do Aprendizado - Comparado com outros alunos desta turma -  acho que sei bastante sobre o conteúdo:", q13)
    st.write("Q14 - motivacao - Autoeficácia para Aprendizado - Estou certo de que posso entender as ideias ensinadas neste curso:", q14)
    st.write("Q15 - motivacao - Autoeficácia para Aprendizado - Espero me sair muito bem nesta aula:", q15)
    st.write("Q16 - motivacao - Autoeficácia para Aprendizado - Tenho certeza de que posso fazer um excelente trabalho nos problemas e tarefas atribuídos a esta classe:", q16)
    st.write("Q17 - motivacao - Autoeficácia para Aprendizado - Eu sei que poderei aprender o material para esta aula:", q17)
    st.write("Q18 - motivacao - Ansiedade em Testes - Fico tão nervoso durante uma prova que não consigo lembrar dos assuntos que aprendi:", q18)
    st.write("Q19 - motivacao - Ansiedade em Testes - Sinto uma sensação desconfortável e chateada quando faço uma prova:", q19)
    st.write("Q20 - motivacao - Ansiedade em Testes - Preocupo-me muito com testes:", q20)
    st.write("Q21 - motivacao - Ansiedade em Testes - Quando faço uma prova -  penso em como estou mal:", q21)
    st.write("Q22 - motivacao - Ansiedade em Testes - Quando estudo para uma prova -  tento lembrar o máximo de fatos que consigo:", q22)
   
    
with resumo:
    #st.header("Aqui vai um resumo")
   
    media_orientacao_metas_intrinsecas = np.mean([q1, q2])
    media_orientacao_metas_extrinsicas = np.mean([q3, q4])
    media_valorizacao_da_atividade = np.mean([q5, q6, q7, q8, q9, q10])
    controle_do_aprendizado = np.mean([q11, q12, q13])
    autoeficacia_para_aprendizado = np.mean([q14, q15, q16, q17])
    ansiedade_em_testes = np.mean([q18, q19, q20, q21, q22])
   
    st.write("Orientação a Metas Intrínsecas: ", media_orientacao_metas_intrinsecas)
    st.write("Orientação a Metas Extrínsicas: ", media_orientacao_metas_extrinsicas)
    st.write("Valorização da Atividade: ", media_valorizacao_da_atividade)
    st.write("Controle do Aprendizado: ", controle_do_aprendizado)
    st.write("Autoeficacia para Aprendizado: ", autoeficacia_para_aprendizado)
    st.write("Ansiedade em testes: ", ansiedade_em_testes)
        
with grafico:
    
    fig, ax = plt.subplots()

    constructors = ["orientação a metas intrinsecas", "orientação a metas extrinsicas", "valorização da atividade", "controle doaprendizado",
    "autoeficacia para aprendizado", "ansiedade em testes"]

    counts = [2.5, 2.0, 3.66, 3.0, 5.0, 3.2]

    ax.barh(constructors, counts)

    #plt.xticks(rotation=-90)
    ax.set_xlabel('Escala')
    ax.set_xticks([1,2,3,4,5,6,7])
    ax.set_title('Perfil do estudante')

    st.pyplot(plt)
    
with notas:
        
    st.write("Atividade 1")
    st.write("Nota: 10")
    
    st.write("=-=-=-=-=-")

    st.write("Atividade 2")
    st.write("Nota: 7")
             
with dicas_automaticas:
    st.text_area(height= 300, label="Dicas automáticas selecionadas",value= """ **Motivação: Interesse (Orientação a metas intrínsecas, Orientação a metas extrínsecas, Valorização da atividade e Controle do aprendizado)**
Leia rapidamente a lista com os conteúdos do seu material didático ou o programa da disciplina;
Faça uma lista dos três tópicos que mais te interessam e dos três tópicos que menos te interessam.
Preste atenção a esses tópicos em particular. 
O que nos três tópicos mais interessantes faz com que você goste tanto deles?
O que faz os três outros tópicos desinteressantes? 
Você encontra alguma característica dos três tópicos mais interessantes nos tópicos menos interessantes?
Se você conseguir identificar o quê, nos três tópicos mais interessantes, faz com que você goste deles, talvez você seja capaz de aplicar o que encontrou aos três menos interessantes.
E talvez você descubra que os tópicos desinteressantes não são tão desinteressantes assim!""")
    st.button("Enviar")
    
with dicas_do_professor:
    st.text_area("Dica personalizada")
    st.button("Enviar dica")
    
