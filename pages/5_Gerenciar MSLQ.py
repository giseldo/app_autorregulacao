import pandas as pd
import streamlit as st

st.title("Manutenção do Questionário MSLQ")

st.write("Escalas de Motivação")

df_mslq = pd.read_csv("datasets/mslq.csv")
df_mslq