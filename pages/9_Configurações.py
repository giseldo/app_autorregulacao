import streamlit as st

st.title("Configurações")

if "id_curso_selecionado" not in st.session_state:
    st.error("Volte para a tela principal faça login e carregue uma turma!")
else:

    # https://edisciplinas.usp.br/pluginfile.php/5081564/mod_resource/content/1/Exercicio%20de%20Avaliacao%20de%20Personalidade_Big%20Five_v%202018%2010%2022_v4.pdf

    st.write("Questionário Autorregulação 1.1 - [link](https://docs.google.com/forms/d/e/1FAIpQLSfGXe0yUZve0ecQBCoUU7W7rQr4XQ6B9jDW1cKpG6gJt6c5YA/viewform)")

    st.write("Questionário Autorregulação 1.2 - [link](https://docs.google.com/forms/d/e/1FAIpQLSdPd0MY4UEUj3nmPB0yWE5njMdxIVmaVF6WYMzis5MDeMsubw/viewform)")

    st.write("Questionário BigFive 1.1 - [link](https://docs.google.com/forms/d/e/1FAIpQLSfnb-IOWP2ZdXbdBcO4dAzmc_6sQt6--TxywxJUaIfK-K3RqA/viewform)")

    st.write("Questionário BigFive 1.2 - [link](https://docs.google.com/forms/d/e/1FAIpQLSdClNlfFq6D-6OPI8T-qeRZGScNd2aog_Pdu_3yfQHVI8T-Pg/viewform)")

    st.write("Questionário de autorregulação X.0 - [link](https://docs.google.com/forms/d/e/1FAIpQLSeCw4dC2bJnr69qf2HkvOpFAAumkYq1hHvmYAO-N0CMERYyKg/viewform)")

    valor = st.session_state["limite"]
    limite = st.slider('Qual o limite da Autorregulação?', 0, 7, valor)
    st.session_state["limite"] = limite

    valor_big = st.session_state["limite_bigfive"]
    limite = st.slider('Qual o limite do BigFive?', 0, 5, valor_big)
    st.session_state["limite_bigfive"] = valor_big

