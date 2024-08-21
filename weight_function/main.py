import json
from firebase_functions import https_fn, options
from firebase_admin import db, initialize_app
import numpy as np
import pandas as pd
import requests


initialize_app()


def calculate_eigen(matrix):
    eigenvalues, eigenvectors = np.linalg.eig(matrix)
    max_eigenvalue = np.max(eigenvalues)
    max_eigenvector = eigenvectors[:, np.argmax(eigenvalues)]

    # Normalize the eigenvector to get the weights
    normalized_weights = max_eigenvector / np.sum(max_eigenvector)

    # Calculate the Consistency Index (CI)
    n = matrix.shape[0]
    CI = (max_eigenvalue - n) / (n - 1)

    # Random Consistency Index (RI), values depend on matrix size
    RI_dict = {1: 0, 2: 0, 3: 0.58, 4: 0.90, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45,
           10: 1.49, 11: 1.52, 12: 1.54, 13: 1.56, 14: 1.58, 15: 1.59, 16: 1.60, 17: 1.61,
           18: 1.62, 19: 1.63, 20: 1.64, 21: 1.65, 22: 1.66, 23: 1.67, 24: 1.68, 25: 1.69,
           26: 1.70, 27: 1.71, 28: 1.72, 29: 1.73, 30: 1.74}
    RI = RI_dict.get(n, 1.49)  # 1.49 is an average fallback value

    # Calculate the Consistency Ratio (CR)
    CR = CI / RI

    consistency_interpretation = ("Consistent because CR is lower than 0.1") if CR <= 0.1 else "Inconsistent because CR is greater than CR"

    return max_eigenvalue, normalized_weights.real, CR, consistency_interpretation

def initialize_ahp_matrix(df, column_name):
    categories = df[column_name].tolist()
    n = len(categories)

    # Initialize a zero matrix of dimensions n x n
    ahp_matrix = np.zeros((n, n))

    # Create a labeled DataFrame to hold the AHP matrix
    ahp_df = pd.DataFrame(ahp_matrix, index=categories, columns=categories)

    return ahp_df

def generate_saaty_scale_with_explanations():
    return {
        'Equal Importance': 1,
        'Moderate Importance': 2,
        'Strong Importance': 3,
        'Very Strong Importance': 4,
        'Extreme Importance': 5,
        'Moderately Less Important': 6,
        'Strongly Less Important': 7,
        'Very Strongly Less Important': 8,
        'Extremely Less Important': 9
    }

def fill_ahp_matrix(ahp_df, row_name, col_names, comparison):
    saaty_scale = generate_saaty_scale_with_explanations()
    if comparison in saaty_scale:
        value = saaty_scale[comparison]
        for col_name in col_names:
            ahp_df.loc[row_name, col_name] = value
            ahp_df.loc[col_name, row_name] = 1 / value
    else:
        print("Invalid comparison description. Please select one from Saaty's scale.")
    return ahp_df

def populate_ahp_matrix(ahp_df, pesos):
    saaty_scale_dict = {i+1: option for i, option in enumerate(generate_saaty_scale_with_explanations().keys())}

    peso_index = 0

    for row in ahp_df.index:
        # Remaining weights
        temp_saaty_scale_dict = saaty_scale_dict.copy()

        criteria_dict = {i+1: col for i, col in enumerate(ahp_df.columns) if col != row and ahp_df.loc[row, col].all() == 0}

        # Remaining criteria
        temp_criteria_dict = criteria_dict.copy()

        if(peso_index < len(pesos)):
          saaty_selection = pesos[peso_index]
          selected_comparison = temp_saaty_scale_dict[saaty_selection]

          while temp_criteria_dict:
              saaty_selection = pesos[peso_index]
              selected_comparison = temp_saaty_scale_dict[saaty_selection]
              relevant_cols = [temp_criteria_dict[list(temp_criteria_dict.keys())[0]]]

              ahp_df = fill_ahp_matrix(ahp_df, row, relevant_cols, selected_comparison)

              # Pre-fill for transitive relations, i.e., if A = B and A = C, then B = C
              if selected_comparison == 'Equal Importance':
                  for i in range(len(relevant_cols)):
                      for j in range(i+1, len(relevant_cols)):
                          ahp_df.loc[relevant_cols[i], relevant_cols[j]] = 1
                          ahp_df.loc[relevant_cols[j], relevant_cols[i]] = 1

              # Update temp_criteria_dict to remove selected items
              temp_criteria_dict = {num: col for num, col in temp_criteria_dict.items() if col not in relevant_cols}
              peso_index += 1
    # Set diagonal elements to 1
    np.fill_diagonal(ahp_df.values, 1)

    return ahp_df

