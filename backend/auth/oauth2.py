from fastapi.security import OAuth2PasswordBearer
from fastapi import Response
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt





oauth2_schema = OAuth2PasswordBearer(tokenUrl='token')
SECRET_KEY = '77407c7339a6c00544e51af1101c4abb4aea2a31157ca5f7dfd87da02a628107'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60*24*30

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None,):
  print()
  to_encode = data.copy()
  if expires_delta:
    expire = datetime.utcnow() + expires_delta
  else:
    expire = datetime.utcnow() + timedelta(minutes=15)
  to_encode.update({"exp": expire})
  encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
  
  
  
  
  return encoded_jwt

def set_cookie(response: Response, cookie:str):
    response.set_cookie(
        key="jwt",
        value=cookie,
        httponly=True  # Set the httponly option to True
    )