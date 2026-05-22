import os
import shutil

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from automation import run_pimeyes_search

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


# Home Route
@app.get("/")
def home():

    return {
        "status": "Backend Running"
    }


# Search Route
@app.post("/search")
def search_face(file: UploadFile = File(...)):

    try:

        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename
        )

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        results = run_pimeyes_search(
            file_path
        )

        return {
            "success": True,
            "count": len(results),
            "results": results
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }