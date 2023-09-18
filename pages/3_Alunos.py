import streamlit as st
from googleapiclient.discovery import build
import numpy as np
import matplotlib.pyplot as plt
from google.oauth2.credentials import Credentials 
import pandas as pd

st.title("Dados do aluno")

id_curso_selecionado = st.session_state["id_curso_selecionado"]
df_estudantes = st.session_state["df_estudantes"]

# combobox de seleção do alino
aluno_selecionado = st.selectbox("Aluno", df_estudantes["nome"])

df_estudante_selecionado = df_estudantes[df_estudantes["nome"] == aluno_selecionado].iloc[0]

# escreve o nome do estudante
nome_estudante_selecionado = df_estudante_selecionado["nome"]
st.title(nome_estudante_selecionado)

# escrever o user id do estudante selecionado
id_estudante_selecionado = df_estudante_selecionado["userId"]
st.write(df_estudante_selecionado["userId"])

# escrever o email do estudante selecionado
email_estudante_selecionado = df_estudante_selecionado["email"]
st.write(email_estudante_selecionado)

st.warning("O Aluno solicitou ajuda!!")

resumo, autorregulacao, bigfive,dicas = st.tabs(["Resumo do Desempenho", "Autorregulação", "Bigfive", "Dicas"])


def get_num_escala_likert(valor):
    if valor=="Concordo plenamente.":
        return 7
    elif valor=="Concorda.":
        return 6
    elif valor=="Um pouco de acordo.":
        return 5
    elif valor=="Não concordar nem discordar.":
        return 4
    elif valor=="Alguma coisa em desacordo.":
        return 3
    elif valor=="Discordar.":
        return 2
    elif valor=="Discordar fortemente.":
        return 1

def get_num_escala_likert_5_pontos(valor):
    if valor=="concordo totalmente":
        return 5
    elif valor=="concordo":
        return 4
    elif valor=="indiferente":
        return 3
    elif valor=="discordo":
        return 2
    elif valor=="discordo totalmente":
        return 1
    
