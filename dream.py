from fastapi import APIRouter, Path, HTTPException, status
from model import Dream, DreamRequest
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

dream_router = APIRouter()

dream_list = []
max_id: int = 0


@dream_router.post("/dreams", status_code=status.HTTP_201_CREATED)
async def add_dream(dream: DreamRequest) -> dict:
    global max_id
    max_id += 1  # auto increment ID

    newDream = Dream(id=max_id, title=dream.title, description=dream.description, mood=dream.mood, vividity=dream.vividity)
    dream_list.append(newDream)
    json_compatible_item_data = newDream.model_dump()
    return JSONResponse(json_compatible_item_data, status_code=status.HTTP_201_CREATED)


@dream_router.get("/dreams")
async def get_dreams() -> dict:
    json_compatible_item_data = jsonable_encoder(dream_list)
    return JSONResponse(content=json_compatible_item_data)


@dream_router.get("/dreams/{id}")
async def get_dream_by_id(id: int = Path(..., title="default")) -> dict:
    for dream in dream_list:
        if dream.id == id:
            return {"dream": dream}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"The dream with ID={id} is not found.",
    )


@dream_router.put("/dreams/{id}")
async def update_dream(dream: DreamRequest, id: int) -> dict:
    for x in dream_list:
        if x.id == id:
            x.title = dream.title
            x.description = dream.description
            x.mood = dream.mood
            x.vividity = dream.vividity
            return {"message": "Dream updated successfully"}

    return {"message": f"The dream with ID={id} is not found."}


@dream_router.delete("/dreams/{id}")
async def delete_dream(id: int) -> dict:
    for i in range(len(dream_list)):
        dream = dream_list[i]
        if dream.id == id:
            dream_list.pop(i)
            return {"message": f"The dream with ID={id} has been deleted."}

    return {"message": f"The dream with ID={id} is not found."}
