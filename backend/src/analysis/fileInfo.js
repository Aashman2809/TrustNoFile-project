const path = require("path");

function detectFileType(buffer) {
  if (buffer.subarray(0, 2).toString() === "MZ") {
    return "Windows executable (possible PE)";
  }

  if (buffer.subarray(0, 4).toString("hex") === "7f454c46") {
    return "Linux executable (ELF)";
  }

  if (buffer.subarray(0, 4).toString() === "%PDF") {
    return "PDF document";
  }

  if (buffer.subarray(0, 4).toString("hex") === "504b0304") {
    return "ZIP archive";
  }

  if (
    buffer.subarray(0, 8).toString("hex") ===
    "89504e470d0a1a0a"
  ) {
    return "PNG image";
  }

  return "Unknown";
}

function getFileInfo(file, buffer) {
  return {
    originalName: file.originalname,
    extension: path.extname(file.originalname).toLowerCase(),
    size: file.size,
    detectedType: detectFileType(buffer),
  };
}

module.exports = { getFileInfo };