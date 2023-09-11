import pandas as pd
import streamlit as st

st.title("Manutenção do Questionário MSLQ")

st.write("Escalas de Motivação e Estratégias de aprendizagem")

df_mslq = pd.read_csv("datasets/mslq.csv")
df_mslq