import os
import shutil
from fastapi import FastAPI, UploadFile, File

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/search")
async def search_face(file: UploadFile = File(...)):

    try:

        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        results = run_pimeyes_search(file_path)

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