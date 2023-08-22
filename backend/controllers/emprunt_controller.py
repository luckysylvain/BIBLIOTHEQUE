from sqlalchemy.orm import sessionmaker, joinedload
from model import engine, Livre, Emprunt
from pydantic import BaseModel
import uuid
from fastapi.responses import JSONResponse
from typing import Optional
from datetime import datetime
from sqlalchemy import or_
import asyncio

Session = sessionmaker(bind=engine)
session = Session()

class AddEmprunt(BaseModel):
    date_emprunt: str
    date_retour_prevue: str
    date_retour_real: str
    idLivre: str
    idMembre: str
    

def get_emprunts():
    session.rollback()
    emprunts = session.query(Emprunt).all()
    return {'data': emprunts}

def create_emprunt(body:AddEmprunt):
    session.rollback()
    date_obj = datetime.strptime(body.date_emprunt, '%Y%m%dT%H:%M%z')
    date_emprunt = date_obj.strftime('%Y-%m-%d %H:%M:%S')
    date_obj = datetime.strptime(body.date_retour_real, '%Y%m%dT%H:%M%z')
    date_retour_real = date_obj.strftime('%Y-%m-%d %H:%M:%S')
    date_obj = datetime.strptime(body.date_retour_prevue, '%Y%m%dT%H:%M%z')
    date_retour_prevue = date_obj.strftime('%Y-%m-%d %H:%M:%S')
    
    try:
        emprunt = Emprunt(
            id=str(uuid.uuid4()),
            date_emprunt=date_emprunt,
            date_retour_real=date_retour_real,
            date_retour_prevue=date_retour_prevue,
            idLivre=body.idLivre,
            idMembre=body.idMembre,
        )
        livre = session.query(Livre).filter(Livre.id == id).first()
        if not livre:
            return JSONResponse(content={"success": False, "error": "Livre introuvable"}, status_code=400)

        session.add(emprunt)
        livre.dispo = 0
        session.commit()
        return {"success":True}
    except Exception as exc:
        return JSONResponse(content={"success": False, "error": str(exc)}, status_code=500)
    

    