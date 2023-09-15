import streamlit as st
import pandas as pd

st.title("Listar as dicas automáticas")

df_dicas = pd.read_csv("datasets/dicas.csv", names=["ID", "Tipo", "Título", "Constructo", "Dicas"], header=0 , usecols=["Tipo", "Título", "Constructo", "Dicas"])
df_dicas