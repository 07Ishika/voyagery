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
            content: 'You are a financial advisor specializing in cost-of-living analysis for people planning to migrate. Provide practical, actionable advice.'
          },
          { role: 'user', content: prompt.trim() }
        ],
        model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
        temperature: 0.4,
        max_tokens: 300
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