import streamlit as st
import pandas as pd

st.title("Listar as dicas automáticas")

df_dicas = pd.read_csv("datasets/dicas.csv")

st.session_state["df_dicas"] = df_dicas
df_dicas

#st.data_editor(df_dicas, num_rows="dynamic")

