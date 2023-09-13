import streamlit as st
import streamlit_google_oauth as oauth

login_info = oauth.login(client_id="80547735486-qlqurma8i51tkdr8aqp5lncb25in1snd.apps.googleusercontent.com",
        client_secret="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",
        redirect_uri="http://autorregulacao.streamlit.app/",
        logout_button_text="Logout"
    )

if login_info:
        user_id, user_email = login_info
        st.write(f"Welcome {user_email}")
else:
        st.write("Please login")