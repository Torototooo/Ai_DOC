document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const searchForm = document.getElementById("searchForm");
  const documentList = document.getElementById("documentList");
  const uploadResult = document.getElementById("uploadResult");
  const searchInput = document.getElementById("searchInput");
  const searchSection = document.getElementById("searchSection");
  const searchResults = document.getElementById("searchResults");

  // Fetch all documents on page load
  fetchDocuments();

  // ----- Upload File -----
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("fileInput");
    const categorySelect = document.getElementById("categorySelect");
    
    if (!fileInput.files.length) {
      alert("Please select a file to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("category", categorySelect.value);

    try {
      const res = await fetch("/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (res.ok) {
        uploadResult.innerText = `✅ Uploaded: ${fileInput.files[0].name} | Category: ${data.document.category}`;
        fileInput.value = "";
        fetchDocuments();
      } else {
        uploadResult.innerText = `❌ Upload failed: ${data.error || "Unknown error"}`;
      }
    } catch (err) {
      uploadResult.innerText = `❌ Upload error: ${err.message}`;
    }
  });

  // ----- Search Documents -----
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    try {
      const res = await fetch(`/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      // Clear old results
      searchResults.innerHTML = "";

      if (data.results.length > 0) {
        searchSection.classList.remove("hidden");
        data.results.forEach((doc, i) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td class="border px-4 py-2">${i + 1}</td>
            <td class="border px-4 py-2"><a href="${doc.path}" target="_blank" class="text-blue-600 underline">${doc.title}</a></td>
            <td class="border px-4 py-2">${doc.category}</td>
            <td class="border px-4 py-2">${doc.upload_date}</td>
          `;
          searchResults.appendChild(tr);
        });
      } else {
        searchSection.classList.remove("hidden");
        searchResults.innerHTML = `<tr><td colspan="4" class="px-4 py-2 text-gray-500">No documents found</td></tr>`;
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
  });

  // ----- Fetch Documents -----
  async function fetchDocuments() {
    try {
      const res = await fetch("/documents");
      const data = await res.json();

      documentList.innerHTML = "";
      data.documents.forEach((doc) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="border px-4 py-2"><a href="${doc.path}" target="_blank" class="text-blue-600 underline">${doc.title}</a></td>
          <td class="border px-4 py-2">${doc.category}</td>
          <td class="border px-4 py-2">${doc.author}</td>
          <td class="border px-4 py-2">${doc.upload_date}</td>
        `;
        documentList.appendChild(tr);
      });
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  }
});
