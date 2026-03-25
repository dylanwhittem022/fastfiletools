"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const dropRef = useRef();
  const topAdRef = useRef();
  const bottomAdRef = useRef();

  // Load AdSense script once
  useEffect(() => {
    if (!window.adsbygoogle) {
      const script = document.createElement("script");
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      script.async = true;
      script.setAttribute("data-ad-client", "YOUR-AD-CLIENT-ID"); // Replace
      document.body.appendChild(script);
    }

    // Render ads once elements exist
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {}
  }, []);

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add("dragover");
  };
  const handleDragLeave = () => dropRef.current.classList.remove("dragover");
  const handleDrop = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
    }
  };
  const handleClick = () => document.getElementById("fileInput").click();

  // Upload & process PDF
  const handleUpload = async () => {
    if (!file) return alert("Upload a PDF");

    setLoading(true);
    setProgress(0);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const interval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 5 : p));
    }, 100);

    try {
      const res = await fetch("/api/count", { method: "POST", body: formData });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Failed to process PDF" });
    }

    clearInterval(interval);
    setProgress(100);

    setTimeout(() => {
      setLoading(false);
      setProgress(0);
      // Render bottom ad dynamically after result
      try {
        if (window.adsbygoogle) (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    }, 300);
  };

  return (
    <main>
      <h1>Fast File Tools</h1>
      <p className="subtitle">Count words in your PDF instantly</p>

      {/* Top Ad */}
      <ins ref={topAdRef}
           className="adsbygoogle"
           style={{ display: "block", textAlign: "center", marginBottom: "20px" }}
           data-ad-client="YOUR-AD-CLIENT-ID"
           data-ad-slot="YOUR-AD-SLOT-ID"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>

      <div
        className="card"
        ref={dropRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className={`drop-area ${file ? "dragover" : ""}`}
          onClick={handleClick}
        >
          {file ? file.name : "Drag & drop your PDF here or click to upload"}
        </div>
        <input
          type="file"
          accept="application/pdf"
          id="fileInput"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Processing..." : "Count Words"}
        </button>

        {loading && (
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {result && (
          <>
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

            {/* Bottom Ad */}
            <ins ref={bottomAdRef}
                 className="adsbygoogle"
                 style={{ display: "block", textAlign: "center", marginTop: "20px" }}
                 data-ad-client="YOUR-AD-CLIENT-ID"
                 data-ad-slot="YOUR-AD-SLOT-ID"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </>
        )}
      </div>

      <p className="footer">Fast • Free • No Upload Stored</p>
    </main>
  );
}
