const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean);

let currentKeyIndex = 0;
let model;

const getGeminiModel = () => {
  const key = API_KEYS[currentKeyIndex % API_KEYS.length];
  currentKeyIndex++;
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

const initGemini = () => {
  try {
    console.log(`Gemini AI initialized with ${API_KEYS.length} key(s)`);
  } catch (error) {
    console.error("Failed to initialize Gemini:", error.message);
    throw error;
  }
};

module.exports = { initGemini, getGeminiModel };