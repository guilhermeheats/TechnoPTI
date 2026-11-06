from main import session, Problema, Variavel_de_Decisao, Restricao, CoeficienteRestricao, Resultados
from datetime import date

print("Iniciando o teste completo do banco de dados (COM OS INITS)...\n")

try:
    # 1. Tabela Problema
    novo_problema = Problema(nome="Fábrica de Móveis", data=date.today())
    session.add(novo_problema)
    session.commit()
    id_prob = novo_problema.idProblema
    print(f"✅ Problema criado! (ID: {id_prob})")

    # 2. Tabela Variavel_de_Decisao
    nova_variavel = Variavel_de_Decisao(
        nome="Cadeira",  # AJUSTADO PARA 'nome'
        unidademedida="Unidade",
        lucro=50.0,
        coeficiente=1.0,
        problema_id=id_prob
    )
    session.add(nova_variavel)
    session.commit()
    id_var = nova_variavel.idVariavel_de_Decisao
    print(f"✅ Variável de Decisão criada! (ID: {id_var})")

    # 3. Tabela Restricao
    nova_restricao = Restricao(
        nome="Madeira",  # AJUSTADO PARA 'nome'
        limite=100.0,
        operador="<=",
        problema_id=id_prob
    )
    session.add(nova_restricao)
    session.commit()
    id_rest = nova_restricao.idRestricao
    print(f"✅ Restrição criada! (ID: {id_rest})")

    # 4. Tabela CoeficienteRestricao
    novo_coeficiente = CoeficienteRestricao(
        valor=2.0,
        variavel_id=id_var,
        restricao_id=id_rest
    )
    session.add(novo_coeficiente)
    session.commit()
    print("✅ Coeficiente de Restrição criado e conectado com sucesso!")

    # 5. Tabela Resultados
    novo_resultado = Resultados(
        lucro_maximo=1500.0,
        quantidade_otima=30.0,
        restricoes_respeitadas=True,
        problema_id=id_prob
    )
    session.add(novo_resultado)
    session.commit()
    print("✅ Resultado salvo com sucesso!")

    print("\n🎉 TESTE CONCLUÍDO! Todas as tabelas e os inits estão funcionando perfeitamente.")

except Exception as e:
    print(f"\n❌ Ops! Ocorreu um erro no teste: {e}")
