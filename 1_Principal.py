import streamlit as st
from streamlit_oauth import OAuth2Component
from dotenv import load_dotenv
from google.oauth2.credentials import Credentials 
from googleapiclient.discovery import build
import pandas as pd
import os

load_dotenv()

CLIENT_ID = os.environ["GOOGLE_CLIENT_ID"]
CLIENT_SECRET = os.environ["GOOGLE_CLIENT_SECRET"]
REDIRECT_URI = os.environ["GOOGLE_REDIRECT_URI"]

AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
REFRESH_TOKEN_URL = "https://oauth2.googleapis.com/token"
REVOKE_TOKEN_URL = "https://oauth2.googleapis.com/revoke"

SCOPES = "openid profile email https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/drive.readonly.metadata https://www.googleapis.com/auth/classroom.announcements https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.courseworkmaterials https://www.googleapis.com/auth/classroom.guardianlinks.students https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.push-notifications https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.topics"

oauth2 = OAuth2Component(CLIENT_ID, CLIENT_SECRET, AUTHORIZE_URL, TOKEN_URL, REFRESH_TOKEN_URL, REVOKE_TOKEN_URL)

st.title("NEOAVA - Um ambiente virtual para auxiliar o professor e o estudante com autorregulação")
st.markdown("""
             * Esse AVA apresenta o perfil de autorregulação e bigfive dos estudantes! 
             * Recomendações são geradas para o estudante de acordo com o perfil de autorregulação e bigfive!
             * O momento de envio das dicas fica a cargo do professor!
             * Prova de conceito para o Doutorado de Alana Viana Borges Neo (email: viana.alana@gmail.com)
             * Este AVA é construído baseado no Livro [Estratégias para recomendações de técnicas de autorregulação da aprendizagem](https://www.amazon.com/Estrat%C3%A9gias-recomenda%C3%A7%C3%B5es-t%C3%A9cnicas-autorregula%C3%A7%C3%A3o-aprendizagem-ebook/dp/B0CJWVN1VW/ref=sr_1_10?crid=FZTC9AFISN9N&keywords=autorregula%C3%A7%C3%A3o&qid=1696803151&sprefix=autorregula%C3%A7%C3%A3o%2Caps%2C172&sr=8-10), Alana Neo, 1ª Edição, (2023)
             * Para acesso é necessário autorização. Envie um email para viana.alana@gmail.com com a solicitação para efetuar login.
            """)

st.warning("Esse aplicativo é integrado com o Google Sala de aula. Portanto, é preciso efetuar login com a sua conta do google que deseja utilizar. ")
# Check if token exists in session state
if 'token' not in st.session_state:
    # If not, show authorize button
    result = oauth2.authorize_button("Login", REDIRECT_URI, SCOPES)
    
    if result and 'token' in result:
        # If authorization successful, save token in session state
        st.session_state.token = result.get('token')
        st.experimental_rerun()
else:
    # If token exists in session state, show the token
    token = st.session_state['token']
    #st.json(token)
    access_token = token.get("access_token")
        
    st.warning("Aguarde carregar TODOS os dados antes de continuar.")
    
    # carregar as respostas de autorregulação
    df_respostas = pd.read_csv("datasets/resposta_autorregulacao_v2.csv")
    st.session_state["df_respostas"] = df_respostas
    
    # carregar questoes do big five    
    df_respostas_big_five = pd.read_csv("datasets/resposta_bigfive_v2.csv")
    st.session_state["df_respostas_big_five"] = df_respostas_big_five  

    # carregar as questoes do mslq
    df_questoes_mslq = pd.read_csv("datasets/mslq.csv")
    st.session_state["df_questoes_mslq"] = df_questoes_mslq
    
    # carregar as dicas
    df_dicas = pd.read_csv("datasets/dicas.csv")
    st.session_state["df_dicas"] = df_dicas
    
    creds = Credentials(token=access_token)
    service = build('classroom', 'v1', credentials=creds)
    
    st.session_state["limite"] = 4
    
    results = service.courses().list(pageSize=10).execute()
    courses = results.get("courses", [])
    lista_curso = list()
    for course in courses:
        lista_curso.append([course['name'], course['id']])

    df_cursos = pd.DataFrame(lista_curso, columns=["nome", "id"])    
    st.session_state["df_cursos"] = df_cursos

    curso_selecionado = st.selectbox(label="Selecione um curso do sala de aula para continuar:", options=df_cursos["nome"])

    btn_carregar_curso = st.button("Carregar", key="btncarregarcurso")

    def carregar_alunos(id_curso_selecionado):
        creds = Credentials(token=access_token)
        classroom = build('classroom', 'v1', credentials=creds)
        results = classroom.courses().students().list(courseId=id_curso_selecionado).execute()
        estudantes = results.get("students", [])
        lista_estudante = list()
        for estudante in estudantes:
            lista_estudante.append([estudante['userId'], estudante["profile"]["name"]["fullName"], estudante["profile"]["emailAddress"]])
        df_estudantes = pd.DataFrame(lista_estudante, columns=["userId", "nome", "email"])    
        st.session_state["df_estudantes"] = df_estudantes
        st.success("Todos os estudantes carregados!")
        
    if btn_carregar_curso:
        st.write("Curso Selecionado: ", curso_selecionado)
        df_curso = df_cursos[df_cursos["nome"]==curso_selecionado]
        id_curso_selecionado = df_curso["id"].iloc[0]
        st.write("ID do curso selecionado: ", id_curso_selecionado)
        st.session_state["id_curso_selecionado"] = id_curso_selecionado
        carregar_alunos(id_curso_selecionado)
        st.success("Todos os dados carregados!")