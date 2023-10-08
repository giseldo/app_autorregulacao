import streamlit as st

st.title("Lista dos cursos do sala de aula")
    
if "df_cursos" not in st.session_state:
    st.error("Volte para a tela principal faça login e carregue uma turma!")
else:

    df_cursos = st.session_state['df_cursos'] 
    df_cursos
