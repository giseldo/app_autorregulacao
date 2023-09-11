import streamlit as st
import pandas as pd

st.title("Gerenciador de autorregulação")
st.write("""Desenvolvido como uma prova de conceito para a proposta de doutorado de Alana Viana!!""")
st.write("viana.alana@gmail.com")

df = pd.read_csv("datasets/questionario.csv", index_col=0, dtype={"nome": "string"})
st.session_state["data"] = df

