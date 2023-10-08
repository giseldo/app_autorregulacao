import streamlit as st
from googleapiclient.discovery import build
import numpy as np
import matplotlib.pyplot as plt
from google.oauth2.credentials import Credentials 
import pandas as pd

st.title("Dados do aluno")

if "id_curso_selecionado" not in st.session_state:
    st.error("Volte para a tela principal faça login e carregue uma turma!")
else:

    limite = st.session_state["limite"]

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

    #resumo, autorregulacao, bigfive,dicas = st.tabs(["Resumo do Desempenho", "Autorregulação", "Bigfive", "Dicas"])
    autorregulacao, bigfive,dicas = st.tabs(["Autorregulação", "Bigfive", "Dicas"])
        
    with bigfive:

        analise_big_five, grafico_big_five, dados_big_five = st.tabs(["Analise Big Five", "Grafico Big Five", "Dados Big Five"])
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
                q1 = df_respostas_big_five_s.iloc[2]
                q2 = df_respostas_big_five_s.iloc[3]
                q3 = df_respostas_big_five_s.iloc[4]
                q4 =  df_respostas_big_five_s.iloc[5]
                q5 =  df_respostas_big_five_s.iloc[6]
                q6 =  df_respostas_big_five_s.iloc[7]
                q7 =  df_respostas_big_five_s.iloc[8]
                q8 =  df_respostas_big_five_s.iloc[9]
                q9 =  df_respostas_big_five_s.iloc[10]
                q10 =  df_respostas_big_five_s.iloc[11]
                q11 =  df_respostas_big_five_s.iloc[12]
                q12 =  df_respostas_big_five_s.iloc[13]
                q13 =  df_respostas_big_five_s.iloc[14]
                q14 =  df_respostas_big_five_s.iloc[15]
                q15 =  df_respostas_big_five_s.iloc[16]
                q16 =  df_respostas_big_five_s.iloc[17]
                q17 =  df_respostas_big_five_s.iloc[18]
                q18 =  df_respostas_big_five_s.iloc[19]
                q19 =  df_respostas_big_five_s.iloc[20]
                q20 =  df_respostas_big_five_s.iloc[21]
                q21 =  df_respostas_big_five_s.iloc[22]
                q22 =  df_respostas_big_five_s.iloc[23]
                q23 =  df_respostas_big_five_s.iloc[24]
                q24 =  df_respostas_big_five_s.iloc[25]
                q25 =  df_respostas_big_five_s.iloc[26]
                q26 =  df_respostas_big_five_s.iloc[27]
                q27 =  df_respostas_big_five_s.iloc[28]
                q28 =  df_respostas_big_five_s.iloc[29]
                q29 =  df_respostas_big_five_s.iloc[30]
                q30 =  df_respostas_big_five_s.iloc[31]
                q31 =  df_respostas_big_five_s.iloc[32]
                q32 =  df_respostas_big_five_s.iloc[33]
                q33 =  df_respostas_big_five_s.iloc[34]
                q34 =  df_respostas_big_five_s.iloc[35]
                q35 =  df_respostas_big_five_s.iloc[36]
                q36 =  df_respostas_big_five_s.iloc[37]
                q37 =  df_respostas_big_five_s.iloc[38]
                q38 =  df_respostas_big_five_s.iloc[39]
                q39 =  df_respostas_big_five_s.iloc[40]
                q40 =  df_respostas_big_five_s.iloc[41]
                q41 =  df_respostas_big_five_s.iloc[42]
                q42 =  df_respostas_big_five_s.iloc[43]
                q43 =  df_respostas_big_five_s.iloc[44]
                q44 =  df_respostas_big_five_s.iloc[45]
                        
                extroversao = np.mean([q1, q6, q11, q16, q21, q26, q31, q36])
                amababilidade = np.mean([q2, q7, q12, q17, q22, q27, q32, q37, q42])
                conscienciosidade = np.mean([q3, q8, q13, q18, q23, q28, q33, q38, q43])
                estabilidade_emocional = np.mean([q4, q9, q14, q19, q24, q29, q34, q39])
                abertura_a_experiencias = np.mean([q5, q10, q15, q20, q25, q30, q35, q40, q41, q44])
                
                st.write("Perfil do Bigfive")
                fig, ax = plt.subplots()
                constructors = ["Extroversao", "Amababilidade", "Conscienciosidade", "Estabilidade Emocional", "Abertura a experiencias"]
                counts = [extroversao, amababilidade, conscienciosidade,estabilidade_emocional, abertura_a_experiencias]
                graf1 = ax.barh(constructors, counts, color='#909090')
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
                q1 = df_respostas_big_five_s.iloc[2]
                q2 = df_respostas_big_five_s.iloc[3]
                q3 = df_respostas_big_five_s.iloc[4]
                q4 =  df_respostas_big_five_s.iloc[5]
                q5 =  df_respostas_big_five_s.iloc[6]
                q6 =  df_respostas_big_five_s.iloc[7]
                q7 =  df_respostas_big_five_s.iloc[8]
                q8 =  df_respostas_big_five_s.iloc[9]
                q9 =  df_respostas_big_five_s.iloc[10]
                q10 =  df_respostas_big_five_s.iloc[11]
                q11 =  df_respostas_big_five_s.iloc[12]
                q12 =  df_respostas_big_five_s.iloc[13]
                q13 =  df_respostas_big_five_s.iloc[14]
                q14 =  df_respostas_big_five_s.iloc[15]
                q15 =  df_respostas_big_five_s.iloc[16]
                q16 =  df_respostas_big_five_s.iloc[17]
                q17 =  df_respostas_big_five_s.iloc[18]
                q18 =  df_respostas_big_five_s.iloc[19]
                q19 =  df_respostas_big_five_s.iloc[20]
                q20 =  df_respostas_big_five_s.iloc[21]
                q21 =  df_respostas_big_five_s.iloc[22]
                q22 =  df_respostas_big_five_s.iloc[23]
                q23 =  df_respostas_big_five_s.iloc[24]
                q24 =  df_respostas_big_five_s.iloc[25]
                q25 =  df_respostas_big_five_s.iloc[26]
                q26 =  df_respostas_big_five_s.iloc[27]
                q27 =  df_respostas_big_five_s.iloc[28]
                q28 =  df_respostas_big_five_s.iloc[29]
                q29 =  df_respostas_big_five_s.iloc[30]
                q30 =  df_respostas_big_five_s.iloc[31]
                q31 =  df_respostas_big_five_s.iloc[32]
                q32 =  df_respostas_big_five_s.iloc[33]
                q33 =  df_respostas_big_five_s.iloc[34]
                q34 =  df_respostas_big_five_s.iloc[35]
                q35 =  df_respostas_big_five_s.iloc[36]
                q36 =  df_respostas_big_five_s.iloc[37]
                q37 =  df_respostas_big_five_s.iloc[38]
                q38 =  df_respostas_big_five_s.iloc[39]
                q39 =  df_respostas_big_five_s.iloc[40]
                q40 =  df_respostas_big_five_s.iloc[41]
                q41 =  df_respostas_big_five_s.iloc[42]
                q42 =  df_respostas_big_five_s.iloc[43]
                q43 =  df_respostas_big_five_s.iloc[44]
                q44 =  df_respostas_big_five_s.iloc[45]
                        
                extroversao = np.mean([q1, q6, q11, q16, q21, q26, q31, q36])
                amababilidade = np.mean([q2, q7, q12, q17, q22, q27, q32, q37, q42])
                conscienciosidade = np.mean([q3, q8, q13, q18, q23, q28, q33, q38, q43])
                estabilidade_emocional = np.mean([q4, q9, q14, q19, q24, q29, q34, q39])
                abertura_a_experiencias = np.mean([q5, q10, q15, q20, q25, q30, q35, q40, q41, q44])
                
                col1, col2, col3 = st.columns(3)
                col4, col5, col6 = st.columns(3)
            
                col1.metric("Extroversão: ", round(extroversao, 1) , "-BAIXA" if (round(extroversao, 1) < limite) else "ALTA")
                col2.metric("Amababilidade: ", round(amababilidade, 1) , "-BAIXA" if (round(amababilidade, 1) < limite) else "ALTA")
                col3.metric("Conscienciosidade: ", round(conscienciosidade, 1) , "-BAIXA" if (round(conscienciosidade, 1) < limite) else "ALTA")
                col4.metric("Estabilidade Emocional: ", round(estabilidade_emocional, 1), "-BAIXA" if (round(estabilidade_emocional, 1) < limite) else "ALTA")
                col5.metric("Abertura a experiencias: ", round(abertura_a_experiencias, 1 ), "-BAIXA" if (round(abertura_a_experiencias, 1) < limite) else "ALTA")
                
            else:
                st.warning("Aluno ainda não respondeu ao questionário.")

    with autorregulacao:
        analise, grafico, dados  = st.tabs(["Análise Autorregulação", "Gráfico Autorregulação", "Dados Autorregulação"])
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
                q1 =  df_quest_reg_s.iloc[2]
                q2 =  df_quest_reg_s.iloc[3]
                q3 =  df_quest_reg_s.iloc[4]
                q4 =  df_quest_reg_s.iloc[5]
                q5 =  df_quest_reg_s.iloc[6]
                q6 =  df_quest_reg_s.iloc[7]
                q7 =  df_quest_reg_s.iloc[8]
                q8 =  df_quest_reg_s.iloc[9]
                q9 =  df_quest_reg_s.iloc[10]
                q10 =  df_quest_reg_s.iloc[11]
                q11 =  df_quest_reg_s.iloc[12]
                q12 =  df_quest_reg_s.iloc[13]
                q13 =  df_quest_reg_s.iloc[14]
                q14 =  df_quest_reg_s.iloc[15]
                q15 =  df_quest_reg_s.iloc[16]
                q16 =  df_quest_reg_s.iloc[17]
                q17 =  df_quest_reg_s.iloc[18]
                q18 =  df_quest_reg_s.iloc[19]
                q19 =  df_quest_reg_s.iloc[20]
                q20 =  df_quest_reg_s.iloc[21]
                q21 =  df_quest_reg_s.iloc[22]
                q22 =  df_quest_reg_s.iloc[23]
                q23 =  df_quest_reg_s.iloc[24]
                q24 =  df_quest_reg_s.iloc[25]
                q25 =  df_quest_reg_s.iloc[26]
                q26 =  df_quest_reg_s.iloc[27]
                q27 =  df_quest_reg_s.iloc[28]
                q28 =  df_quest_reg_s.iloc[29]
                q29 =  df_quest_reg_s.iloc[30]
                q30 =  df_quest_reg_s.iloc[31]
                q31 =  df_quest_reg_s.iloc[32]
                q32 =  df_quest_reg_s.iloc[33]
                q33 =  df_quest_reg_s.iloc[34]
                q34 =  df_quest_reg_s.iloc[35]
                q35 =  df_quest_reg_s.iloc[36]
                q36 =  df_quest_reg_s.iloc[37]
                q37 =  df_quest_reg_s.iloc[38]
                q38 =  df_quest_reg_s.iloc[39]
                q39 =  df_quest_reg_s.iloc[40]
                q40 =  df_quest_reg_s.iloc[41]
                q41 =  df_quest_reg_s.iloc[42]
                q42 =  df_quest_reg_s.iloc[43]
                q43 =  df_quest_reg_s.iloc[44]
                q44 =  df_quest_reg_s.iloc[45]
                
                media_orientacao_metas_intrinsecas = np.mean([q1, q2])
                media_orientacao_metas_extrinsicas = np.mean([q3, q4])
                media_valorizacao_da_atividade = np.mean([q5, q6, q7, q8, q9, q10])
                controle_do_aprendizado = np.mean([q11, q12, q13])
                autoeficacia_para_aprendizado = np.mean([q14, q15, q16, q17])
                ansiedade_em_testes = np.mean([q18, q19, q20, q21, q22])
            
                st.write("Escalas de Motivação")
                col1, col2, col3 = st.columns(3)
                col4, col5, col6 = st.columns(3)
                
                col1.metric("Orientação a Metas Intrínsecas: ", round(media_orientacao_metas_intrinsecas, 1), "-BAIXA" if (round(media_orientacao_metas_intrinsecas, 1) < limite) else "ALTA")
                col2.metric("Orientação a Metas Extrínsicas: ", round(media_orientacao_metas_extrinsicas, 1), "-BAIXA" if (round(media_orientacao_metas_extrinsicas, 1) < limite) else "ALTA")
                col3.metric("Valorização da Atividade: ", round(media_valorizacao_da_atividade, 1), "-BAIXA" if (round(media_valorizacao_da_atividade, 1) < limite) else "ALTA")
                col4.metric("Controle do Aprendizado: ", round(controle_do_aprendizado, 1), "-BAIXA" if (round(controle_do_aprendizado, 1) < limite) else "ALTA")
                col5.metric("Autoeficacia para Aprendizado: ", round(autoeficacia_para_aprendizado,1), "-BAIXA" if (round(autoeficacia_para_aprendizado, 1) < limite) else "ALTA")
                col6.metric("Ansiedade em testes: ", round(ansiedade_em_testes, 1), "-BAIXA" if (round(ansiedade_em_testes, 1) < limite) else "ALTA")
                
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
                
                col7.metric("Ensaio memorização: ", round(ensaio_memorizacao, 1), "-BAIXA" if (round(ensaio_memorizacao, 1) < limite) else "ALTA")
                col8.metric("Elaboração: ", round(elaboracao, 1), "-BAIXA" if (round(elaboracao, 1) < limite) else "ALTA")
                col9.metric("Organização: ", round(organizacao, 1), "-BAIXA" if (round(organizacao, 1) < limite) else "ALTA")
                col10.metric("Pensamento crítico: ", round(pensamento_critico, 1), "-BAIXA" if (round(pensamento_critico, 1) < limite) else "ALTA")
                col11.metric("Autorregulacao Metacognitiva: ", round(autorregulacao_metacognitiva, 1), "-BAIXA" if (round(autorregulacao_metacognitiva, 1) < limite) else "ALTA")
                col12.metric("Tempo e ambiente de estudo: ", round(tempo_e_ambiente_de_estudo, 1), "-BAIXA" if (round(tempo_e_ambiente_de_estudo, 1) < limite) else "ALTA")
                col13.metric("Administração de esforços: ", round(administracao_de_esforcos,1), "-BAIXA" if (round(administracao_de_esforcos, 1) < limite) else "ALTA")
            else:
                st.write("Aluno ainda não respondeu ao questionário.")
                    
        with grafico:
            st.write("Dados do questionário de autorregulação")
            df_quest_reg = st.session_state["df_respostas"]
            if len (df_quest_reg[df_quest_reg["Nome de usuário"] == email_estudante_selecionado]) > 0:
                df_quest_reg_s = df_quest_reg[df_quest_reg["Nome de usuário"] == email_estudante_selecionado].iloc[0]
                q1 =  df_quest_reg_s.iloc[2]
                q2 =  df_quest_reg_s.iloc[3]
                q3 =  df_quest_reg_s.iloc[4]
                q4 =  df_quest_reg_s.iloc[5]
                q5 =  df_quest_reg_s.iloc[6]
                q6 =  df_quest_reg_s.iloc[7]
                q7 =  df_quest_reg_s.iloc[8]
                q8 =  df_quest_reg_s.iloc[9]
                q9 =  df_quest_reg_s.iloc[10]
                q10 =  df_quest_reg_s.iloc[11]
                q11 =  df_quest_reg_s.iloc[12]
                q12 =  df_quest_reg_s.iloc[13]
                q13 =  df_quest_reg_s.iloc[14]
                q14 =  df_quest_reg_s.iloc[15]
                q15 =  df_quest_reg_s.iloc[16]
                q16 =  df_quest_reg_s.iloc[17]
                q17 =  df_quest_reg_s.iloc[18]
                q18 =  df_quest_reg_s.iloc[19]
                q19 =  df_quest_reg_s.iloc[20]
                q20 =  df_quest_reg_s.iloc[21]
                q21 =  df_quest_reg_s.iloc[22]
                q22 =  df_quest_reg_s.iloc[23]
                q23 =  df_quest_reg_s.iloc[24]
                q24 =  df_quest_reg_s.iloc[25]
                q25 =  df_quest_reg_s.iloc[26]
                q26 =  df_quest_reg_s.iloc[27]
                q27 =  df_quest_reg_s.iloc[28]
                q28 =  df_quest_reg_s.iloc[29]
                q29 =  df_quest_reg_s.iloc[30]
                q30 =  df_quest_reg_s.iloc[31]
                q31 =  df_quest_reg_s.iloc[32]
                q32 =  df_quest_reg_s.iloc[33]
                q33 =  df_quest_reg_s.iloc[34]
                q34 =  df_quest_reg_s.iloc[35]
                q35 =  df_quest_reg_s.iloc[36]
                q36 =  df_quest_reg_s.iloc[37]
                q37 =  df_quest_reg_s.iloc[38]
                q38 =  df_quest_reg_s.iloc[39]
                q39 =  df_quest_reg_s.iloc[40]
                q40 =  df_quest_reg_s.iloc[41]
                q41 =  df_quest_reg_s.iloc[42]
                q42 =  df_quest_reg_s.iloc[43]
                q43 =  df_quest_reg_s.iloc[44]
                q44 =  df_quest_reg_s.iloc[45]
                
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
                graf1 = ax.barh(constructors, counts, color='#909090')
                ax.bar_label(graf1, fmt="%.01f", size=10, label_type="edge")
                ax.set_xlabel('Resposta')
                ax.set_xticks([1,2,3,4,5,6,7])
                #ax.set_title('Perfil do estudante - Escalas de motivação')
                st.pyplot(plt)
                
                st.write("Escalas de Estratégias de aprendizagem")
                fig, ax = plt.subplots()
                constructors = ["Ensaio memorização","Elaboração","Organização","Pensamento crítico","Autorregulacao Metacognitiva","Tempo e ambiente de estudo","Administração de esforços"]
                counts = [ensaio_memorizacao,elaboracao,organizacao,pensamento_critico,autorregulacao_metacognitiva,tempo_e_ambiente_de_estudo,administracao_de_esforcos]
                graf1 = ax.barh(constructors, counts, color='#909090')
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
                q1 =  df_quest_reg_s.iloc[2]
                q2 =  df_quest_reg_s.iloc[3]
                q3 =  df_quest_reg_s.iloc[4]
                q4 =  df_quest_reg_s.iloc[5]
                q5 =  df_quest_reg_s.iloc[6]
                q6 =  df_quest_reg_s.iloc[7]
                q7 =  df_quest_reg_s.iloc[8]
                q8 =  df_quest_reg_s.iloc[9]
                q9 =  df_quest_reg_s.iloc[10]
                q10 =  df_quest_reg_s.iloc[11]
                q11 =  df_quest_reg_s.iloc[12]
                q12 =  df_quest_reg_s.iloc[13]
                q13 =  df_quest_reg_s.iloc[14]
                q14 =  df_quest_reg_s.iloc[15]
                q15 =  df_quest_reg_s.iloc[16]
                q16 =  df_quest_reg_s.iloc[17]
                q17 =  df_quest_reg_s.iloc[18]
                q18 =  df_quest_reg_s.iloc[19]
                q19 =  df_quest_reg_s.iloc[20]
                q20 =  df_quest_reg_s.iloc[21]
                q21 =  df_quest_reg_s.iloc[22]
                q22 =  df_quest_reg_s.iloc[23]
                q23 =  df_quest_reg_s.iloc[24]
                q24 =  df_quest_reg_s.iloc[25]
                q25 =  df_quest_reg_s.iloc[26]
                q26 =  df_quest_reg_s.iloc[27]
                q27 =  df_quest_reg_s.iloc[28]
                q28 =  df_quest_reg_s.iloc[29]
                q29 =  df_quest_reg_s.iloc[30]
                q30 =  df_quest_reg_s.iloc[31]
                q31 =  df_quest_reg_s.iloc[32]
                q32 =  df_quest_reg_s.iloc[33]
                q33 =  df_quest_reg_s.iloc[34]
                q34 =  df_quest_reg_s.iloc[35]
                q35 =  df_quest_reg_s.iloc[36]
                q36 =  df_quest_reg_s.iloc[37]
                q37 =  df_quest_reg_s.iloc[38]
                q38 =  df_quest_reg_s.iloc[39]
                q39 =  df_quest_reg_s.iloc[40]
                q40 =  df_quest_reg_s.iloc[41]
                q41 =  df_quest_reg_s.iloc[42]
                q42 =  df_quest_reg_s.iloc[43]
                q43 =  df_quest_reg_s.iloc[44]
                q44 =  df_quest_reg_s.iloc[45]
                
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
                if (media_orientacao_metas_intrinsecas <= limite) or (media_orientacao_metas_extrinsicas <= limite) or (media_valorizacao_da_atividade <= limite) or (controle_do_aprendizado <= limite):
                    st.write("Motivo: baixa capacidade de Orientação à metas intrínsecas")
                    st.write("Dica:")
                    
                    for l in str(df_dicas["dicas"].iloc[0]).split(" / "):
                        st.success(l)
                    
                    st.divider()
                if autoeficacia_para_aprendizado <= limite:
                    st.write("Motivo: baixa capacidade de autoeficácia no aprendizado")
                    st.write("Dica:")
                    for l in str(df_dicas["dicas"].iloc[1]).split(" / "):
                        st.success(l)
                    st.divider()
                if ansiedade_em_testes <= limite:
                    st.markdown("Motivo: baixa ansiedade em testes")
                    st.write("Dica:")
                    for l in str(df_dicas["dicas"].iloc[2]).split(" / "):
                        st.success(l)
                    st.divider()
                if ensaio_memorizacao <= limite:
                    st.write("Motivo: baixa memorização")
                    st.write("Dica:")
                    for l in str(df_dicas["dicas"].iloc[3]).split(" / "):
                        st.success(l)
                    st.divider()
                if elaboracao <= limite:
                    st.write("Motivo: baixa elaboração")
                    st.write("Dica:")
                    for l in str(df_dicas["dicas"].iloc[4]).split(" / "):
                        st.success(l)
                    st.divider()
                if organizacao <= limite:
                    st.write("Motivo: baixa organização")
                    st.write("Dica:")
                    for l in str(df_dicas["dicas"].iloc[5]).split(" / "):
                        st.success(l)
                    st.divider()
                #if pensamento_critico <= 3:
                #    st.write(df_dicas["dicas"].iloc[2])
                if autorregulacao_metacognitiva <= limite:
                    st.write("Motivo: baixa autorregulação metacognitiva")
                    st.write("Dica:")
                    for l in str(df_dicas["dicas"].iloc[6]).split(" / "):
                        st.success(l)
                    st.divider()
                if tempo_e_ambiente_de_estudo <= limite:
                    st.write("Motivo: baixo tempo e ambiente de estudo")
                    st.write("Dica:")
                    for l in str(df_dicas["dicas"].iloc[7]).split(" / "):
                        st.success(l)
                    st.divider()
                if administracao_de_esforcos <= limite:
                    st.write("Motivo: baixo administração de esforços")
                    st.write("Dica:")
                    for l in str(df_dicas["dicas"].iloc[8]).split(" / "):
                        st.success(l)
                    st.divider()
                
                # enviar dicas automaticas
                if btn_enviar_dica_automaticas:
                    if media_orientacao_metas_intrinsecas <= 4 or media_orientacao_metas_extrinsicas <= 3 or media_valorizacao_da_atividade <= 3 or controle_do_aprendizado <= 3:
                        enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[0], df_dicas["dicas"].iloc[0])
                    if autoeficacia_para_aprendizado <= 4:
                        enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[1], df_dicas["dicas"].iloc[1])
                    if ansiedade_em_testes <= 4:
                        enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[2], df_dicas["dicas"].iloc[2])
                    if ensaio_memorizacao <= 4:
                        enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[3], df_dicas["dicas"].iloc[3])
                    if elaboracao <= 4:
                        enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[4], df_dicas["dicas"].iloc[4])
                    if organizacao <= 4:
                        enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[5], df_dicas["dicas"].iloc[5])
                    if autorregulacao_metacognitiva <= 4:
                        enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[6], df_dicas["dicas"].iloc[6])
                    if tempo_e_ambiente_de_estudo <= 4:
                        enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[7], df_dicas["dicas"].iloc[7])
                    if administracao_de_esforcos <= 4:
                        enviar_dica_professor(id_estudante_selecionado, "Dica: " + df_dicas["constructo"].iloc[8], df_dicas["dicas"].iloc[8])
                    
            else:
                st.write("Aluno ainda não respondeu ao questionário.")    