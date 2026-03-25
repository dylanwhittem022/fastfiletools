"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Upload a PDF");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/count", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Fast File Tools</h1>
      <h2>PDF Word Counter</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        {loading ? "Processing..." : "Count Words"}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Words:</strong> {result.wordCount}</p>
          <p><strong>Characters:</strong> {result.charCount}</p>
        </div>
      )}
    </main>
  );
}
