-> AI Document Classifier

An AI-powered document management system built with FastAPI (backend)
and a modern HTML/CSS/JS (frontend).
It allows users to upload, classify, and search documents using NLP
models.

------------------------------------------------------------------------

-> Features

-   Upload documents (PDF, DOCX, TXT).
-   Automatic classification into categories (Finance, HR, Legal, etc.).
-   Full-text search using embeddings.
-   View uploaded documents in a table with metadata.
-   Simple, responsive UI with TailwindCSS.

------------------------------------------------------------------------

-> Tech Stack

Backend

-   FastAPI – API framework
-   Uvicorn – ASGI server
-   SQLAlchemy – ORM for database
-   [SQLite] (default, can be changed) – Database
-   PyPDF2 – PDF parsing
-   python-docx – DOCX parsing
-   spaCy & Sentence-Transformers – NLP for embeddings
-   FAISS – Vector search

Frontend

-   HTML, CSS, JavaScript
-   TailwindCSS for styling

------------------------------------------------------------------------

--> Installation

1. Clone the repository

    git clone https://github.com/your-username/ai-doc-classifier.git
    cd ai-doc-classifier

2. Create and activate a virtual environment

    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate

3. Install dependencies

    pip install fastapi uvicorn python-multipart sqlalchemy PyPDF2 python-docx scikit-learn numpy spacy sentence-transformers faiss-cpu

4. Run the backend server

    uvicorn main:app --reload

5.  Open frontend

Open index.html in your browser.

------------------------------------------------------------------------

--> Project Structure

    ai-doc-classifier/
    │── main.py            # FastAPI backend
    │── models.py          # Database models
    │── static/
    │   ├── style.css      # Stylesheet
    │   ├── app.js         # Frontend logic
    │── templates/
    │   └── index.html     # Frontend UI
    │── README.md

------------------------------------------------------------------------

--> Future Improvements

-   User authentication system
-   Cloud storage (S3, GCS, etc.)
-   Advanced AI-based classification
-   Document preview in browser

------------------------------------------------------------------------

Developed by Visionarrow
