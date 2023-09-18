import streamlit as st
import webbrowser

# Bigfive
# https://edisciplinas.usp.br/pluginfile.php/5081564/mod_resource/content/1/Exercicio%20de%20Avaliacao%20de%20Personalidade_Big%20Five_v%202018%2010%2022_v4.pdf

url_autorregulacao = 'https://docs.google.com/forms/d/e/1FAIpQLSfGXe0yUZve0ecQBCoUU7W7rQr4XQ6B9jDW1cKpG6gJt6c5YA/viewform'
if st.button('Abrir questionário de autorregulação em outra aba'):
    webbrowser.open_new_tab(url_autorregulacao)

url_bigfive = 'https://docs.google.com/forms/d/e/1FAIpQLSfnb-IOWP2ZdXbdBcO4dAzmc_6sQt6--TxywxJUaIfK-K3RqA/viewform'
if st.button('Abrir questionário bigfive em outra aba'):
    webbrowser.open_new_tab(url_bigfive)