with resumo:

    df_respostas_big_five = st.session_state["df_respostas_big_five"]
    if len (df_respostas_big_five[df_respostas_big_five["Nome de usuário"] == email_estudante_selecionado]) > 0:
        df_respostas_big_five_s = df_respostas_big_five[df_respostas_big_five["Nome de usuário"] == email_estudante_selecionado].iloc[0]
        q1 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[2])
        q2 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[3])
        q3 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[4])
        q4 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[5])
        q5 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[6])
        q6 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[7])
        q7 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[8])
        q8 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[9])
        q9 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[10])
        q10 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[11])
        q11 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[12])
        q12 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[13])
        q13 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[14])
        q14 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[15])
        q15 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[16])
        q16 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[17])
        q17 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[18])
        q18 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[19])
        q19 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[20])
        q20 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[21])
        q21 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[22])
        q22 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[23])
        q23 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[24])
        q24 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[25])
        q25 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[26])
        q26 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[27])
        q27 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[28])
        q28 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[29])
        q29 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[30])
        q30 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[31])
        q31 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[32])
        q32 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[33])
        q33 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[34])
        q34 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[35])
        q35 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[36])
        q36 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[37])
        q37 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[38])
        q38 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[39])
        q39 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[40])
        q40 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[41])
        q41 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[42])
        q42 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[43])
        q43 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[44])
        q44 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[45])
                
        extroversao = np.mean([q1, q6, q11, q16, q21, q26, q31, q36])
        amababilidade = np.mean([q2, q7, q12, q17, q22, q27, q32, q37, q42])
        conscienciosidade = np.mean([q3, q8, q13, q18, q23, q28, q33, q38, q43])
        estabilidade_emocional = np.mean([q4, q9, q14, q19, q24, q29, q34, q39])
        abertura_a_experiencias = np.mean([q5, q10, q15, q20, q25, q30, q35, q40, q41, q44])
        
        plt.style.use('ggplot')
        plt.figure(figsize=(6, 3))
        plt.title("Perfil Bigfive", fontsize=20)
        colors = ['b', 'g', 'r', 'c', 'm']
        st.write("Perfil BigFive")
        fig, ax = plt.subplots()
        constructors = ["Extroversao", "Amababilidade", "Conscienciosidade", "Estabilidade emocional", "Abertura a experiencias"]
        counts = [extroversao, amababilidade, conscienciosidade,estabilidade_emocional, abertura_a_experiencias]
        graf1 = ax.barh(constructors, counts, color=colors)
        ax.bar_label(graf1, fmt="%.01f", size=10, label_type="edge")
        ax.set_xlabel('Resposta')
        ax.set_xticks([1,2,3,4,5])
        st.pyplot(plt)
        #chart_data = pd.DataFrame(data=[
        #              ["Extroversao", 1], 
        #              ["Amababilidade", 2],
        #              ["Conscienciosidade", 2],
        #              ["Estabilidade Emocional", 3], 
        #              ["Abertura a experiencias", 2]
        #              ], columns=["tipo", "valor"]) 
        #st.bar_chart(data=chart_data, y="valor", x="tipo")
    else:
        st.write("Aluno ainda não respondeu ao questionário.")
        
    df_quest_reg = st.session_state["df_respostas"]
    if len (df_quest_reg[df_quest_reg["Nome de usuário"] == email_estudante_selecionado]) > 0:
        df_quest_reg_s = df_quest_reg[df_quest_reg["Nome de usuário"] == email_estudante_selecionado].iloc[0]
        q1 = get_num_escala_likert(df_quest_reg_s[2])
        q2 = get_num_escala_likert(df_quest_reg_s[3])
        q3 = get_num_escala_likert(df_quest_reg_s[4])
        q4 = get_num_escala_likert(df_quest_reg_s[5])
        q5 = get_num_escala_likert(df_quest_reg_s[6])
        q6 = get_num_escala_likert(df_quest_reg_s[7])
        q7 = get_num_escala_likert(df_quest_reg_s[8])
        q8 = get_num_escala_likert(df_quest_reg_s[9])
        q9 = get_num_escala_likert(df_quest_reg_s[10])
        q10 = get_num_escala_likert(df_quest_reg_s[11])
        q11 = get_num_escala_likert(df_quest_reg_s[12])
        q12 = get_num_escala_likert(df_quest_reg_s[13])
        q13 = get_num_escala_likert(df_quest_reg_s[14])
        q14 = get_num_escala_likert(df_quest_reg_s[15])
        q15 = get_num_escala_likert(df_quest_reg_s[16])
        q16 = get_num_escala_likert(df_quest_reg_s[17])
        q17 = get_num_escala_likert(df_quest_reg_s[18])
        q18 = get_num_escala_likert(df_quest_reg_s[19])
        q19 = get_num_escala_likert(df_quest_reg_s[20])
        q20 = get_num_escala_likert(df_quest_reg_s[21])
        q21 = get_num_escala_likert(df_quest_reg_s[22])
        q22 = get_num_escala_likert(df_quest_reg_s[23])
        q23 = get_num_escala_likert(df_quest_reg_s[24])
        q24 = get_num_escala_likert(df_quest_reg_s[25])
        q25 = get_num_escala_likert(df_quest_reg_s[26])
        q26 = get_num_escala_likert(df_quest_reg_s[27])
        q27 = get_num_escala_likert(df_quest_reg_s[28])
        q28 = get_num_escala_likert(df_quest_reg_s[29])
        q29 = get_num_escala_likert(df_quest_reg_s[30])
        q30 = get_num_escala_likert(df_quest_reg_s[31])
        q31 = get_num_escala_likert(df_quest_reg_s[32])
        q32 = get_num_escala_likert(df_quest_reg_s[33])
        q33 = get_num_escala_likert(df_quest_reg_s[34])
        q34 = get_num_escala_likert(df_quest_reg_s[35])
        q35 = get_num_escala_likert(df_quest_reg_s[36])
        q36 = get_num_escala_likert(df_quest_reg_s[37])
        q37 = get_num_escala_likert(df_quest_reg_s[38])
        q38 = get_num_escala_likert(df_quest_reg_s[39])
        q39 = get_num_escala_likert(df_quest_reg_s[40])
        q40 = get_num_escala_likert(df_quest_reg_s[41])
        q41 = get_num_escala_likert(df_quest_reg_s[42])
        q42 = get_num_escala_likert(df_quest_reg_s[43])
        q43 = get_num_escala_likert(df_quest_reg_s[44])
        q44 = get_num_escala_likert(df_quest_reg_s[45])
        
        media_orientacao_metas_intrinsecas = np.mean([q1, q2])
        media_orientacao_metas_extrinsicas = np.mean([q3, q4])
        media_valorizacao_da_atividade = np.mean([q5, q6, q7, q8, q9, q10])
        controle_do_aprendizado = np.mean([q11, q12, q13])
        autoeficacia_para_aprendizado = np.mean([q14, q15, q16, q17])
        ansiedade_em_testes = np.mean([q18, q19, q20, q21, q22])        
        ensaio_memorizacao = np.mean([q23, q24, q25, q26, q27]) # 5
        elaboracao = np.mean([q28, q29]) #2
        organizacao = np.mean([q30, q31, q32]) # 3
        pensamento_critico = np.mean([q33]) #1
        autorregulacao_metacognitiva = np.mean([q34, q35, q36, q37, q38]) #5
        tempo_e_ambiente_de_estudo = np.mean([q39]) 
        administracao_de_esforcos = np.mean([q40, q41, q42, q43, q44]) #5
        
        colors = ['b', 'g', 'r', 'c', 'm', 'y', 'g']
        st.write("Escalas de Motivação")
        fig, ax = plt.subplots()
        constructors = ["Orientação a metas intrinsecas", "Orientação a metas extrinsicas", "Valorização da atividade", "Controle doaprendizado",
        "Autoeficacia para aprendizado", "Ansiedade em testes"]
        counts = [media_orientacao_metas_intrinsecas, media_orientacao_metas_extrinsicas, media_valorizacao_da_atividade,controle_do_aprendizado, autoeficacia_para_aprendizado, ansiedade_em_testes]
        graf1 = ax.barh(constructors, counts, color=colors)
        ax.bar_label(graf1, fmt="%.01f", size=10, label_type="edge")
        ax.set_xlabel('Resposta')
        ax.set_xticks([1,2,3,4,5,6,7])
        st.pyplot(plt)
        
        st.write("Escalas de Estratégias de aprendizagem")
        fig, ax = plt.subplots()
        constructors = ["Ensaio memorização","Elaboração","Organização","Pensamento crítico","Autorregulacao Metacognitiva","Tempo e ambiente de estudo","Administração de esforços"]
        counts = [ensaio_memorizacao,elaboracao,organizacao,pensamento_critico,autorregulacao_metacognitiva,tempo_e_ambiente_de_estudo,administracao_de_esforcos]
        graf1 = ax.barh(constructors, counts, color=colors)
        ax.bar_label(graf1, fmt="%.01f", size=10, label_type="edge")
        ax.set_xlabel('Resposta')
        ax.set_xticks([1,2,3,4,5,6,7])
        st.pyplot(plt)
    else:
        st.write("Aluno ainda não respondeu ao questionário.")
    
