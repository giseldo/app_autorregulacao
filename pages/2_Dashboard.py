import streamlit as st

st.title("Dashboard da turma")

st.markdown('### Métricas da turma')
col1, col2, col3 = st.columns(3)

df_estudantes = st.session_state["df_estudantes"]

col1.metric("Total de Alunos", len(df_estudantes))

#col2.metric("Média Geral", "7.3", "+1")
#col2.metric("Conclusão Atividades", "50%", "-8%")
#col3.metric("Presença", "86%", "+4%")
#col4, col5, col6 = st.columns(3)
#col5.metric("Alunos com baixo desempenho", "2")
#st.image("img/escalas1.jpg")
#st.image("img/escalas2.jpg")