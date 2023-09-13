import streamlit as st

df_cursos = st.session_state['df_cursos'] 

st.title("Lista dos cursos do sala de aula")

df_cursos
