import streamlit as st
import pandas as pd

st.title("Manutenção das Dicas")

df_dicas = pd.read_csv("datasets/dicas.csv")
df_dicas

