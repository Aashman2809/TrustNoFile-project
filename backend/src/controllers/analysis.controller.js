const { analyzeFile } = require("../analysis/analyzeFile");

function analyzeUploadedFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Please upload a file.",
      });
    }

    const report = analyzeFile(req.file);

    return res.status(200).json(report);
  } catch (error) {
    console.error("Analysis error:", error);

    return res.status(500).json({
      error: "Could not analyze the uploaded file.",
    });
  }
}

module.exports = { analyzeUploadedFile };