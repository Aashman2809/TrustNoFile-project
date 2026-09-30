const fs = require("fs");

const { getFileInfo } = require("./fileInfo");
const { calculateHashes } = require("./hashing");
const { calculateEntropy } = require("./entropy");
const {
  extractStrings,
  findIndicators,
} = require("./indicators");

function analyzeFile(file) {
  const buffer = fs.readFileSync(file.path);

  const strings = extractStrings(buffer);

  return {
    file: getFileInfo(file, buffer),

    hashes: calculateHashes(buffer),

    staticAnalysis: {
      entropy: calculateEntropy(buffer),
      stringsFound: strings.length,
      strings: strings.slice(0, 100),
      indicators: findIndicators(strings),
    },

    status: "static_analysis_complete",
  };
}

module.exports = { analyzeFile };