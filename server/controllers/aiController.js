const { AppError } = require('../utils/AppError');

async function generateCostInsights(req, res, next) {
  const { prompt } = req.body;
  const groqModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

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

Use only the numbers in the user's input.

Return:
Biggest cost issue: one sentence.
City value comparison: one sentence.
Hidden cost risk: one sentence.

Suggestions:
1. One practical suggestion.
2. One practical suggestion.
3. One practical suggestion.

Keep it under 120 words and plain English.`
          },
          { role: 'user', content: prompt.trim() }
        ],
        model: groqModel,
        temperature: 0.1,
        max_tokens: 250
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new AppError(`AI provider request failed: ${response.status} ${response.statusText}`, 502);
    }

    const data = await response.json();
    console.log('Groq raw response:', JSON.stringify(data, null, 2));

    const insight = data.choices?.[0]?.message?.content?.trim() || 'Unable to generate insights at this time.';
    return res.json({ insight });
  } catch (error) {
    console.error('Groq fetch failed:', error);
    return next(error);
  }
}

module.exports = { generateCostInsights };


