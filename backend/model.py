from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine



server = 'LETOTOMANOELA\SQLEXPRESS'
database = 'bibliotheque'
driver='ODBC Driver 17 for SQL Server'
username = 'letoto'
password = 'letoto'


DATABASE_URL = f"mssql://{username}:{password}@{server}/{database}?driver={driver}"

engine = create_engine(DATABASE_URL)


Base = declarative_base()

# Define your model classes
class Livre(Base):
    __tablename__ = 'livre'
    id = Column(String(50), primary_key=True)
    titre = Column(String(255))
    auteur = Column(String(255))
    genre = Column(String(255))
    date_publication = Column(DateTime)
    pages = Column(Integer)
    dispo = Column(Integer)
    image = Column(String(255))
    
    emprunts = relationship('Emprunt', back_populates='livre', overlaps='livre')
    
class Membre(Base):
    __tablename__ = 'membre'
    id = Column(String(50), primary_key=True)
    fullname = Column(String(255))
    addresse = Column(String(255))
    email = Column(String(255), unique=True)
    date_inscription = Column(DateTime)
    dispo = Column(Integer)
    password = Column(String(255))
    admin = Column(Integer)
    
    emprunts = relationship('Emprunt', back_populates='membre', overlaps='membre')
    
class Emprunt(Base):
    __tablename__ = 'emprunt'
    id = Column(String(50), primary_key=True)
    date_emprunt = Column(DateTime)
    date_retour_prevue = Column(DateTime)
    date_retour_real = Column(DateTime)
    idLivre =  Column(String(50), ForeignKey('livre.id'))
    idMembre = Column(String(50), ForeignKey('membre.id'))
    
    membre = relationship('Membre', back_populates='emprunts', overlaps='emprunts')
    livre = relationship('Livre', back_populates='emprunts', overlaps='emprunts')
    
if __name__ == '__main__':
    #Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
