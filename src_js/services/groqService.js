const API_BASE_URL = `${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/api`;

class GroqService {
  async generateCostInsights(prompt) {
    const response = await fetch(`${API_BASE_URL}/ai/cost-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`AI request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.insight || 'Unable to generate insights at this time.';
  }
}

export default new GroqService();
