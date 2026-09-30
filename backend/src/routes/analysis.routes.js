const express = require("express");
const upload = require("../middleware/upload.middleware");

const {
  analyzeUploadedFile,
} = require("../controllers/analysis.controller");

const router = express.Router();

router.post(
  "/analyze",
  upload.single("file"),
  analyzeUploadedFile
);

module.exports = router;