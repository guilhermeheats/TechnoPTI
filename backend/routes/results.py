from flask import Blueprint, jsonify, request
from solver import resolver_problema
from database import session
from models import Problema, Variavel_de_Decisao, Restricao, CoeficienteRestricao, Resultados
from datetime import date


# Cria o blueprint em vez de usar o app diretamente
result_bp = Blueprint("results", __name__)

# ROTAS PARA A SOLUÇÃO DOS PROBLEMAS

# ROTA PARA A RESOLUÇÃO DO PROBLEMA
# usa o blueprint no lugar do @result_bp.route
@result_bp.route("/problems/<int:id>/solve", methods=["POST"])
def resolver(id):
    problema = session.query(Problema).filter_by(idProblema=id).first()
    if not problema:
        return jsonify({"erro": "Problema não encontrado"}), 404

    variaveis = session.query(Variavel_de_Decisao).filter_by(Problema_idProblema=id).order_by(Variavel_de_Decisao.idVariavel_de_Decisao).all()
    restricoes = session.query(Restricao).filter_by(Problema_idProblema=id).all()

    if not variaveis:
        return jsonify({"erro": "O problema não possui variáveis de decisão"}), 400
    if not restricoes:
        return jsonify({"erro": "O problema não possui restrições"}), 400

    # Monta estrutura para o solver
    vars_dict = [
        {
            "id": v.idVariavel_de_Decisao,
            "nome": v.Nome,
            "coeficiente_objetivo": v.Coeficiente,
        }
        for v in variaveis
    ]
    cons_dict = [
        {
            "id": r.idRestricao,
            "nome": r.Tipo,
            "operador": r.Operador,
            "limite": r.Limite,
            "coeficientes": [
                {"variavel_id": c.variavel_id, "valor": c.valor}
                for c in session.query(CoeficienteRestricao).filter_by(restricao_id=r.idRestricao).all()
            ],
        }
        for r in restricoes
    ]
    problema_dict = {"nome": problema.Nome_Problema, "objetivo": problema.objetivo}

    # Resolve o problema
    resultado = resolver_problema(problema_dict, vars_dict, cons_dict)

    # Calcula status de cada restrição e faz UPDATE
    qtds = resultado.get("variaveis", {})
    restricoes_resultado = []
    for r, c in zip(restricoes, cons_dict):
        uso = sum(
            coef["valor"] * qtds.get(
                next((v["nome"] for v in vars_dict if v["id"] == coef["variavel_id"]), ""), 0
            )
            for coef in c["coeficientes"]
        )
        if c["operador"] == "<=":
            atendida = uso <= c["limite"]
        elif c["operador"] == ">=":
            atendida = uso >= c["limite"]
        else:
            atendida = round(uso, 4) == round(c["limite"], 4)

        # UPDATE na restrição
        r.atendida = atendida

        restricoes_resultado.append({
            "id": c["id"],
            "nome": c["nome"],
            "operador": c["operador"],
            "limite": c["limite"],
            "uso": round(uso, 4),
            "folga": round((c["limite"]) - uso, 4),
            "atendida": atendida,
        })

    # UPDATE no lucro de cada variável
    for v_obj, v_dict in zip(variaveis, vars_dict):
        quantidade = qtds.get(v_dict["nome"], 0)
        v_obj.Lucro = round(quantidade * v_dict["coeficiente_objetivo"], 4)

    # Salva o resultado
    resultado_db = Resultados(
        status=resultado["status"],
        Quantidade_Otima=resultado.get("valor_objetivo"),
        problema_id=id,
    )
    session.add(resultado_db)

    # Marca problema como resolvido
    problema.resolvido = True
    session.commit()

    resultado["restricoes"] = restricoes_resultado
    return jsonify(resultado)


# ROTA PARA MOSTRAR O RESULTADO DO PROBLEMA RESOLVIDO
@result_bp.route("/problems/<int:id>/result", methods=["GET"])
def ultimo_resultado(id):
    problema = session.query(Problema).filter_by(idProblema=id).first()
    if not problema:
        return jsonify({"erro": "Problema não encontrado"}), 404

    resultado = session.query(Resultados).filter_by(Problema_idProblema=id).order_by(Resultados.idResultados.desc()).first()
    if not resultado:
        return jsonify({"mensagem": "Nenhum resultado encontrado"}), 404

    variaveis = session.query(Variavel_de_Decisao).filter_by(Problema_idProblema=id).all()
    restricoes = session.query(Restricao).filter_by(Problema_idProblema=id).all()

    restricoes_resultado = []
    for r in restricoes:
        coeficientes = session.query(CoeficienteRestricao).filter_by(restricao_id=r.idRestricao).all()
        uso = sum(
            coef.valor * (
                next(
                    (v.Lucro / v.Coeficiente for v in variaveis if v.idVariavel_de_Decisao == coef.variavel_id and v.Coeficiente),
                    0
                )
            )
            for coef in coeficientes
        )
        restricoes_resultado.append({
            "id": r.idRestricao,
            "nome": r.Tipo,
            "operador": r.Operador,
            "limite": r.Limite,
            "uso": round(uso, 4),
            "folga": round(r.Limite - uso, 4),
            "atendida": r.atendida,
        })

    return jsonify({
        "status": resultado.status,
        "valor_objetivo": resultado.Quantidade_Otima,
        "variaveis": {v.Nome: v.Lucro / v.Coeficiente if v.Coeficiente else 0 for v in variaveis},
        "restricoes": restricoes_resultado,
    })
