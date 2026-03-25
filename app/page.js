"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Upload a PDF");

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/count", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Failed to process PDF" });
    }

    setLoading(false);
  };

  return (
    <main>
      <h1>Fast File Tools</h1>
      <p className="subtitle">Count words in your PDF instantly</p>

      <div className="card">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload}>
          {loading ? "Processing..." : "Count Words"}
        </button>

        {result && (
          <div className="result">
            {result.error ? (
              <p style={{ color: "red" }}>{result.error}</p>
            ) : (
              <>
                <p>
                  <strong>Words:</strong> {result.wordCount}
                </p>
                <p>
                  <strong>Characters:</strong> {result.charCount}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <p className="footer">Fast • Free • No Upload Stored</p>
    </main>
  );
}
