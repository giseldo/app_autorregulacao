import streamlit as st
import pandas as pd

from googleapiclient import discovery
from httplib2 import Http
from oauth2client import file, client, tools

st.title("Gerenciador de autorregulação")
st.write("Desenvolvido como uma prova de conceito para a proposta de doutorado de Alana Viana Borges Neo!!")
st.write("viana.alana@gmail.com")
st.write("Aguarde carregando dados...")

# carregar as respostas dos estudantes
df_respostas = pd.read_csv("datasets/resposta_questionario_regulacao.csv")
st.session_state["df_respostas"] = df_respostas

# carregar as questoes do mslq
df_questoes_mslq = pd.read_csv("datasets/mslq.csv")
st.session_state["df_questoes_mslq"] = df_questoes_mslq

# carregar as dicas
df_dicas = pd.read_csv("datasets/dicas.csv")
st.session_state["df_dicas"] = df_dicas

SCOPES = [  'https://www.googleapis.com/auth/classroom.courses', 
            'https://www.googleapis.com/auth/drive.readonly.metadata', 
            'https://www.googleapis.com/auth/classroom.announcements',	
            'https://www.googleapis.com/auth/classroom.courses',
            'https://www.googleapis.com/auth/classroom.coursework.me',
            'https://www.googleapis.com/auth/classroom.coursework.students',
            'https://www.googleapis.com/auth/classroom.courseworkmaterials',
            'https://www.googleapis.com/auth/classroom.guardianlinks.students',
            'https://www.googleapis.com/auth/classroom.profile.emails',	
            'https://www.googleapis.com/auth/classroom.profile.photos',	
            'https://www.googleapis.com/auth/classroom.push-notifications',	
            'https://www.googleapis.com/auth/classroom.rosters',	
            'https://www.googleapis.com/auth/classroom.rosters.readonly',	
            'https://www.googleapis.com/auth/classroom.topics'] 

store = file.Storage('storage.json')
creds = store.get()
if not creds or creds.invalid:
    flow = client.flow_from_clientsecrets('client_id.json', SCOPES)
    creds = tools.run_flow(flow, store)
service = discovery.build('classroom', 'v1', http=creds.authorize(Http()))

# carrregar curso
results = service.courses().list(pageSize=10).execute()
courses = results.get("courses", [])
lista_curso = list()
for course in courses:
    lista_curso.append([course['name'], course['id']])

df_cursos = pd.DataFrame(lista_curso, columns=["nome", "id"])    
st.session_state["df_cursos"] = df_cursos

st.write("Selecione um curso do sala de aula para continuar")

curso_selecionado = st.selectbox(label="Selecione o curso:", options=df_cursos["nome"])

btn_carregar_curso = st.button("Carregar", key="btncarregarcurso")

def carregar_alunos(id_curso_selecionado):
    SCOPES = [  'https://www.googleapis.com/auth/classroom.courses', 
                'https://www.googleapis.com/auth/drive.readonly.metadata', 
                'https://www.googleapis.com/auth/classroom.announcements',	
                'https://www.googleapis.com/auth/classroom.courses',
                'https://www.googleapis.com/auth/classroom.coursework.me',
                'https://www.googleapis.com/auth/classroom.coursework.students',
                'https://www.googleapis.com/auth/classroom.courseworkmaterials',
                'https://www.googleapis.com/auth/classroom.guardianlinks.students',
                'https://www.googleapis.com/auth/classroom.profile.emails',	
                'https://www.googleapis.com/auth/classroom.profile.photos',	
                'https://www.googleapis.com/auth/classroom.push-notifications',	
                'https://www.googleapis.com/auth/classroom.rosters',	
                'https://www.googleapis.com/auth/classroom.rosters.readonly',	
                'https://www.googleapis.com/auth/classroom.topics'] 

    store = file.Storage('storage.json')
    creds = store.get()
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets('client_id.json', SCOPES)
        creds = tools.run_flow(flow, store)
    classroom = discovery.build('classroom', 'v1', http=creds.authorize(Http()))
    # carrregar estudantes daquele curso
    results = classroom.courses().students().list(courseId=id_curso_selecionado).execute()
    estudantes = results.get("students", [])
    lista_estudante = list()
    for estudante in estudantes:
        lista_estudante.append([estudante['userId'], estudante["profile"]["name"]["fullName"], estudante["profile"]["emailAddress"]])
    df_estudantes = pd.DataFrame(lista_estudante, columns=["userId", "nome", "email"])    
    st.session_state["df_estudantes"] = df_estudantes
    st.write("Todos os estudantes carregados!")
    
if btn_carregar_curso:
    st.write("Curso Selecionado: ", curso_selecionado)
    df_curso = df_cursos[df_cursos["nome"]==curso_selecionado]
    id_curso_selecionado = df_curso["id"].iloc[0]
    st.write("ID do curso selecionado: ", id_curso_selecionado)
    st.session_state["id_curso_selecionado"] = id_curso_selecionado
    carregar_alunos(id_curso_selecionado)
    st.write("Todos os dados carregados!")