with bigfive:

    dados_big_five, analise_big_five, grafico_big_five = st.tabs(["Dados Big Five", "Analise Big Five", "Grafico Big Five"])
    # dados big five
    with dados_big_five:
        st.write("Dados brutos do questionário do Big Five")
        df_quest_reg_big_five = st.session_state["df_respostas_big_five"] 
        if len (df_quest_reg_big_five[df_quest_reg_big_five["Nome de usuário"] == email_estudante_selecionado]) > 0:
            df_quest_reg_big_five_s = df_quest_reg_big_five[df_quest_reg_big_five["Nome de usuário"] == email_estudante_selecionado].iloc[0]
            df_quest_reg_big_five_s
        else: 
            st.warning("Aluno ainda não respondeu ao questionário do Big Five.")
            
    with grafico_big_five:
        st.write("Dados do questionário do bigfive")
        df_respostas_big_five = st.session_state["df_respostas_big_five"]
        if len (df_respostas_big_five[df_respostas_big_five["Nome de usuário"] == email_estudante_selecionado]) > 0:
            df_respostas_big_five_s = df_respostas_big_five[df_respostas_big_five["Nome de usuário"] == email_estudante_selecionado].iloc[0]
            q1 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[2])
            q2 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[3])
            q3 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[4])
            q4 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[5])
            q5 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[6])
            q6 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[7])
            q7 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[8])
            q8 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[9])
            q9 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[10])
            q10 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[11])
            q11 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[12])
            q12 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[13])
            q13 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[14])
            q14 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[15])
            q15 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[16])
            q16 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[17])
            q17 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[18])
            q18 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[19])
            q19 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[20])
            q20 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[21])
            q21 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[22])
            q22 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[23])
            q23 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[24])
            q24 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[25])
            q25 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[26])
            q26 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[27])
            q27 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[28])
            q28 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[29])
            q29 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[30])
            q30 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[31])
            q31 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[32])
            q32 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[33])
            q33 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[34])
            q34 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[35])
            q35 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[36])
            q36 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[37])
            q37 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[38])
            q38 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[39])
            q39 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[40])
            q40 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[41])
            q41 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[42])
            q42 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[43])
            q43 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[44])
            q44 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[45])
                    
            extroversao = np.mean([q1, q6, q11, q16, q21, q26, q31, q36])
            amababilidade = np.mean([q2, q7, q12, q17, q22, q27, q32, q37, q42])
            conscienciosidade = np.mean([q3, q8, q13, q18, q23, q28, q33, q38, q43])
            estabilidade_emocional = np.mean([q4, q9, q14, q19, q24, q29, q34, q39])
            abertura_a_experiencias = np.mean([q5, q10, q15, q20, q25, q30, q35, q40, q41, q44])
            
            st.write("Perfil do Bigfive")
            fig, ax = plt.subplots()
            constructors = ["Extroversao", "Amababilidade", "Conscienciosidade", "Estabilidade Emocional", "Abertura a experiencias"]
            counts = [extroversao, amababilidade, conscienciosidade,estabilidade_emocional, abertura_a_experiencias]
            graf1 = ax.barh(constructors, counts)
            ax.bar_label(graf1, fmt="%.01f", size=10, label_type="edge")
            ax.set_xlabel('Resposta')
            ax.set_xticks([1,2,3,4,5])
            st.pyplot(plt)
            
        else:
            st.write("Aluno ainda não respondeu ao questionário Big Five.")
            
        
            
    # analise big five
    with analise_big_five:
        st.write("Dados do questionário de autorregulação")
        df_respostas_big_five = st.session_state["df_respostas_big_five"]
        if len (df_respostas_big_five[df_respostas_big_five["Nome de usuário"] == email_estudante_selecionado]) > 0:
            df_respostas_big_five_s = df_respostas_big_five[df_respostas_big_five["Nome de usuário"] == email_estudante_selecionado].iloc[0]
            q1 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[2])
            q2 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[3])
            q3 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[4])
            q4 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[5])
            q5 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[6])
            q6 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[7])
            q7 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[8])
            q8 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[9])
            q9 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[10])
            q10 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[11])
            q11 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[12])
            q12 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[13])
            q13 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[14])
            q14 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[15])
            q15 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[16])
            q16 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[17])
            q17 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[18])
            q18 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[19])
            q19 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[20])
            q20 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[21])
            q21 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[22])
            q22 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[23])
            q23 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[24])
            q24 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[25])
            q25 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[26])
            q26 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[27])
            q27 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[28])
            q28 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[29])
            q29 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[30])
            q30 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[31])
            q31 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[32])
            q32 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[33])
            q33 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[34])
            q34 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[35])
            q35 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[36])
            q36 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[37])
            q37 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[38])
            q38 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[39])
            q39 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[40])
            q40 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[41])
            q41 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[42])
            q42 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[43])
            q43 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[44])
            q44 = get_num_escala_likert_5_pontos(df_respostas_big_five_s[45])
                    
            extroversao = np.mean([q1, q6, q11, q16, q21, q26, q31, q36])
            amababilidade = np.mean([q2, q7, q12, q17, q22, q27, q32, q37, q42])
            conscienciosidade = np.mean([q3, q8, q13, q18, q23, q28, q33, q38, q43])
            estabilidade_emocional = np.mean([q4, q9, q14, q19, q24, q29, q34, q39])
            abertura_a_experiencias = np.mean([q5, q10, q15, q20, q25, q30, q35, q40, q41, q44])
            
            col1, col2, col3 = st.columns(3)
            col4, col5, col6 = st.columns(3)
        
            col1.metric("Extroversão: ", extroversao)
            col2.metric("Amababilidade: ", amababilidade)
            col3.metric("Conscienciosidade: ", conscienciosidade)
            col4.metric("Estabilidade Emocional: ", estabilidade_emocional)
            col5.metric("Abertura a experiencias: ", abertura_a_experiencias)
            
        else:
            st.warning("Aluno ainda não respondeu ao questionário.")

