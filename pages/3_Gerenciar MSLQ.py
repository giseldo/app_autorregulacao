import pandas as pd
import streamlit as st

st.title("Questionário MSLQ")

df_mslq = pd.read_csv("datasets/mslq.csv")

df_mslq