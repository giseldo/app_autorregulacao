import streamlit as st
import pandas as pd
from google.oauth2.credentials import Credentials 
from googleapiclient.discovery import build


st.title(f"Lista dos alunos do sala de aula.")

if "id_curso_selecionado" not in st.session_state:
    st.error("Volte para a tela principal faça login e carregue uma turma!")
else:

    token = st.session_state['token']
    classroom = build('classroom', 'v1', credentials=Credentials(token=token.get("access_token")))

    id_curso_selecionado = st.session_state["id_curso_selecionado"]


    st.write(f"Curso selecionado: {id_curso_selecionado}")

    # carrregar estudantes daquele curso
    results = classroom.courses().students().list(courseId=id_curso_selecionado).execute()
    estudantes = results.get("students", [])
    lista_estudante = list()
    for estudante in estudantes:
        lista_estudante.append([estudante['userId'], estudante["profile"]["name"]["fullName"], estudante["profile"]["emailAddress"]])

    df_estudantes = pd.DataFrame(lista_estudante, columns=["userId", "nome", "email"])    
    st.session_state["df_estudantes"] = df_estudantes
    df_estudantes