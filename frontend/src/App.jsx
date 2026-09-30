
import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0] || null);
    setReport(null);
    setMessage("");
  };

  const handleAnalyze = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setReport(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:8000/api/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setReport(data);
      setMessage("Static analysis completed.");
    } catch (error) {
      setMessage(
        error.message === "Failed to fetch"
          ? "Cannot connect to the backend. Check that Node.js is running."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024)
      return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">T</div>
          <div>
            <h2>TrustNoFile</h2>
            <span>File Intelligence</span>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>
        <div className="nav-item active">
          <span>▦</span> Analyze File
        </div>
        <div className="nav-item">
          <span>◷</span> Analysis History
        </div>
        <div className="nav-item">
          <span>⚙</span> Settings
        </div>

        <div className="sidebar-bottom">
          <div className="status-dot" />
          <span>Local analysis server</span>
          <small>Prototype</small>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace / </span>
            <strong>Analyze File</strong>
          </div>
          <div className="top-tag">STATIC ANALYSIS</div>
        </header>

        <section className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">FILE SECURITY WORKSPACE</div>
              <h1>Analyze a file</h1>
              <p>
                Inspect file characteristics and collect security
                evidence before deeper investigation.
              </p>
            </div>
            <div className="heading-icon">⌕</div>
          </div>

          <div className="notice">
            <span className="notice-icon">i</span>
            <p>
              Files are inspected statically. This prototype does
              not execute uploaded files.
            </p>
          </div>

          <section className="panel upload-panel">
            <div className="panel-title">
              <div>
                <h2>Upload sample</h2>
                <p>Select a file to begin static analysis.</p>
              </div>
              <span className="step">STEP 01</span>
            </div>

            <label className="dropzone">
              <input
                type="file"
                onChange={handleFileChange}
              />
              <div className="upload-icon">↑</div>
              <h3>
                {file ? file.name : "Choose a file to inspect"}
              </h3>
              <p>
                {file
                  ? `${formatBytes(file.size)} · Ready for analysis`
                  : "Browse your device to select a sample"}
              </p>
              <span className="browse-button">
                Browse files
              </span>
            </label>

            <div className="upload-footer">
              <span>Maximum file size: 10 MB</span>
              <span>One file per analysis</span>
            </div>

            <button
              className="analyze-button"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Start static analysis"}
              <span>→</span>
            </button>

            {message && (
              <div
                className={
                  report ? "message success" : "message"
                }
              >
                {message}
              </div>
            )}
          </section>

          {report && (
            <section className="results">
              <div className="results-heading">
                <div>
                  <div className="eyebrow">ANALYSIS OUTPUT</div>
                  <h2>Static analysis report</h2>
                </div>
                <span className="complete-badge">
                  Completed
                </span>
              </div>

              <div className="panel file-panel">
                <h3>File information</h3>
                <div className="info-grid">
                  <Info label="File name" value={report.file.originalName} />
                  <Info label="Detected type" value={report.file.detectedType} />
                  <Info label="Extension" value={report.file.extension || "None"} />
                  <Info label="File size" value={formatBytes(report.file.size)} />
                </div>
              </div>

              <div className="panel">
                <h3>Cryptographic hashes</h3>
                <div className="hash-row">
                  <span>SHA-256</span>
                  <code>{report.hashes.sha256}</code>
                  <button onClick={() => navigator.clipboard.writeText(report.hashes.sha256)}>Copy</button>
                </div>
                <div className="hash-row">
                  <span>MD5</span>
                  <code>{report.hashes.md5}</code>
                  <button onClick={() => navigator.clipboard.writeText(report.hashes.md5)}>Copy</button>
                </div>
              </div>

              <div className="panel">
                <h3>Static indicators</h3>
                <div className="metric-grid">
                  <div className="metric">
                    <span>Entropy</span>
                    <strong>{report.staticAnalysis.entropy}</strong>
                    <small>Bits per byte</small>
                  </div>
                  <div className="metric">
                    <span>Strings found</span>
                    <strong>{report.staticAnalysis.stringsFound}</strong>
                    <small>Printable strings</small>
                  </div>
                  <div className="metric">
                    <span>Indicators</span>
                    <strong>{report.staticAnalysis.indicators.length}</strong>
                    <small>Pattern matches</small>
                  </div>
                </div>
                <p className="disclaimer">
                  Indicators are investigation leads, not a
                  malware verdict.
                </p>
              </div>

              <div className="panel">
                <h3>Matched indicators</h3>
                {report.staticAnalysis.indicators.length === 0 ? (
                  <p className="empty">
                    No configured indicators were found.
                  </p>
                ) : (
                  report.staticAnalysis.indicators.map((item, i) => (
                    <div className="indicator" key={i}>
                      <strong>{item.name}</strong>
                      <div>
                        {item.examples.map((example, j) => (
                          <code key={j}>{example}</code>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="panel">
                <h3>Extracted strings</h3>
                <div className="strings">
                  {report.staticAnalysis.strings.length === 0
                    ? "No printable strings found."
                    : report.staticAnalysis.strings.map((s, i) => (
                        <div key={i}>{s}</div>
                      ))}
                </div>
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="info-item">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

export default App;