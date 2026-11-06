import pulp


def resolver_problema(problema, variaveis, restricoes):
    # Define se o problema é max ou min
    sentido = pulp.LpMaximize if problema["objetivo"] == "maximize" else pulp.LpMinimize
    # Criação do problema
    modelo = pulp.LpProblem(name=problema["nome"], sense=sentido)

    # Cria a variável pulp para cada variável recebida, já adiciona a restrição de não negatividade ""lowBound=0"
    vars_pulp = {
        var["id"]: pulp.LpVariable(name=var["nome"], lowBound=0, cat="Continuous")
        for var in variaveis
    }

    # Adiciona a função objetivo
    modelo += pulp.lpSum(
        var["coeficiente_objetivo"] * vars_pulp[var["id"]]
        for var in variaveis
    )

    # Para cada restrição, monta a expressão do lado esquerdo, multiplica coeficiente × variável PuLP
    for restricao in restricoes:
        expressao = pulp.lpSum(
            coef["valor"] * vars_pulp[coef["variavel_id"]]
            for coef in restricao["coeficientes"]
        )

        if restricao["operador"] == "<=":
            modelo += expressao <= restricao["limite"], restricao["nome"]
        elif restricao["operador"] == ">=":
            modelo += expressao >= restricao["limite"], restricao["nome"]
        else:
            modelo += expressao == restricao["limite"], restricao["nome"]

    # Resolve o problema montado
    modelo.solve(pulp.PULP_CBC_CMD(msg=0))

    # Salva o status
    status = pulp.LpStatus[modelo.status]

    # Caso não der um resultado ótimo, ele devolve um objeto vazio
    if status != "Optimal":
        return {"status": status, "valor_objetivo": None, "variaveis": {}}

    return {
        "status": status,
        "valor_objetivo": pulp.value(modelo.objective),
        "variaveis": {
            var["nome"]: pulp.value(vars_pulp[var["id"]])
            for var in variaveis
        },
    }