with autorregulacao:
    dados, analise, grafico = st.tabs(["Dados Autorregulação", "Análise Autorregulação", "Gráfico Autorregulação"])
    # dados autorregulação    
    with dados:
        st.write("Dados do questionário de autorregulação")
        df_quest_reg = st.session_state["df_respostas"] 
        if len (df_quest_reg[df_quest_reg["Nome de usuário"] == email_estudante_selecionado]) > 0:
            df_quest_reg_s = df_quest_reg[df_quest_reg["Nome de usuário"] == email_estudante_selecionado].iloc[0]
            df_quest_reg_s
        else: 
            st.warning("Aluno ainda não respondeu ao questionário.")

    # analise autorregulacao
    with analise:
        st.write("Dados do questionário de autorregulação")
        df_quest_reg = st.session_state["df_respostas"]
        if len (df_quest_reg[df_quest_reg["Nome de usuário"] == email_estudante_selecionado]) > 0:
            df_quest_reg_s = df_quest_reg[df_quest_reg["Nome de usuário"] == email_estudante_selecionado].iloc[0]
            q1 = get_num_escala_likert(df_quest_reg_s[2])
            q2 = get_num_escala_likert(df_quest_reg_s[3])
            q3 = get_num_escala_likert(df_quest_reg_s[4])
            q4 = get_num_escala_likert(df_quest_reg_s[5])
            q5 = get_num_escala_likert(df_quest_reg_s[6])
            q6 = get_num_escala_likert(df_quest_reg_s[7])
            q7 = get_num_escala_likert(df_quest_reg_s[8])
            q8 = get_num_escala_likert(df_quest_reg_s[9])
            q9 = get_num_escala_likert(df_quest_reg_s[10])
            q10 = get_num_escala_likert(df_quest_reg_s[11])
            q11 = get_num_escala_likert(df_quest_reg_s[12])
            q12 = get_num_escala_likert(df_quest_reg_s[13])
            q13 = get_num_escala_likert(df_quest_reg_s[14])
            q14 = get_num_escala_likert(df_quest_reg_s[15])
            q15 = get_num_escala_likert(df_quest_reg_s[16])
            q16 = get_num_escala_likert(df_quest_reg_s[17])
            q17 = get_num_escala_likert(df_quest_reg_s[18])
            q18 = get_num_escala_likert(df_quest_reg_s[19])
            q19 = get_num_escala_likert(df_quest_reg_s[20])
            q20 = get_num_escala_likert(df_quest_reg_s[21])
            q21 = get_num_escala_likert(df_quest_reg_s[22])
            q22 = get_num_escala_likert(df_quest_reg_s[23])
            q23 = get_num_escala_likert(df_quest_reg_s[24])
            q24 = get_num_escala_likert(df_quest_reg_s[25])
            q25 = get_num_escala_likert(df_quest_reg_s[26])
            q26 = get_num_escala_likert(df_quest_reg_s[27])
            q27 = get_num_escala_likert(df_quest_reg_s[28])
            q28 = get_num_escala_likert(df_quest_reg_s[29])
            q29 = get_num_escala_likert(df_quest_reg_s[30])
            q30 = get_num_escala_likert(df_quest_reg_s[31])
            q31 = get_num_escala_likert(df_quest_reg_s[32])
            q32 = get_num_escala_likert(df_quest_reg_s[33])
            q33 = get_num_escala_likert(df_quest_reg_s[34])
            q34 = get_num_escala_likert(df_quest_reg_s[35])
            q35 = get_num_escala_likert(df_quest_reg_s[36])
            q36 = get_num_escala_likert(df_quest_reg_s[37])
            q37 = get_num_escala_likert(df_quest_reg_s[38])
            q38 = get_num_escala_likert(df_quest_reg_s[39])
            q39 = get_num_escala_likert(df_quest_reg_s[40])
            q40 = get_num_escala_likert(df_quest_reg_s[41])
            q41 = get_num_escala_likert(df_quest_reg_s[42])
            q42 = get_num_escala_likert(df_quest_reg_s[43])
            q43 = get_num_escala_likert(df_quest_reg_s[44])
            q44 = get_num_escala_likert(df_quest_reg_s[45])
            
            st.write(get_num_escala_likert(q1))
            
            media_orientacao_metas_intrinsecas = np.mean([q1, q2])
            media_orientacao_metas_extrinsicas = np.mean([q3, q4])
            media_valorizacao_da_atividade = np.mean([q5, q6, q7, q8, q9, q10])
            controle_do_aprendizado = np.mean([q11, q12, q13])
            autoeficacia_para_aprendizado = np.mean([q14, q15, q16, q17])
            ansiedade_em_testes = np.mean([q18, q19, q20, q21, q22])
        
            st.write("Escalas de Motivação")
            col1, col2, col3 = st.columns(3)
            col4, col5, col6 = st.columns(3)
        
            col1.metric("Orientação a Metas Intrínsecas: ", media_orientacao_metas_intrinsecas)
            col2.metric("Orientação a Metas Extrínsicas: ", media_orientacao_metas_extrinsicas)
            col3.metric("Valorização da Atividade: ", media_valorizacao_da_atividade)
            col4.metric("Controle do Aprendizado: ", controle_do_aprendizado)
            col5.metric("Autoeficacia para Aprendizado: ", autoeficacia_para_aprendizado)
            col6.metric("Ansiedade em testes: ", ansiedade_em_testes)
            
            st.write("Escalas de Estratégias de aprendizagem")
            col7, col8, col9 = st.columns(3)
            col10, col11, col12 = st.columns(3)
            col13, col14, col15 = st.columns(3)
            
            ensaio_memorizacao = np.mean([q23, q24, q25, q26, q27]) # 5
            elaboracao = np.mean([q28, q29]) #2
            organizacao = np.mean([q30, q31, q32]) # 3
            pensamento_critico = np.mean([q33]) #1
            autorregulacao_metacognitiva = np.mean([q34, q35, q36, q37, q38]) #5
            tempo_e_ambiente_de_estudo = np.mean([q39]) 
            administracao_de_esforcos = np.mean([q40, q41, q42, q43, q44]) #5
            
            col7.metric("Ensaio memorização: ", ensaio_memorizacao)
            col8.metric("Elaboração: ", elaboracao)
            col9.metric("Organização: ", organizacao)
            col10.metric("Pensamento crítico: ", pensamento_critico)
            col11.metric("Autorregulacao Metacognitiva: ", autorregulacao_metacognitiva)
            col12.metric("Tempo e ambiente de estudo: ", tempo_e_ambiente_de_estudo)
            col13.metric("Administração de esforços: ", administracao_de_esforcos)
        else:
            st.write("Aluno ainda não respondeu ao questionário.")
                
    with grafico:
        st.write("Dados do questionário de autorregulação")
        df_quest_reg = st.session_state["df_respostas"]
        if len (df_quest_reg[df_quest_reg["Nome de usuário"] == email_estudante_selecionado]) > 0:
            df_quest_reg_s = df_quest_reg[df_quest_reg["Nome de usuário"] == email_estudante_selecionado].iloc[0]
            q1 = get_num_escala_likert(df_quest_reg_s[2])
            q2 = get_num_escala_likert(df_quest_reg_s[3])
            q3 = get_num_escala_likert(df_quest_reg_s[4])
            q4 = get_num_escala_likert(df_quest_reg_s[5])
            q5 = get_num_escala_likert(df_quest_reg_s[6])
            q6 = get_num_escala_likert(df_quest_reg_s[7])
            q7 = get_num_escala_likert(df_quest_reg_s[8])
            q8 = get_num_escala_likert(df_quest_reg_s[9])
            q9 = get_num_escala_likert(df_quest_reg_s[10])
            q10 = get_num_escala_likert(df_quest_reg_s[11])
            q11 = get_num_escala_likert(df_quest_reg_s[12])
            q12 = get_num_escala_likert(df_quest_reg_s[13])
            q13 = get_num_escala_likert(df_quest_reg_s[14])
            q14 = get_num_escala_likert(df_quest_reg_s[15])
            q15 = get_num_escala_likert(df_quest_reg_s[16])
            q16 = get_num_escala_likert(df_quest_reg_s[17])
            q17 = get_num_escala_likert(df_quest_reg_s[18])
            q18 = get_num_escala_likert(df_quest_reg_s[19])
            q19 = get_num_escala_likert(df_quest_reg_s[20])
            q20 = get_num_escala_likert(df_quest_reg_s[21])
            q21 = get_num_escala_likert(df_quest_reg_s[22])
            q22 = get_num_escala_likert(df_quest_reg_s[23])
            q23 = get_num_escala_likert(df_quest_reg_s[24])
            q24 = get_num_escala_likert(df_quest_reg_s[25])
            q25 = get_num_escala_likert(df_quest_reg_s[26])
            q26 = get_num_escala_likert(df_quest_reg_s[27])
            q27 = get_num_escala_likert(df_quest_reg_s[28])
            q28 = get_num_escala_likert(df_quest_reg_s[29])
            q29 = get_num_escala_likert(df_quest_reg_s[30])
            q30 = get_num_escala_likert(df_quest_reg_s[31])
            q31 = get_num_escala_likert(df_quest_reg_s[32])
            q32 = get_num_escala_likert(df_quest_reg_s[33])
            q33 = get_num_escala_likert(df_quest_reg_s[34])
            q34 = get_num_escala_likert(df_quest_reg_s[35])
            q35 = get_num_escala_likert(df_quest_reg_s[36])
            q36 = get_num_escala_likert(df_quest_reg_s[37])
            q37 = get_num_escala_likert(df_quest_reg_s[38])
            q38 = get_num_escala_likert(df_quest_reg_s[39])
            q39 = get_num_escala_likert(df_quest_reg_s[40])
            q40 = get_num_escala_likert(df_quest_reg_s[41])
            q41 = get_num_escala_likert(df_quest_reg_s[42])
            q42 = get_num_escala_likert(df_quest_reg_s[43])
            q43 = get_num_escala_likert(df_quest_reg_s[44])
            q44 = get_num_escala_likert(df_quest_reg_s[45])
            
            media_orientacao_metas_intrinsecas = np.mean([q1, q2])
            media_orientacao_metas_extrinsicas = np.mean([q3, q4])
            media_valorizacao_da_atividade = np.mean([q5, q6, q7, q8, q9, q10])
            controle_do_aprendizado = np.mean([q11, q12, q13])
            autoeficacia_para_aprendizado = np.mean([q14, q15, q16, q17])
            ansiedade_em_testes = np.mean([q18, q19, q20, q21, q22])        
            ensaio_memorizacao = np.mean([q23, q24, q25, q26, q27]) # 5
            elaboracao = np.mean([q28, q29]) #2
            organizacao = np.mean([q30, q31, q32]) # 3
            pensamento_critico = np.mean([q33]) #1
            autorregulacao_metacognitiva = np.mean([q34, q35, q36, q37, q38]) #5
            tempo_e_ambiente_de_estudo = np.mean([q39]) 
            administracao_de_esforcos = np.mean([q40, q41, q42, q43, q44]) #5
            
            st.write("Escalas de Motivação")
            fig, ax = plt.subplots()
            constructors = ["Orientação a metas intrinsecas", "Orientação a metas extrinsicas", "Valorização da atividade", "Controle doaprendizado",
            "Autoeficacia para aprendizado", "Ansiedade em testes"]
            counts = [media_orientacao_metas_intrinsecas, media_orientacao_metas_extrinsicas, media_valorizacao_da_atividade,controle_do_aprendizado, autoeficacia_para_aprendizado, ansiedade_em_testes]
            graf1 = ax.barh(constructors, counts)
            ax.bar_label(graf1, fmt="%.01f", size=10, label_type="edge")
            ax.set_xlabel('Resposta')
            ax.set_xticks([1,2,3,4,5,6,7])
            #ax.set_title('Perfil do estudante - Escalas de motivação')
            st.pyplot(plt)
            
            st.write("Escalas de Estratégias de aprendizagem")
            fig, ax = plt.subplots()
            constructors = ["Ensaio memorização","Elaboração","Organização","Pensamento crítico","Autorregulacao Metacognitiva","Tempo e ambiente de estudo","Administração de esforços"]
            counts = [ensaio_memorizacao,elaboracao,organizacao,pensamento_critico,autorregulacao_metacognitiva,tempo_e_ambiente_de_estudo,administracao_de_esforcos]
            graf1 = ax.barh(constructors, counts)
            ax.bar_label(graf1, fmt="%.01f", size=10, label_type="edge")
            ax.set_xlabel('Resposta')
            ax.set_xticks([1,2,3,4,5,6,7])
            st.pyplot(plt)
        else:
            st.write("Aluno ainda não respondeu ao questionário.")
