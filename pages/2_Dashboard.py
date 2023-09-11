import streamlit as st

st.title("Dashboard da turma ( em construção )")

st.markdown('### Metricas da turma')
col1, col2, col3 = st.columns(3)
col1.metric("Média da turma", "7", "1")
col2.metric("Conclusão Atividades", "50%", "-8%")
col3.metric("Presença", "86%", "4%")