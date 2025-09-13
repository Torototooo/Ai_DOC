from fastapi import FastAPI, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from typing import List, Dict
import shutil
import datetime
import os
from openai import OpenAI

# ---------- CONFIG ----------
app = FastAPI()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Predefined categories
CATEGORIES = ["Study", "Business", "Entertainment", "HR", "Finance"]

# Ensure base "upload" folder + category folders exist
base_upload_dir = Path("upload")
for category in CATEGORIES:
    (base_upload_dir / category).mkdir(parents=True, exist_ok=True)


# ---- AI Classification ----
def classify_with_ai(filename: str, preview_text: str = "") -> str:
    prompt = f"""
    You are a document classifier. 
    Categories: Study, Business, Entertainment, HR, Finance.
    The document filename is: "{filename}".
    The preview text is: "{preview_text[:500]}".
    Choose the most likely category.
    Respond with only one word from the categories.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=5,
        temperature=0
    )

    category = response.choices[0].message.content.strip()
    if category not in CATEGORIES:
        category = "Business"
    return category


# ---- In-memory DB ----
documents: List[Dict] = []


# ---- Middleware ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- Serve static files ----
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/files", StaticFiles(directory="upload"), name="files")


# ---- Serve frontend ----
@app.get("/", response_class=HTMLResponse)
async def read_index():
    html_path = Path("templates/index.html")
    return html_path.read_text(encoding="utf-8")


# ---- Upload + AI classify ----
@app.post("/upload")
async def upload_document(file: UploadFile):
    temp_path = base_upload_dir / file.filename
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    preview_text = ""
    if temp_path.suffix.lower() == ".txt":
        preview_text = temp_path.read_text(encoding="utf-8", errors="ignore")

    category = classify_with_ai(file.filename, preview_text)

    dest_path = base_upload_dir / category / file.filename
    shutil.move(str(temp_path), str(dest_path))

    doc_info = {
        "title": file.filename,
        "category": category,
        "author": "Unknown",
        "upload_date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "path": f"/files/{category}/{file.filename}",  # link for frontend
        "content": preview_text,                       # searchable content
    }
    documents.append(doc_info)

    return {"message": f"File uploaded and classified as {category}", "document": doc_info}


# ---- Get all documents ----
@app.get("/documents")
async def get_documents():
    return {"documents": documents}


# ---- Search documents ----
@app.get("/search")
async def search_documents(q: str = ""):
    if not q.strip():
        return {"results": documents}

    q_lower = q.lower()
    ranked = []
    for doc in documents:
        # Count in filename
        filename_count = doc["title"].lower().count(q_lower)

        # Count in content (if stored)
        content_count = doc.get("content", "").lower().count(q_lower)

        score = filename_count * 2 + content_count  # weight filenames higher
        if score > 0:
            ranked.append((score, doc))

    # Sort by score, descending
    ranked.sort(key=lambda x: x[0], reverse=True)

    return {"results": [doc for _, doc in ranked]}
