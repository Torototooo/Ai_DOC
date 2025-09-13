const API_BASE = "http://127.0.0.1:8000";

// ---------- Upload Handler ----------
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("fileInput");
  const categorySelect = document.getElementById("categorySelect");

  if (!fileInput.files.length) {
    alert("❌ Please select a file.");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("category", categorySelect.value);

  try {
    const res = await fetch(`${API_BASE}/upload/`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert(`✅ File uploaded: ${data.title} [${data.category}]`);
      fileInput.value = "";
      categorySelect.value = "";
      loadDocuments(); // Refresh list
    } else {
      alert("❌ Upload failed: " + (data.error || JSON.stringify(data)));
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("❌ Upload error, check console.");
  }
});

// ---------- Search Handler ----------
document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = document.getElementById("searchInput").value.trim();
  if (!query) {
    loadDocuments(); // If empty, load all
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/search/?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Search failed");
    const docs = await res.json();
    renderDocs(docs);
  } catch (err) {
    console.error("Search error:", err);
    alert("❌ Search failed. Check console.");
  }
});

// ---------- Load All Documents ----------
async function loadDocuments() {
  try {
    const res = await fetch(`${API_BASE}/documents/`);
    if (!res.ok) throw new Error("Failed to fetch documents");
    const docs = await res.json();
    renderDocs(docs);
  } catch (err) {
    console.error("Load error:", err);
    alert("❌ Could not load documents.");
  }
}

// ---------- Render List ----------
function renderDocs(docs) {
  const list = document.getElementById("docList"); // Make sure your HTML has <ul id="docList"></ul>
  list.innerHTML = "";

  if (!docs.length) {
    list.innerHTML = "<li>No documents found.</li>";
    return;
  }

  docs.forEach((d) => {
    const li = document.createElement("li");
    li.textContent = `${d.title} [${d.category}] — ${d.author} (${d.upload_date})`;
    list.appendChild(li);
  });
}

// ---------- Auto-load on startup ----------
loadDocuments();
