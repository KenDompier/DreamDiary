from pydantic import BaseModel


class Dream(BaseModel):
    id: int
    title: str
    description: str
    mood : str
    vividity: str



class DreamRequest(BaseModel):
    title: str
    description: str
    mood : str
    vividity: str