with dicas:
    dicas_automaticas, dicas_do_professor = st.tabs(["Recomendação automatica autorregulação", "Recomendação personalizada"])
    with dicas_do_professor:
        st.write("Enviar uma recomendação personalizada para este aluno")
        txt_titulo_dica_prof = st.text_input("Título", key="txt_titulo_dica_prof")
        txt_desc_dica_prof = st.text_area("Descrição", key="txt_desc_dica_prof")
        btn_enviar_dica_professor = st.button("Enviar", key ="btndicaprofessor")

    def enviar_dica_professor(student_id, titulo, descricao):
        token = st.session_state['token']
        classroom = build('classroom', 'v1', credentials=Credentials(token=token.get("access_token")))
            
        dica = {
                'title': titulo,
                'description': descricao,
                'state': 'PUBLISHED',
                "assigneeMode": "INDIVIDUAL_STUDENTS",
                "individualStudentsOptions": { "studentIds": [student_id] }
            }

        # Enviar mensagem
        dica_enviada = classroom.courses().courseWorkMaterials().create(courseId=id_curso_selecionado, body=dica).execute()
        (f"Diva enviada para o sala de aula do estudante:  {dica_enviada.get('id')}")
        
    if btn_enviar_dica_professor:
        enviar_dica_professor(id_estudante_selecionado, txt_titulo_dica_prof, txt_desc_dica_prof)
        
    with dicas_automaticas:
        st.write("Dicas automáticas identenficadas pela análise do perfil de autorregulação")
        
        df_quest_reg = st.session_state["df_respostas"]
        if len (df_quest_reg[df_quest_reg["Nome de usuário"] == email_estudante_selecionado]) > 0:
            btn_enviar_dica_automaticas = st.button("Enviar todas", key ="btndicaautomatica")
            df_quest_reg_s = df_quest_reg[df_quest_reg["Nome de usuário"] == email_estudante_selecionado].iloc[0]
            q1 = get_num_escala_likert(df_quest_reg_s[2])
            q2 = get_num_escala_likert(df_quest_reg_s[3])
            q3 = get_num_escala_likert(df_quest_reg_s[4])
            q4 = get_num_escala_likert(df_quest_reg_s[5])
            q5 = get_num_escala_likert(df_quest_reg_s[6])
            q6 = get_num_escala_likert(df_quest_reg_s[7])
            q7 = get_num_escala_likert(df_quest_reg_s[8])
            q8 = get_num_escala_likert(df_quest_reg_s[9])
            q9 = get_num_escala_likert(df_quest_reg_s[10])
            q10 = get_num_escala_likert(df_quest_reg_s[11])
            q11 = get_num_escala_likert(df_quest_reg_s[12])
            q12 = get_num_escala_likert(df_quest_reg_s[13])
            q13 = get_num_escala_likert(df_quest_reg_s[14])
            q14 = get_num_escala_likert(df_quest_reg_s[15])
            q15 = get_num_escala_likert(df_quest_reg_s[16])
            q16 = get_num_escala_likert(df_quest_reg_s[17])
            q17 = get_num_escala_likert(df_quest_reg_s[18])
            q18 = get_num_escala_likert(df_quest_reg_s[19])
            q19 = get_num_escala_likert(df_quest_reg_s[20])
            q20 = get_num_escala_likert(df_quest_reg_s[21])
            q21 = get_num_escala_likert(df_quest_reg_s[22])
            q22 = get_num_escala_likert(df_quest_reg_s[23])
            q23 = get_num_escala_likert(df_quest_reg_s[24])
            q24 = get_num_escala_likert(df_quest_reg_s[25])
            q25 = get_num_escala_likert(df_quest_reg_s[26])
            q26 = get_num_escala_likert(df_quest_reg_s[27])
            q27 = get_num_escala_likert(df_quest_reg_s[28])
            q28 = get_num_escala_likert(df_quest_reg_s[29])
            q29 = get_num_escala_likert(df_quest_reg_s[30])
            q30 = get_num_escala_likert(df_quest_reg_s[31])
            q31 = get_num_escala_likert(df_quest_reg_s[32])
            q32 = get_num_escala_likert(df_quest_reg_s[33])
            q33 = get_num_escala_likert(df_quest_reg_s[34])
            q34 = get_num_escala_likert(df_quest_reg_s[35])
            q35 = get_num_escala_likert(df_quest_reg_s[36])
            q36 = get_num_escala_likert(df_quest_reg_s[37])
            q37 = get_num_escala_likert(df_quest_reg_s[38])
            q38 = get_num_escala_likert(df_quest_reg_s[39])
            q39 = get_num_escala_likert(df_quest_reg_s[40])
            q40 = get_num_escala_likert(df_quest_reg_s[41])
            q41 = get_num_escala_likert(df_quest_reg_s[42])
            q42 = get_num_escala_likert(df_quest_reg_s[43])
            q43 = get_num_escala_likert(df_quest_reg_s[44])
            q44 = get_num_escala_likert(df_quest_reg_s[45])
            
            media_orientacao_metas_intrinsecas = np.mean([q1, q2])
            media_orientacao_metas_extrinsicas = np.mean([q3, q4])
            media_valorizacao_da_atividade = np.mean([q5, q6, q7, q8, q9, q10])
            controle_do_aprendizado = np.mean([q11, q12, q13])
            autoeficacia_para_aprendizado = np.mean([q14, q15, q16, q17])
            ansiedade_em_testes = np.mean([q18, q19, q20, q21, q22])
            
            ensaio_memorizacao = np.mean([q23, q24, q25, q26, q27]) # 5
            elaboracao = np.mean([q28, q29]) #2
            organizacao = np.mean([q30, q31, q32]) # 3
            pensamento_critico = np.mean([q33]) #1
            autorregulacao_metacognitiva = np.mean([q34, q35, q36, q37, q38]) #5
            tempo_e_ambiente_de_estudo = np.mean([q39]) 
            administracao_de_esforcos = np.mean([q40, q41, q42, q43, q44]) #5
            
            df_dicas = st.session_state["df_dicas"]
            st.divider()
            # exibir dicas automaticas        
            if media_orientacao_metas_intrinsecas <= 3 or media_orientacao_metas_extrinsicas <= 3 or media_valorizacao_da_atividade <= 3 or controle_do_aprendizado <= 3:
                st.write("Motivo: baixa capacidade de Orientação à metas intrínsecas")
                st.write("Dica:")
                st.write(str(df_dicas["dicas"].iloc[0]))
                st.divider()
            if autoeficacia_para_aprendizado <= 3:
                st.write("Motivo: baixa capacidade de autoeficácia no aprendizado")
                st.write("Dica:")
                st.write(str(df_dicas["dicas"].iloc[1]))
                st.divider()
            if ansiedade_em_testes <= 3:
                st.markdown("Motivo: baixa ansiedade em testes")
                st.write("Dica:")
                st.write(df_dicas["dicas"].iloc[2])
                st.divider()
            if ensaio_memorizacao <= 3:
                st.write("Motivo: baixa memorização")
                st.write("Dica:")
                st.write(df_dicas["dicas"].iloc[3])
                st.divider()
            if elaboracao <= 3:
                st.write("Motivo: baixa elaboração")
                st.write("Dica:")
                st.write(df_dicas["dicas"].iloc[4])
                st.divider()
            if organizacao <= 3:
                st.write("Motivo: baixa organização")
                st.write("Dica:")
                st.write(df_dicas["dicas"].iloc[5])
                st.divider()
            #if pensamento_critico <= 3:
            #    st.write(df_dicas["dicas"].iloc[2])
            if autorregulacao_metacognitiva <= 3:
                st.write("Motivo: baixa autorregulação metacognitiva")
                st.write("Dica:")
                st.write(df_dicas["dicas"].iloc[6])
                st.divider()
            if tempo_e_ambiente_de_estudo <= 3:
                st.write("Motivo: baixo tempo e ambiente de estudo")
                st.write("Dica:")
                st.write(df_dicas["dicas"].iloc[7])
                st.divider()
            if administracao_de_esforcos <= 3:
                st.write("Motivo: baixo administração de esforços")
                st.write("Dica:")
                st.write    (df_dicas["dicas"].iloc[8])
                st.divider()
            
            # enviar dicas automaticas
            if btn_enviar_dica_automaticas:
                if media_orientacao_metas_intrinsecas <= 3 or media_orientacao_metas_extrinsicas <= 3 or media_valorizacao_da_atividade <= 3 or controle_do_aprendizado <= 3:
                    enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[0], df_dicas["dicas"].iloc[0])
                if autoeficacia_para_aprendizado <= 3:
                    enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[1], df_dicas["dicas"].iloc[1])
                if ansiedade_em_testes <= 3:
                    enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[2], df_dicas["dicas"].iloc[2])
                if ensaio_memorizacao <= 3:
                    enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[3], df_dicas["dicas"].iloc[3])
                if elaboracao <= 3:
                    enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[4], df_dicas["dicas"].iloc[4])
                if organizacao <= 3:
                    enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[5], df_dicas["dicas"].iloc[5])
                if autorregulacao_metacognitiva <= 3:
                    enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[6], df_dicas["dicas"].iloc[6])
                if tempo_e_ambiente_de_estudo <= 3:
                    enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[7], df_dicas["dicas"].iloc[7])
                if administracao_de_esforcos <= 3:
                    enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[8], df_dicas["dicas"].iloc[8])
                
        else:
            st.write("Aluno ainda não respondeu ao questionário.")    