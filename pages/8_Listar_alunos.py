import streamlit as st
import pandas as pd

from googleapiclient import discovery
from httplib2 import Http
from oauth2client import file, client, tools

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

id_curso_selecionado = st.session_state["id_curso_selecionado"]
st.title(f"Lista dos alunos do sala de aula.")
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

