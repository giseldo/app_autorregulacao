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

SCOPES = "openid profile email https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/drive.readonly.metadata https://www.googleapis.com/auth/classroom.announcements https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.courseworkmaterials https://www.googleapis.com/auth/classroom.guardianlinks.students https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.push-notifications https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.topics"

oauth2 = OAuth2Component(client_id=CLIENT_ID, client_secret=CLIENT_SECRET, authorize_endpoint=AUTHORIZE_URL, token_endpoint=TOKEN_URL, refresh_token_endpoint=REFRESH_TOKEN_URL, revoke_token_endpoint=REVOKE_TOKEN_URL)
st.title("NEOAVA - v2")
st.divider()
st.subheader("Um ambiente virtual para auxiliar o professor e o estudante com autorregulação e bigfive")

st.warning("Esse aplicativo é integrado com o Google Sala de aula. Portanto, é preciso efetuar login com a sua conta do google que deseja utilizar. ")
# Check if token exists in session state
if 'token' not in st.session_state:
    # If not, show authorize button
    result = oauth2.authorize_button("Login", REDIRECT_URI, SCOPES)
    
    if result and 'token' in result:
        # If authorization successful, save token in session state
        st.session_state.token = result.get('token')
else:
    # If token exists in session state, show the token
    token = st.session_state['token']
    #st.json(token)
    access_token = token.get("access_token")
        
    st.warning("Aguarde carregar TODOS os dados antes de continuar.")
    
    # carregar as questoes do mslq
    df_questoes_mslq = pd.read_csv("datasets/mslq.csv")
    st.session_state["df_questoes_mslq"] = df_questoes_mslq
    
    # carregar as dicas
    df_dicas = pd.read_csv("datasets/dicas.csv")
    st.session_state["df_dicas"] = df_dicas
    
    creds = Credentials(token=access_token)
    service = build('classroom', 'v1', credentials=creds)
    
    def carregar_dataframe_autorregulacao_novo():
        spreadsheet_id="19Bn8EFdhkSx71m0PkvoG8GbEUJW7vNRdJBdatfn6Keg"
        creds = Credentials(token=access_token)
        service = build('sheets', 'v4', credentials=creds)
        result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id, range="A1:AT10").execute()
        rows = result.get('values', [])
   
        panda_df = pd.DataFrame(data = rows[1:], columns=rows[0])
        
        panda_df = panda_df.astype({panda_df.columns[2]: int, panda_df.columns[3]: int, panda_df.columns[4]: int, panda_df.columns[5]: int, panda_df.columns[6]: int, panda_df.columns[7]: int, panda_df.columns[8]: int, panda_df.columns[9]: int, panda_df.columns[10]: int,
        panda_df.columns[11]: int, panda_df.columns[12]: int, panda_df.columns[13]: int, panda_df.columns[14]: int, panda_df.columns[15]: int, panda_df.columns[16]: int, panda_df.columns[17]: int, panda_df.columns[18]: int, panda_df.columns[19]: int, panda_df.columns[20]: int,
        panda_df.columns[21]: int, panda_df.columns[22]: int, panda_df.columns[23]: int, panda_df.columns[24]: int, panda_df.columns[25]: int, panda_df.columns[26]: int, panda_df.columns[27]: int, panda_df.columns[28]: int, panda_df.columns[29]: int, panda_df.columns[30]: int,
        panda_df.columns[31]: int, panda_df.columns[32]: int, panda_df.columns[33]: int, panda_df.columns[34]: int, panda_df.columns[35]: int, panda_df.columns[36]: int, panda_df.columns[37]: int, panda_df.columns[38]: int, panda_df.columns[39]: int, panda_df.columns[40]: int,
        panda_df.columns[41]: int, panda_df.columns[42]: int, panda_df.columns[43]: int, panda_df.columns[44]: int, panda_df.columns[45]: int})
                        
        return panda_df
        #return pd.read_csv("datasets/resposta_autorregulacao_v2.csv")
        
    def carregar_dataframe_bigfive_novo():
        spreadsheet_id="19Py0-JS3o2QDEdCX2EaJ2vV3M8uTUIgX8q52BQ4NiY4"
        creds = Credentials(token=access_token)
        service = build('sheets', 'v4', credentials=creds)
        result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id, range="A1:AT10").execute()
        rows = result.get('values', [])
   
        panda_df = pd.DataFrame(data = rows[1:], columns=rows[0])
                                
        panda_df = panda_df.astype({panda_df.columns[2]: int, panda_df.columns[3]: int, panda_df.columns[4]: int, panda_df.columns[5]: int, panda_df.columns[6]: int, panda_df.columns[7]: int, panda_df.columns[8]: int, panda_df.columns[9]: int, panda_df.columns[10]: int,
        panda_df.columns[11]: int, panda_df.columns[12]: int, panda_df.columns[13]: int, panda_df.columns[14]: int, panda_df.columns[15]: int, panda_df.columns[16]: int, panda_df.columns[17]: int, panda_df.columns[18]: int, panda_df.columns[19]: int, panda_df.columns[20]: int,
        panda_df.columns[21]: int, panda_df.columns[22]: int, panda_df.columns[23]: int, panda_df.columns[24]: int, panda_df.columns[25]: int, panda_df.columns[26]: int, panda_df.columns[27]: int, panda_df.columns[28]: int, panda_df.columns[29]: int, panda_df.columns[30]: int,
        panda_df.columns[31]: int, panda_df.columns[32]: int, panda_df.columns[33]: int, panda_df.columns[34]: int, panda_df.columns[35]: int, panda_df.columns[36]: int, panda_df.columns[37]: int, panda_df.columns[38]: int, panda_df.columns[39]: int, panda_df.columns[40]: int,
        panda_df.columns[41]: int, panda_df.columns[42]: int, panda_df.columns[43]: int, panda_df.columns[44]: int, panda_df.columns[45]: int})
                        
        return panda_df
        #return pd.read_csv("datasets/resposta_bigfive_v2.csv")
    
    # carregar as respostas de autorregulação
    df_respostas = carregar_dataframe_autorregulacao_novo()
    st.session_state["df_respostas"] = df_respostas
    
     # carregar questoes do big five    
    df_respostas_big_five = carregar_dataframe_bigfive_novo()
    st.session_state["df_respostas_big_five"] = df_respostas_big_five  
    
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
        #st.success("Todos os estudantes carregados!")
        
    if btn_carregar_curso:
        #st.write("Curso Selecionado: ", curso_selecionado)
        df_curso = df_cursos[df_cursos["nome"]==curso_selecionado]
        id_curso_selecionado = df_curso["id"].iloc[0]
        #st.write("ID do curso selecionado: ", id_curso_selecionado)
        st.session_state["id_curso_selecionado"] = id_curso_selecionado
        carregar_alunos(id_curso_selecionado)
        st.success("Todos os dados carregados!")


