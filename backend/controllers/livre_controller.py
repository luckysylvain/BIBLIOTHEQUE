from sqlalchemy.orm import sessionmaker, joinedload
from model import engine, Livre
from pydantic import BaseModel
import uuid
from fastapi.responses import JSONResponse
from typing import Optional
from datetime import datetime
from sqlalchemy import or_
import asyncio


Session = sessionmaker(bind=engine)
session = Session()


class AddLivreModel(BaseModel):
    titre: str
    auteur: str
    genre: str
    date_publication: str
    pages: int
    image: str


def get_livres():
    livres = session.query(Livre).all()
    return {"data": livres}


def get_livre_by_id(id: str):
    livre = session.query(Livre).options(joinedload(
        Livre.emprunts)).filter(Livre.id == id).first()
    if not livre:
        return JSONResponse(content={"success": False, "error": "Livre introuvable"}, status_code=400)
    return {"data": livre}


async def create_livre(body: AddLivreModel):
    session.rollback()
    
    date = body.date_publication
    date_obj = datetime.strptime(date, '%Y%m%dT%H:%M%z')
    formatted_date = date_obj.strftime('%Y-%m-%d %H:%M:%S')
    try:
        livre = Livre(
            id=str(uuid.uuid4()),
            titre=body.titre,
            auteur=body.auteur,
            genre=body.genre,
            date_publication=formatted_date,
            pages=int(body.pages),
            dispo=1,
            image=body.image

        )
        session.add(livre)
        session.commit()
        await asyncio.sleep(2)
        return {"success": True}
    except Exception as exc:
        return JSONResponse(content={"success": False, "error": str(exc)}, status_code=500)


async def update_livre(body: AddLivreModel, id: str):
    session.rollback()
    date = body.date_publication
    date_obj = datetime.strptime(date, '%Y%m%dT%H:%M%z')
    formatted_date = date_obj.strftime('%Y-%m-%d %H:%M:%S')
    livre = session.query(Livre).filter(Livre.id == id).first()
    if not livre:
        return JSONResponse(content={"success": False, "error": "Livre introuvable"}, status_code=400)

    livre.titre = body.titre
    livre.auteur = body.auteur
    livre.genre = body.genre
    livre.date_publication = formatted_date
    livre.pages = int(body.pages)
    livre.image = body.image
    session.commit()
    await asyncio.sleep(2)
    return JSONResponse(content={"success": True})


async def delete_livre(id: str):
    session.rollback()
    
    livre = session.query(Livre).filter(Livre.id == id).first()
    if not livre:
        return JSONResponse(content={"success": False, "error": "Livre introuvable"}, status_code=400)
    session.delete(livre)
    session.commit()
    await asyncio.sleep(2)
    return JSONResponse(content={"success": True})
