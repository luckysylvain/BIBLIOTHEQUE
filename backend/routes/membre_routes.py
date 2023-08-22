from controllers.membre_controller import get_membre, get_membre_by_id, login, update_membre, delete_membre, create_membre
from fastapi import APIRouter

membre_router = APIRouter()

membre_router.get('/')(get_membre)
membre_router.post('/')(create_membre)
membre_router.put('/{id}')(update_membre)
membre_router.delete('/{id}')(delete_membre)
membre_router.get('/{id}')(get_membre_by_id)
membre_router.post('/login')(login)
