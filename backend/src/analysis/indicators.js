function extractStrings(buffer) {
  const text = buffer.toString("latin1");

  const matches = text.match(
    /[\x20-\x7E]{5,}/g
  ) || [];

  return matches.slice(0, 500);
}

function findIndicators(strings) {
  const patterns = [
    {
      name: "PowerShell reference",
      regex: /powershell/i,
    },
    {
      name: "Command prompt reference",
      regex: /\bcmd\.exe\b/i,
    },
    {
      name: "URL found",
      regex: /https?:\/\/[^\s"'<>]+/i,
    },
    {
      name: "Possible Windows scripting",
      regex: /\bwscript\b|\bcscript\b/i,
    },
  ];

  const indicators = [];

  for (const pattern of patterns) {
    const found = strings.filter((value) =>
      pattern.regex.test(value)
    );

    if (found.length > 0) {
      indicators.push({
        name: pattern.name,
        examples: found.slice(0, 5),
      });
    }
  }

  return indicators;
}

module.exports = {
  extractStrings,
  findIndicators,
};