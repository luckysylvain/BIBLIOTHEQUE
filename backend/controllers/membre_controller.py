from sqlalchemy.orm import sessionmaker, joinedload
from model import engine, Membre
from pydantic import BaseModel
import uuid
from fastapi.responses import JSONResponse
from typing import Optional
from datetime import datetime
from utils.hashing import Hash
from auth.oauth2 import create_access_token, set_cookie
from fastapi import Response 
from sqlalchemy import or_


Session = sessionmaker(bind=engine)
session = Session()


class AddMembreModel(BaseModel):
    fullname: str
    addresse: str
    email: str
    password: str
    admin: int


class LoginModel(BaseModel):
    email: str
    password: str


def get_membre():
    membres = session.query(Membre).all()
    return {"data": membres}


def get_membre_by_id(id: str):
    membre = session.query(Membre).options(joinedload(
        Membre.emprunts)).filter(Membre.id == id).first()
    if not membre:
        return JSONResponse(content={"success": False, "error": "Membre introuvable"}, status_code=400)
    return {"data": membre}


def create_membre(body: AddMembreModel):
    session.rollback()
    date = datetime.now()
    try:
        membre = Membre(
            id=str(uuid.uuid4()),
            fullname=body.fullname,
            addresse=body.addresse,
            email=body.email,
            date_inscription=date,
            dispo=1,
            password=Hash.bcrypt(body.password),
            admin=body.admin

        )
        session.add(membre)
        session.commit()
        return {"success": True}
    except Exception as exc:
        return JSONResponse(content={"success": False, "error": str(exc)}, status_code=500)


def delete_membre(id: str):
    membre = session.query(Membre).filter(Membre.id == id).first()
    if not membre:
        return JSONResponse(content={"success": False, "error": "Membre introuvable"}, status_code=400)
    membre.dispo = 0
    session.commit()
    return JSONResponse(content={"success": True})


def update_membre(id: str):
    membre = session.query(Membre).filter(Membre.id == id).first()
    if not membre:
        return JSONResponse(content={"success": False, "error": "Membre introuvable"}, status_code=400)

    session.commit()
    return JSONResponse(content={"success": True})


def login(body: LoginModel, response: Response):
    email = body.email
    password = body.password
    membre = session.query(Membre).filter(Membre.email == email).with_entities(
        Membre.email, Membre.password, Membre.admin, Membre.id).first()
    if not membre:
        return JSONResponse(content={"success": False, "error": "Email introuvable", "field": "email"}, status_code=400)
    else:
        if Hash.verify(membre.password, password):
            if membre.admin == 0:
                admin = False
            else:
                admin = True
            membre_data = {
                'id': membre.id
            }
            token = create_access_token(data=membre_data)

            response.set_cookie(
                key="jwt",
                value=token,

            )
            return {"token": token, "admin": admin, "membre_id": membre.id, "token_type": 'bearer'}
        return JSONResponse(content={"success": False, "error": "Mot de passe incorrect", "field": "password"}, status_code=400)