common_headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
}

@https_fn.on_request()
def weight_calculate(req):
    print(req.method)
    if req.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            **common_headers,
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    

    req_data = req.get_json()
    caminho_structure = req_data.get("caminhoTestStructure")
    caminho_testWeights = req_data.get("caminhoTestWeights")
    caminho_scorepercentageOBJ = req_data.get("caminhoTestScore")


# #titulos como esta no csv
    heuristicas = []
    for item in caminho_structure:
        heuristicas.append(item["title"])

    heuristica_compair = []
    for i in range(len(heuristicas)):
        current_title = heuristicas[i]
        for j in range(i + 1, len(heuristicas)):
            compared_title = heuristicas[j]
            heuristica_compair.append(f"{current_title} [{compared_title}]")


# #pesos como esta no csv
    pesos = []
    for valor in caminho_testWeights.values():
        for numero in valor:
            # Adiciona o número à lista de números
            pesos.append(numero)
    
# #COMPLETO
     #completo = [heuristica_compair, pesos]

    data = {'Categories': heuristicas}


    pesos_list = pesos

    df = pd.DataFrame(data)
    ahp_df = initialize_ahp_matrix(df, 'Categories')

    ahp_df = populate_ahp_matrix(ahp_df, pesos_list)

    print('\n\nDECISION MATRIX:')
    print(ahp_df.to_markdown())
    max_eigenvalue, normalized_weights, CR, consistency_interpretation = calculate_eigen(ahp_df)
    print("\n\nMAX VALUE = ", max_eigenvalue)

    # Normalized weights
    values_in_percentage = [value * 100 for value in normalized_weights]
    n_data = {header: [value] for header, value in zip(heuristicas, values_in_percentage)}
    df_normalized_weights = pd.DataFrame(n_data)
    print("\n\nNORMALIZED WEIGHTS = ", normalized_weights)
    print("\n\nWEIGHTS IN PERCENTAGE\n",df_normalized_weights.to_markdown())

    print("\n\nCONSISTENCY RATIO = ", CR)
    print("\n\nCONSISTENCY INTERPRETATION = ", consistency_interpretation)


################## Heuristics x Usability Score x Weights ##################
    
    
    #print("\n\n", caminho_scorepercentage)

    caminho_scorepercentage = [float(valor) for valor in caminho_scorepercentageOBJ]
    #print("\n\n", caminho_scorepercentageOBJ)

    data_heuristics_usability_score_weights = {'Heuristics': heuristicas, 'Usability_Score': caminho_scorepercentage, 'Weights': normalized_weights}
    df_heuristics_usability_score_weights = pd.DataFrame(data_heuristics_usability_score_weights)

    # Definindo a opção de exibição para mostrar todas as colunas
    pd.set_option('display.max_columns', None)

    # Imprimindo o DataFrame
    print("\n\nHeuristics x Usability Score x Weights \n\n", df_heuristics_usability_score_weights)

    # Realizando os cálculos adicionais e imprimindo o DataFrame atualizado
    df_heuristics_usability_score_weights['Relative_Weight'] = df_heuristics_usability_score_weights['Usability_Score'] * df_heuristics_usability_score_weights['Weights']
    print("\n\nHeuristics x Usability Score x Weights x Relative_Weight\n\n", df_heuristics_usability_score_weights)
    
    relative_weight_array = df_heuristics_usability_score_weights['Relative_Weight'].values
    print("\n\nValores de Relative_Weight como um array:", relative_weight_array)


    # final usability score
    usability_total = df_heuristics_usability_score_weights.Relative_Weight.sum()
    print("\n\n",usability_total)

    print("\n\n",df_heuristics_usability_score_weights.Weights.sum())


    response_data = {
        #"decisionmatrix": ahp_df.to_json(),
        "usability_total": usability_total.astype("str"),
        "tabelacompleta": df_heuristics_usability_score_weights.to_json(),
        "relative": relative_weight_array.tolist()
    }

        # Set CORS headers for the main request
    headers = {
        **common_headers,
        'Content-Type': 'application/json',
    }
    return (
        json.dumps(response_data),
        200,
        headers
    )