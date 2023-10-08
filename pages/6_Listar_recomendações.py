import streamlit as st
import pandas as pd



st.title("Lista das recomendacões automáticas de autorregulação")

if "id_curso_selecionado" not in st.session_state:
    st.error("Volte para a tela principal faça login e carregue uma turma!")
else: 
    df_dicas = pd.read_csv("datasets/dicas.csv", names=["ID", "Tipo", "Título", "Constructo", "Dicas"], header=0 , usecols=["Tipo", "Título", "Constructo", "Dicas"])
    df_dicas