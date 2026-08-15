const axios = require("axios");

const JUDGE0_URL = process.env.JUDGE0_URL || "https://ce.judge0.com";

const LANGUAGE_IDS = {
  c: 50,
  cpp: 54,
  java: 62,
  javascript: 63,
  python: 71
};

const normalizeOutput = (output) => {
  if (output === null || output === undefined) {
    return "";
  }

  return String(output)
    .replace(/\r\n/g, "\n")
    .trim();
};

const executeCode = async ({
  language,
  code,
  input,
  expectedOutput
}) => {
  const normalizedLanguage = language.toLowerCase();

  const languageId = LANGUAGE_IDS[normalizedLanguage];

  if (!languageId) {
    throw new Error(
      `Unsupported language: ${language}. Supported languages: C, C++, Java, JavaScript, Python`
    );
  }

  const response = await axios.post(
    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
    {
      source_code: code,
      language_id: languageId,
      stdin: input || "",
      expected_output: expectedOutput || "",

      cpu_time_limit: 2,
      wall_time_limit: 5,
      memory_limit: 128000
    },
    {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 10000
    }
  );

  const result = response.data;

  const status = result.status?.description || "Unknown";

  const actualOutput = normalizeOutput(result.stdout);
  const expected = normalizeOutput(expectedOutput);

  return {
    passed: status === "Accepted" && actualOutput === expected,

    status,

    actualOutput,

    expectedOutput: expected,

    stderr: result.stderr || null,

    compileOutput: result.compile_output || null,

    executionTime: result.time || null,

    memory: result.memory || null
  };
};

module.exports = executeCode;