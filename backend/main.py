from fastapi import FastAPI
from fastapi.routing import APIRouter
from routes.livre_routes import livre_router
from routes.membre_routes import membre_router
# from routes.emprunt_routes import emprunt_router
from fastapi.middleware.cors import CORSMiddleware
from routes.upload_route import upload_router
from fastapi.staticfiles import StaticFiles
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:5174",
    # Add your frontend URLs or "*" to allow all origins
]


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(membre_router, prefix="/membre")
app.include_router(livre_router, prefix="/livre")
# app.include_router(emprunt_router, prefix="/emprunt")
app.include_router(upload_router, prefix="/upload")

app.mount('/uploads', StaticFiles(directory='uploads'), name="uploads")


@app.get("/")
def home():
    return {"message": "Bienvenue sur la page d'accueil de FastAPI"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
