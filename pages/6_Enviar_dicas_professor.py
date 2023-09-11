import streamlit as st
import pandas as pd

st.title("Enviar dica para os alunos")

df = pd.read_csv("datasets/questionario.csv", index_col=0, dtype={"nome": "string"})
st.session_state["data"] = df
df["nome"]

st.text_area(label="Dica Personalizada")
st.button("Enviar dica.")

