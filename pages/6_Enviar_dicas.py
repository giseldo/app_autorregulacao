import streamlit as st
from googleapiclient import discovery
from httplib2 import Http
from oauth2client import file, client, tools

st.title("Enviar dicas para todos os alunos")

df_estudantes = st.session_state["df_estudantes"]
id_curso_selecionado = st.session_state["id_curso_selecionado"]

st.write("Dados dos alunos")
df_estudantes

st.write("Dicas para todos os alunos")
txt_titulo_dica_prof = st.text_input("Título", key="txt_titulo_dica_prof")
txt_desc_dica_prof = st.text_area("Descrição", key="txt_desc_dica_prof")
btn_enviar_dica_professor_todos = st.button("Enviar", key ="btndicaprofessor")

def enviar_dica_professor(titulo, descricao):
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
    
    dica = {
            'title': titulo,
            'description': descricao,
            'state': 'PUBLISHED',
        }

    # Enviar mensagem
    dica_enviada = classroom.courses().courseWorkMaterials().create(courseId=id_curso_selecionado, body=dica).execute()
    (f"Diva enviada para todos os alunos do sala de aula: {dica_enviada.get('id')}")
    
if btn_enviar_dica_professor_todos:
    enviar_dica_professor(txt_titulo_dica_prof, txt_desc_dica_prof)




    
      
    
