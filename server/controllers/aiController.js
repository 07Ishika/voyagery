const { AppError } = require('../utils/AppError');

async function generateCostInsights(req, res, next) {
  const { prompt } = req.body;

  if (!process.env.GROQ_API_KEY) {
    return next(new AppError('AI insights are not configured', 503));
  }

  if (typeof prompt !== 'string' || prompt.trim().length === 0 || prompt.length > 8000) {
    return next(new AppError('A prompt between 1 and 8000 characters is required', 400));
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are a migration cost advisor.

Analyze the user's monthly expenses and city comparison.
Return exactly:
1. One sentence on the biggest cost issue.
2. One sentence on city value comparison.
3. One sentence on hidden cost risk.

Then add:
- Suggestion 1
- Suggestion 2

Use the actual numbers from the input.
Keep it practical, direct, and under 120 words.
Use plain English.
Do not write long paragraphs.`
          },
          { role: 'user', content: prompt.trim() }
        ],
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
        temperature: 0.1,
        max_tokens: 120
      })
    });

    if (!response.ok) {
      throw new AppError('AI provider request failed', 502);
    }

    const data = await response.json();
    return res.json({ insight: data.choices?.[0]?.message?.content || '' });
  } catch (error) {
    return next(error);
  }
}

module.exports = { generateCostInsights };