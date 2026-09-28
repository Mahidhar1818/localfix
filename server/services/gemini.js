const { GoogleGenerativeAI } = require('@google/generative-ai');
const CATEGORIES = ['AC Repair', 'Plumbing', 'Electrical', 'Bike Tyre', 'Appliance Repair'];
async function diagnoseWithGemini(problemDescription) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('GEMINI_API_KEY is not configured');
    error.code = 'GEMINI_NOT_CONFIGURED';
    throw error;
  }
  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = client.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });
  const prompt = [
    'You are LocalFix FixMatch, a home-repair triage assistant.',
    `Categorize the problem into exactly one of: ${CATEGORIES.join(', ')}.`,
    'Suggest one likely issue and three concise next questions.',
    'Return JSON only with this shape: {"category":"...","likelyIssue":"...","confidence":0.0,"followUpQuestions":["..."]}.',
    `Problem description: ${problemDescription}`
  ].join('\n');
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/^```json\s*|\s*```$/g, '').trim();
  const parsed = JSON.parse(text);
  if (!CATEGORIES.includes(parsed.category)) parsed.category = 'Appliance Repair';
  parsed.confidence = Math.max(0, Math.min(1, Number(parsed.confidence) || 0));
  parsed.followUpQuestions = Array.isArray(parsed.followUpQuestions)
    ? parsed.followUpQuestions.slice(0, 3).map(String)
    : [];
  return parsed;
}
module.exports = { diagnoseWithGemini, CATEGORIES };