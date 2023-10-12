import pandas as pd
import streamlit as st

st.title("Lista das perguntas do questionário de autorregulação")
st.divider()

if "id_curso_selecionado" not in st.session_state:
    st.error("Volte para a tela principal faça login e carregue uma turma!")
else: 

    df_mslq = pd.read_csv("datasets/mslq.csv", names=["id_questao","Tipo","Constructo","Questão"], header=0 , usecols=["Tipo","Constructo","Questão"])
    st.dataframe(df_mslq, hide_index=True)
    
    
    
    