import pandas as pd
import streamlit as st

st.title("Lista das perguntas do questionário MSLQ")

df_mslq = pd.read_csv("datasets/mslq.csv", names=["id_questao","Tipo","Constructo","Questão"], header=0 , usecols=["Tipo","Constructo","Questão"])
df_mslq