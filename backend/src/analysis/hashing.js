const crypto = require("crypto");

function calculateHashes(buffer) {
  return {
    sha256: crypto
      .createHash("sha256")
      .update(buffer)
      .digest("hex"),

    md5: crypto
      .createHash("md5")
      .update(buffer)
      .digest("hex"),
  };
}

module.exports = { calculateHashes };