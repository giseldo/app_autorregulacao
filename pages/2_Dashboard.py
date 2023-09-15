import streamlit as st

st.title("Dashboard da turma")

st.markdown('### Métricas da turma')
col1, col2, col3 = st.columns(3)

df_estudantes = st.session_state["df_estudantes"]

col1.metric("Total de Alunos", len(df_estudantes))