from sqlalchemy import create_engine, Column, Integer, String, Float, Date, ForeignKey, Boolean
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. Configuração do Banco de Dados
db = create_engine('sqlite:///db.sqlite3')
Session = sessionmaker(bind=db)
session = Session()

Base = declarative_base()
# 2. Definição das Tabelas

class Problema(Base):
    __tablename__ = 'Problema'
    idProblema = Column(Integer, primary_key=True)
    Nome_Problema = Column(String(45))
    Data_Criacao = Column(Date)
    objetivo= Column(String(200))

    def __init__(self, nome, data):
        self.Nome_Problema = nome
        self.Data_Criacao = data
        self.objetivo= String


class Variavel_de_Decisao(Base):
    __tablename__ = 'Variavel_de_Decisao'
    idVariavel_de_Decisao = Column(Integer, primary_key=True)
    Nome = Column(String(45))
    Unidade_Medida = Column(String(45))
    Lucro = Column(Float)
    Coeficiente = Column(Float)
    Problema_idProblema = Column(Integer, ForeignKey('Problema.idProblema'))

    def __init__(self, nome, unidademedida, lucro, coeficiente, problema_id):
        self.Nome = nome
        self.Unidade_Medida = unidademedida
        self.Lucro = lucro
        self.Coeficiente = coeficiente
        self.Problema_idProblema = problema_id

class Restricao(Base):
    __tablename__ = 'Restricao'
    idRestricao = Column(Integer, primary_key=True)
    Tipo = Column(String(45))
    Limite = Column(Float)
    Operador = Column(String(5))
    atendida = Column(Boolean, default= False)
    Problema_idProblema = Column(Integer, ForeignKey('Problema.idProblema'))

    def __init__(self, nome, limite, operador, problema_id):
        self.Tipo = nome
        self.Limite = limite
        self.Operador = operador
        self.atendida = False
        self.Problema_idProblema = problema_id

class CoeficienteRestricao(Base):
    __tablename__ = 'CoeficienteRestricao'
    id = Column(Integer, primary_key=True)
    valor = Column(Float, nullable=False)
    variavel_id = Column(Integer, ForeignKey('Variavel_de_Decisao.idVariavel_de_Decisao'))
    restricao_id = Column(Integer, ForeignKey('Restricao.idRestricao'))

    def __init__(self, valor, variavel_id, restricao_id):
        self.valor = valor
        self.variavel_id = variavel_id
        self.restricao_id = restricao_id

class Resultados(Base):
    __tablename__ = 'Resultados'
    idResultados = Column(Integer, primary_key=True)
    Lucro_maximo = Column(Float)
    Quantidade_Otima = Column(Float)
    resolvido = Column(Boolean)
    status = Column(String(100))

    Problema_idProblema = Column(Integer, ForeignKey('Problema.idProblema'))

    def __init__(self, lucro_maximo, quantidade_otima, restricoes_respeitadas, problema_id):
        self.Lucro_maximo = lucro_maximo
        self.Quantidade_Otima = quantidade_otima
        self.resolvido = False
        self.status = "Possui resposta otima"
        self.Problema_idProblema = problema_id

Base.metadata.create_all(db)
