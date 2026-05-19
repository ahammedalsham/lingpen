from fastapi import FastAPI

from api.health import router as health_router

app = FastAPI(title="LingPen API")

# Include the health check router you uploaded
app.include_router(health_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the LingPen API"}
