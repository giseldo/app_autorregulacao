import streamlit as st

from google.oauth2.credentials import Credentials 
from googleapiclient.discovery import build
from googleapiclient.discovery import build

st.title("Enviar dicas para todos os alunos")

if "df_estudantes" not in st.session_state:
    st.error("Volte para a tela principal faça login e carregue uma turma!")
else:

    df_estudantes = st.session_state["df_estudantes"]
    id_curso_selecionado = st.session_state["id_curso_selecionado"]

    st.write("Dados dos alunos")
    df_estudantes

    st.write("Dicas para todos os alunos")
    txt_titulo_dica_prof = st.text_input("Título", key="txt_titulo_dica_prof")
    txt_desc_dica_prof = st.text_area("Descrição", key="txt_desc_dica_prof")
    btn_enviar_dica_professor_todos = st.button("Enviar", key ="btndicaprofessor")

    def enviar_dica_professor(titulo, descricao):
        
        token = st.session_state['token']
        classroom = build('classroom', 'v1', credentials=Credentials(token=token.get("access_token")))
        
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

    



    
      
    
