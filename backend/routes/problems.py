from flask import Blueprint, jsonify, request
from database import session
from models import Problema, Variavel_de_Decisao, Restricao, CoeficienteRestricao, Resultados
from datetime import date


# Cria o blueprint em vez de usar o app diretamente
problems_bp = Blueprint("problems", __name__)

# ROTAS PARA OS PROBLEMAS

# ROTA PARA LISTAR TODOS OS PROBLEMAS
# usa o blueprint no lugar do @app.route
@problems_bp.route("/problems", methods=["GET"])
def listar_problemas():
    problemas = session.query(Problema).all()
    return jsonify([
        {
            "id": p.idProblema,
            "nome": p.Nome_Problema,
            "objetivo": p.objetivo,
            "resolvido": p.resolvido,
            "data_criacao": str(p.Data_Criacao),
        }
        for p in problemas
    ])


# ROTA PARA LISTAR AS INFORMAÇÕES DETALHADAS DE UM PROBLEMA
@problems_bp.route("/problems/<int:id>", methods=["GET"])
def detalhar_problema(id):
    problema = session.query(Problema).filter_by(idProblema=id).first()
    if not problema:
        return jsonify({"erro": "Problema não encontrado"}), 404

    variaveis = session.query(Variavel_de_Decisao).filter_by(Problema_idProblema=id).all()
    restricoes = session.query(Restricao).filter_by(Problema_idProblema=id).all()

    return jsonify({
        "id": problema.idProblema,
        "nome": problema.Nome_Problema,
        "objetivo": problema.objetivo,
        "resolvido": problema.resolvido,
        "data_criacao": str(problema.Data_Criacao),
        "variaveis": [
            {
                "id": v.idVariavel_de_Decisao,
                "nome": v.Nome,
                "coeficiente_objetivo": v.Coeficiente,
                "unidade_medida": v.Unidade_Medida,
                "lucro": v.Lucro,
            }
            for v in variaveis
        ],
        "restricoes": [
            {
                "id": r.idRestricao,
                "nome": r.Tipo,
                "operador": r.Operador,
                "limite": r.Limite,
                "atendida": r.atendida,
                "coeficientes": [
                    {"variavel_id": c.variavel_id, "valor": c.valor}
                    for c in session.query(CoeficienteRestricao).filter_by(restricao_id=r.idRestricao).all()
                ],
            }
            for r in restricoes
        ],
    })


# ROTA PARA A CRIAÇÃO DO PROBLEMA
@problems_bp.route("/problems/create", methods=["POST"])
def criar_problema_completo():
    data = request.get_json()

    for campo in ["nome", "objetivo", "variaveis", "restricoes"]:
        if campo not in data:
            return jsonify({"erro": f"Campo '{campo}' é obrigatório"}), 400

    if data["objetivo"] not in ("maximize", "minimize"):
        return jsonify({"erro": "Objetivo deve ser 'maximize' ou 'minimize'"}), 400

    if not data["variaveis"]:
        return jsonify({"erro": "Informe ao menos uma variável"}), 400

    if not data["restricoes"]:
        return jsonify({"erro": "Informe ao menos uma restrição"}), 400

    # cria o problema
    problema = Problema(nome=data["nome"], data=date.today())
    problema.objetivo = data["objetivo"]
    problema.resolvido = False
    session.add(problema)
    session.flush()

    # cria as variáveis
    vars_criadas = []
    for v in data["variaveis"]:
        for campo in ["nome", "coeficiente_objetivo"]:
            if campo not in v:
                session.rollback()
                return jsonify({"erro": f"Variável: campo '{campo}' é obrigatório"}), 400
        variavel = Variavel_de_Decisao(
            nome=v["nome"],
            unidademedida=v.get("unidade_medida", ""),
            lucro=0.0,
            coeficiente=v["coeficiente_objetivo"],
            problema_id=problema.idProblema,
        )
        session.add(variavel)
        session.flush()
        vars_criadas.append(variavel)

    # cria as restrições
    cons_criadas = []
    for i, c in enumerate(data["restricoes"]):
        for campo in ["nome", "operador", "limite", "coeficientes"]:
            if campo not in c:
                session.rollback()
                return jsonify({"erro": f"Restrição {i+1}: campo '{campo}' é obrigatório"}), 400
        if c["operador"] not in ("<=", ">=", "="):
            session.rollback()
            return jsonify({"erro": f"Restrição {i+1}: operador deve ser '<=', '>=' ou '='"}), 400
        if len(c["coeficientes"]) != len(vars_criadas):
            session.rollback()
            return jsonify({
                "erro": f"Restrição '{c['nome']}': esperado {len(vars_criadas)} coeficientes, recebido {len(c['coeficientes'])}"
            }), 400

        restricao = Restricao(
            nome=c["nome"],
            limite=c["limite"],
            operador=c["operador"],
            problema_id=problema.idProblema,
        )
        session.add(restricao)
        session.flush()

        # cria os coeficientes da restrição
        for j, variavel in enumerate(vars_criadas):
            coef = CoeficienteRestricao(
                valor=c["coeficientes"][j],
                variavel_id=variavel.idVariavel_de_Decisao,
                restricao_id=restricao.idRestricao,
            )
            session.add(coef)

        cons_criadas.append(restricao)

    session.commit()

    return jsonify({
        "id": problema.idProblema,
        "nome": problema.Nome_Problema,
        "objetivo": problema.objetivo,
        "resolvido": problema.resolvido,
        "data_criacao": str(problema.Data_Criacao),
        "variaveis": [
            {
                "id": v.idVariavel_de_Decisao,
                "nome": v.Nome,
                "coeficiente_objetivo": v.Coeficiente,
                "unidade_medida": v.Unidade_Medida,
                "lucro": v.Lucro,
            }
            for v in vars_criadas
        ],
        "restricoes": [
            {
                "id": r.idRestricao,
                "nome": r.Tipo,
                "operador": r.Operador,
                "limite": r.Limite,
                "atendida": r.atendida,
                "coeficientes": [
                    {"variavel_id": c.variavel_id, "valor": c.valor}
                    for c in session.query(CoeficienteRestricao).filter_by(restricao_id=r.idRestricao).all()
                ],
            }
            for r in cons_criadas
        ],
    }), 201


# ROTA PARA DELETAR PROBLEMA
@problems_bp.route("/problems/<int:id>", methods=["DELETE"])
def deletar_problema(id):
    problema = session.query(Problema).filter_by(idProblema=id).first()
    if not problema:
        return jsonify({"erro": "Problema não encontrado"}), 404

    # deleta em cascata manualmente
    variaveis = session.query(Variavel_de_Decisao).filter_by(Problema_idProblema=id).all()
    restricoes = session.query(Restricao).filter_by(Problema_idProblema=id).all()

    for r in restricoes:
        session.query(CoeficienteRestricao).filter_by(restricao_id=r.idRestricao).delete()
    for r in restricoes:
        session.delete(r)
    for v in variaveis:
        session.delete(v)

    session.query(Resultados).filter_by(Problema_idProblema=id).delete()
    session.delete(problema)
    session.commit()

    return jsonify({"mensagem": "Problema removido com sucesso"})
