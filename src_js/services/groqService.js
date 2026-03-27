// Groq LLM Integration Service for Voyagery
import Groq from 'groq-sdk';

class GroqService {
  constructor() {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    
    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      keyLength: apiKey?.length,
      keyStart: apiKey?.substring(0, 10),
      allEnvVars: Object.keys(import.meta.env)
    });
    
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      console.error('VITE_GROQ_API_KEY not found or not set properly');
      throw new Error('Groq API key not configured properly');
    }
    
    try {
      this.groq = new Groq({
        apiKey: apiKey.trim(), // Remove any whitespace
        dangerouslyAllowBrowser: true
      });
      
      this.model = 'llama3-8b-8192';
      console.log('Groq service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Groq service:', error);
      throw error;
    }
  }

  // Smart guide matching based on migrant needs
  async findBestGuides(migrantProfile, availableGuides) {
    const prompt = `
    You are an AI migration advisor. Help match a migrant with the best guides.
    
    Migrant Profile:
    - Current Location: ${migrantProfile.currentLocation}
    - Target Location: ${migrantProfile.targetLocation}
    - Migration Type: ${migrantProfile.migrationType}
    - Budget: ${migrantProfile.budget}
    - Urgency: ${migrantProfile.urgency}
    - Specific Needs: ${migrantProfile.specificNeeds}
    
    Available Guides:
    ${availableGuides.map(guide => `
    - ${guide.name}: ${guide.specializations.join(', ')} | Rating: ${guide.rating} | Languages: ${guide.languages.join(', ')} | Rate: $${guide.hourlyRate}/hr
    `).join('')}
    
    Provide:
    1. Top 3 recommended guides with reasons
    2. Match score (1-10) for each
    3. Specific reasons why each guide fits
    4. Estimated session cost and timeline
    
    Format as JSON:
    {
      "recommendations": [
        {
          "guideId": "guide_id",
          "matchScore": 9,
          "reasons": ["reason1", "reason2"],
          "estimatedCost": "$200-300",
          "timeline": "2-3 sessions"
        }
      ]
    }
    `;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.3,
        max_tokens: 1000
      });

      return JSON.parse(completion.choices[0]?.message?.content || '{}');
    } catch (error) {
      console.error('Groq guide matching error:', error);
      return { recommendations: [] };
    }
  }

  // Generate personalized migration insights
  async generateMigrationInsights(migrantData, costData) {
    const prompt = `
    Generate personalized migration insights for this profile:
    
    Profile: ${JSON.stringify(migrantData)}
    Cost Data: ${JSON.stringify(costData)}
    
    Provide:
    1. Key challenges they might face
    2. Budget optimization tips
    3. Timeline recommendations
    4. Important documents needed
    5. Cultural adaptation advice
    
    Keep it practical and actionable. Max 300 words.
    `;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.7,
        max_tokens: 500
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq insights error:', error);
      return 'Unable to generate insights at this time.';
    }
  }

  // Smart document analysis
  async analyzeDocument(documentType, documentText) {
    const prompt = `
    Analyze this ${documentType} document for migration purposes:
    
    Document Content: ${documentText}
    
    Check for:
    1. Completeness - are all required fields filled?
    2. Validity - does it meet standard requirements?
    3. Missing information
    4. Potential issues
    5. Next steps needed
    
    Provide actionable feedback.
    `;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.2,
        max_tokens: 400
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq document analysis error:', error);
      return 'Unable to analyze document at this time.';
    }
  }

  // Chat assistance for guide-migrant conversations
  async generateChatSuggestion(conversationContext, userType) {
    const prompt = `
    You're assisting a ${userType} in a migration consultation chat.
    
    Conversation Context: ${conversationContext}
    
    Suggest a helpful, professional response that:
    1. Addresses the current topic
    2. Moves the conversation forward
    3. Provides value
    4. Maintains professional tone
    
    Keep it concise (1-2 sentences).
    `;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.6,
        max_tokens: 150
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq chat suggestion error:', error);
      return '';
    }
  }

  // Test API key with simple call
  async testApiKey() {
    try {
      console.log('Testing Groq API key...');
      const completion = await this.groq.chat.completions.create({
        messages: [{ 
          role: 'user', 
          content: 'Say hello' 
        }],
        model: this.model,
        max_tokens: 10
      });
      
      console.log('✅ API key test successful:', completion.choices[0]?.message?.content);
      return true;
    } catch (error) {
      console.error('❌ API key test failed:', error);
      return false;
    }
  }

  // Generate cost insights from prompt
  async generateCostInsights(prompt) {
    try {
      console.log('Making Groq API call with model:', this.model);
      console.log('API Key starts with:', this.groq.apiKey?.substring(0, 10));
      
      // Test API key first
      const isKeyValid = await this.testApiKey();
      if (!isKeyValid) {
        console.log('🔄 Using mock insights due to API key failure');
        return this.getMockInsights(prompt);
      }
      
      const completion = await this.groq.chat.completions.create({
        messages: [{ 
          role: 'system', 
          content: 'You are a financial advisor specializing in cost-of-living analysis for people planning to migrate. Provide practical, actionable advice.'
        }, {
          role: 'user', 
          content: prompt 
        }],
        model: this.model,
        temperature: 0.4,
        max_tokens: 300
      });

      console.log('Groq API response received successfully');
      return completion.choices[0]?.message?.content || 'Unable to generate insights at this time.';
    } catch (error) {
      console.error('Groq cost insights error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        type: error.type
      });
      
      if (error.status === 401) {
        // Fallback to mock insights for demo
        return this.getMockInsights(prompt);
      }
      
      return 'Unable to generate insights at this time. Please try again.';
    }
  }

  // Mock insights for demo when API key fails
  getMockInsights(prompt) {
    // Extract location info from prompt if available
    const isLocationComparison = prompt.includes('vs') || prompt.includes('Target City');
    
    const locationSpecificInsights = [
      `🏠 LOCATION COMPARISON: The cost difference between these cities is significant. Your housing budget will be the biggest factor - research neighborhoods that offer good value for money.

💰 BUDGET REALITY: Based on your expenses, you're planning for a comfortable lifestyle. Make sure your expected salary in the new city can support these costs, especially housing which is usually 40-50% of income.

🎯 OPTIMIZATION: Focus on the big three: housing, food, and transport. Small savings in these areas add up quickly. Consider shared housing initially to reduce costs.

⚠️ MIGRATION COSTS: Don't forget one-time moving expenses: visa fees ($1,500-3,000), flights ($800-2,000), shipping belongings ($1,000-5,000), and initial setup costs like deposits and furniture ($3,000-8,000).`,

      `🏠 HOUSING INSIGHT: Your rent budget needs careful planning. In expensive cities, consider living slightly outside the center - you'll save 30-40% on rent and still have good transport links.

💰 SPENDING PATTERNS: Your food budget looks reasonable, but eating out costs vary dramatically between cities. Cook at home more in expensive cities - you can save $300-500 monthly.

🎯 SMART SAVINGS: Transportation costs add up fast. Monthly passes are usually 20-30% cheaper than daily tickets. In some cities, cycling or walking can save you $100+ monthly.

⚠️ PLANNING AHEAD: Budget 25-30% extra for your first 3 months. New cities have unexpected costs: local phone plans, different banking fees, higher initial grocery shopping, and emergency funds.`,

      `🏠 AFFORDABILITY CHECK: Your total monthly expenses look high compared to typical salaries. Research actual job salaries in your target city - websites like Glassdoor, PayScale give realistic numbers.

💰 INCOME PLANNING: Rule of thumb: housing should be max 30% of income, total living costs max 70%. If your budget exceeds this, either increase expected income or reduce expenses.

🎯 PRIORITY EXPENSES: Focus spending on: 1) Safe housing in good location, 2) Reliable transport to work, 3) Quality food and healthcare. Cut back on entertainment and shopping initially.

⚠️ EMERGENCY FUND: Keep 3-6 months of expenses saved before moving. New countries have unexpected costs, job searches take time, and you need financial security during transition.`
    ];

    const generalInsights = [
      `🏠 BUDGET ANALYSIS: Your expenses show you're planning for a comfortable lifestyle. Housing takes the biggest chunk - research neighborhoods carefully to get best value.

💰 COST OPTIMIZATION: Look for savings in recurring expenses: cheaper phone plans, bulk grocery shopping, cooking at home more, and using public transport instead of taxis.

🎯 MIGRATION TIPS: Start saving early - moving costs are always higher than expected. Budget for visa fees, flights, shipping, deposits, and 2-3 months of living expenses as buffer.

⚠️ HIDDEN COSTS: New cities have surprise expenses: different tax systems, health insurance requirements, professional license transfers, and higher costs while you learn where to shop cheaply.`,

      `🏠 HOUSING STRATEGY: Your rent budget is your biggest expense. Consider: location vs commute time, shared housing to reduce costs, and neighborhoods with good amenities nearby.

💰 SPENDING SMART: Track your expenses for 2-3 months before moving to understand your real spending patterns. Many people underestimate food, transport, and entertainment costs.

🎯 INCOME REALITY: Research actual salaries in your target location and industry. Factor in taxes, healthcare costs, and retirement savings - your take-home pay might be different than expected.

⚠️ TRANSITION PLANNING: Plan for 6-12 months of adjustment period. Initial months are expensive: temporary housing, eating out more, buying essentials, and learning the local cost-saving tricks.`
    ];

    const insights = isLocationComparison ? locationSpecificInsights : generalInsights;
    return insights[Math.floor(Math.random() * insights.length)];
  }
}

// Create singleton instance
const groqService = new GroqService();

export default groqService;