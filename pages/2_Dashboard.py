import streamlit as st
import numpy as np
import matplotlib.pyplot as plt

st.title("Dashboard da turma")

if "df_estudantes" not in st.session_state:
    st.error("Volte para a tela principal faça login e carregue uma turma!")
else:

    st.markdown('### Métricas da turma')
    col1, col2, col3 = st.columns(3)

    df_estudantes = st.session_state["df_estudantes"]

    col1.metric("Total de Alunos", len(df_estudantes))

    category_names = ['Discodo totalmente', 'Discordo',
                    'indiferente', 'Concordo', 'Concordo totalmente']
# results = {
#     'Extroversão': [1, 0, 0, 0, 1],
#     'Amababilidade': [1, 0, 0, 0, 1],
#     'Conscienciosidade': [1, 0, 0, 0, 1],
#     'Estabilidade Emocional': [1, 0, 0, 0, 1],
#     'Abertura a experiencias': [1, 0, 0, 0, 1],
# }

# def survey(results, category_names):
#     """
#     Parameters
#     ----------
#     results : dict
#         A mapping from question labels to a list of answers per category.
#         It is assumed all lists contain the same number of entries and that
#         it matches the length of *category_names*.
#     category_names : list of str
#         The category labels.
#     """
#     labels = list(results.keys())
#     data = np.array(list(results.values()))
#     data_cum = data.cumsum(axis=1)
#     category_colors = plt.get_cmap('RdYlGn')(
#         np.linspace(0.15, 0.85, data.shape[1]))

#     fig, ax = plt.subplots(figsize=(9.2, 5))
#     ax.invert_yaxis()
#     ax.xaxis.set_visible(False)
#     ax.set_xlim(0, np.sum(data, axis=1).max())

#     for i, (colname, color) in enumerate(zip(category_names, category_colors)):
#         widths = data[:, i]
#         starts = data_cum[:, i] - widths
#         ax.barh(labels, widths, left=starts, height=0.5,
#                 label=colname, color=color)
#         xcenters = starts + widths / 2

#         r, g, b, _ = color
#         text_color = 'white' if r * g * b < 0.5 else 'darkgrey'
#         for y, (x, c) in enumerate(zip(xcenters, widths)):
#             ax.text(x, y, str(int(c)), ha='center', va='center',
#                     color=text_color)
#     ax.legend(ncol=len(category_names), bbox_to_anchor=(0, 1),
#               loc='lower left', fontsize='small')

#     return fig, ax


# survey(results, category_names)
# #plt.show()

# st.pyplot(plt)