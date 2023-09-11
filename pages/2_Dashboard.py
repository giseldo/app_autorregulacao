import streamlit as st

st.title("Dashboard da turma")

st.markdown('### Metricas da turma')
col1, col2, col3 = st.columns(3)
col1.metric("Total de Alunos", "3")
col2.metric("Média Geral", "7.3", "+1")

#col2.metric("Conclusão Atividades", "50%", "-8%")
#col3.metric("Presença", "86%", "+4%")
#col4, col5, col6 = st.columns(3)
#col5.metric("Alunos com baixo desempenho", "2")

st.image("img/escalas1.jpg")
st.image("img/escalas2.jpg")