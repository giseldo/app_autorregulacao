import streamlit as st
import pandas as pd

st.title("Enviar dica de autorregulação para os alunos automatizadas")


df = pd.read_csv("datasets/questionario.csv", index_col=0, dtype={"nome": "string"})
st.session_state["data"] = df
df["nome"]

st.text_area(height= 300, label="Dicas automáticas selecionadas_",value= """**Motivação: Interesse (Orientação a metas intrínsecas, Orientação a metas extrínsecas, Valorização da atividade e Controle do aprendizado)**
Leia rapidamente a lista com os conteúdos do seu material didático ou o programa da disciplina;
Faça uma lista dos três tópicos que mais te interessam e dos três tópicos que menos te interessam.
Preste atenção a esses tópicos em particular. 
O que nos três tópicos mais interessantes faz com que você goste tanto deles?
O que faz os três outros tópicos desinteressantes? 
Você encontra alguma característica dos três tópicos mais interessantes nos tópicos menos interessantes?
Se você conseguir identificar o quê, nos três tópicos mais interessantes, faz com que você goste deles, talvez você seja capaz de aplicar o que encontrou aos três menos interessantes.
E talvez você descubra que os tópicos desinteressantes não são tão desinteressantes assim!""")

st.button("Enviar dica.")