from controllers.livre_controller import  get_livre_by_id, update_livre, delete_livre, create_livre, get_livres
from fastapi import APIRouter

livre_router = APIRouter()

livre_router.get('/')(get_livres)
livre_router.post('/')(create_livre)
livre_router.put('/{id}')(update_livre)
livre_router.delete('/{id}')(delete_livre)
livre_router.get('/{id}')(get_livre_by_id)

