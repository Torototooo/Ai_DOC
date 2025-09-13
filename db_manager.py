import sqlite3
import argparse

DATABASE_FILE = "documents.db"

def view_documents():
    """Views all documents in the database."""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM documents")
    rows = cursor.fetchall()
    if not rows:
        print("No documents found.")
        return
    for row in rows:
        print(row)
    conn.close()

def delete_document(doc_id):
    """Deletes a document from the database by its ID."""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
    conn.commit()
    print(f"Document with ID {doc_id} deleted.")
    conn.close()

def clear_documents():
    """Deletes all documents from the database."""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM documents")
    conn.commit()
    print("All documents deleted.")
    conn.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Manage the documents database.")
    parser.add_argument("--view", action="store_true", help="View all documents.")
    parser.add_argument("--delete", type=int, help="Delete a document by its ID.")
    parser.add_argument("--clear", action="store_true", help="Delete all documents.")
    args = parser.parse_args()

    if args.view:
        view_documents()
    elif args.delete:
        delete_document(args.delete)
    elif args.clear:
        clear_documents()
    else:
        parser.print_help()