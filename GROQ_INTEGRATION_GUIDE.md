# Groq LLM Integration Guide for Voyagery

## 🚀 Quick Setup

### 1. **Install Groq SDK**
```bash
npm install groq-sdk
```

### 2. **Environment Variables**
Add to your `.env` file:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### 3. **Get Groq API Key**
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up/Login
3. Create new API key
4. Copy key to your `.env` file

## 🎯 **Integration Points in Your Project**

### **1. Enhanced Guide Search (src_js/pages/Guides.jsx)**
```jsx
import SmartGuideRecommendations from '../components/SmartGuideRecommendations';

// Add AI-powered guide matching
<SmartGuideRecommendations 
  migrantProfile={userProfile}
  availableGuides={guides}
  onGuideSelect={handleGuideSelect}
  onBookSession={handleBookSession}
/>
```

### **2. Smart Cost Calculator (src_js/components/CostCalculatorWidget.jsx)**
```jsx
import AIInsightsWidget from './AIInsightsWidget';

// Add AI insights to cost calculator
{showLocationComparison && (
  <AIInsightsWidget
    migrantProfile={userProfile}
    costData={currentCityData}
    comparisonData={comparisonCityData}
    onInsightGenerated={handleInsightGenerated}
  />
)}
```

### **3. Intelligent Document Upload (src_js/components/DocumentUpload.jsx)**
```jsx
import groqService from '../services/groqService';

// Add AI document analysis
const analyzeDocument = async (file) => {
  const text = await extractTextFromFile(file);
  const analysis = await groqService.analyzeDocument(file.type, text);
  setDocumentFeedback(analysis);
};
```

### **4. Enhanced Messaging (src_js/services/api.js)**
```jsx
import groqService from './groqService';

// Add AI chat suggestions
export const getChatSuggestion = async (conversationId, userType) => {
  const context = await getMessages(conversationId);
  return await groqService.generateChatSuggestion(context, userType);
};
```

## 🔧 **Implementation Examples**

### **Example 1: Smart Guide Matching in Guides Page**
```jsx
// src_js/pages/Guides.jsx
import { useState, useEffect } from 'react';
import SmartGuideRecommendations from '../components/SmartGuideRecommendations';

const Guides = () => {
  const [userProfile, setUserProfile] = useState({
    currentLocation: 'Mumbai, India',
    targetLocation: 'Toronto, Canada',
    migrationType: 'Work Visa',
    budget: '$2000',
    urgency: 'High',
    specificNeeds: 'Document preparation, job search assistance'
  });

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Perfect Guide</h1>
      
      {/* AI-Powered Recommendations */}
      <SmartGuideRecommendations 
        migrantProfile={userProfile}
        availableGuides={guides}
        onGuideSelect={(guide) => {
          // Handle guide selection
          navigate(`/guide/${guide.id}`);
        }}
        onBookSession={(guide) => {
          // Handle session booking
          navigate(`/book-session/${guide.id}`);
        }}
      />
    </div>
  );
};
```

### **Example 2: AI-Enhanced Cost Calculator**
```jsx
// src_js/pages/CostOfLiving.jsx
import AIInsightsWidget from '../components/AIInsightsWidget';

const CostOfLiving = () => {
  const [userProfile, setUserProfile] = useState({
    currentLocation: 'Mumbai',
    targetLocation: 'Toronto',
    monthlyIncome: 50000, // INR
    familySize: 2,
    lifestyle: 'moderate'
  });

  return (
    <div className="space-y-8">
      {/* Existing cost comparison */}
      <CostComparisonSection />
      
      {/* AI Insights */}
      <AIInsightsWidget
        migrantProfile={userProfile}
        costData={currentCityData}
        comparisonData={comparisonCityData}
        onInsightGenerated={(insight, type) => {
          console.log(`Generated ${type} insight:`, insight);
        }}
      />
    </div>
  );
};
```

## 🎨 **UI Integration Points**

### **1. Dashboard Enhancement**
- Add AI insights cards to migrant/guide dashboards
- Show personalized recommendations
- Display smart notifications

### **2. Profile Pages**
- AI-generated profile optimization tips
- Smart matching suggestions
- Personalized migration roadmap

### **3. Session Management**
- AI-powered session preparation
- Smart agenda suggestions
- Follow-up recommendations

## 🔒 **Security & Best Practices**

### **Production Setup**
```javascript
// For production, move API calls to backend
// src_js/services/groqService.js (Backend version)
class GroqService {
  constructor() {
    // Remove dangerouslyAllowBrowser in production
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY // Backend only
    });
  }
}
```

### **Rate Limiting**
```javascript
// Add rate limiting for API calls
const rateLimiter = {
  calls: 0,
  resetTime: Date.now() + 60000, // 1 minute
  maxCalls: 10,
  
  canMakeCall() {
    if (Date.now() > this.resetTime) {
      this.calls = 0;
      this.resetTime = Date.now() + 60000;
    }
    return this.calls < this.maxCalls;
  }
};
```

## 📊 **Analytics & Monitoring**

### **Track AI Usage**
```javascript
// Add analytics for AI features
const trackAIUsage = (feature, success, responseTime) => {
  analytics.track('ai_feature_used', {
    feature,
    success,
    responseTime,
    userId: getCurrentUser()?.id
  });
};
```

## 🚀 **Deployment Steps**

1. **Install Dependencies**
   ```bash
   npm install groq-sdk
   ```

2. **Add Environment Variables**
   ```bash
   # .env
   VITE_GROQ_API_KEY=your_api_key
   ```

3. **Import Components**
   ```jsx
   // Add to your existing pages
   import SmartGuideRecommendations from '../components/SmartGuideRecommendations';
   import AIInsightsWidget from '../components/AIInsightsWidget';
   ```

4. **Test Integration**
   ```bash
   npm run dev
   # Test AI features in development
   ```

## 🎯 **Expected Benefits**

### **For Migrants**
- ✅ Personalized guide recommendations
- ✅ Smart cost analysis and budgeting tips
- ✅ Document verification assistance
- ✅ Intelligent migration insights

### **For Guides**
- ✅ Better client matching
- ✅ AI-assisted consultation preparation
- ✅ Smart conversation suggestions
- ✅ Automated administrative tasks

### **For Platform**
- ✅ Increased user engagement
- ✅ Better matching accuracy
- ✅ Reduced support burden
- ✅ Premium AI features monetization

## 🔄 **Future Enhancements**

1. **Multi-language Support** - AI responses in user's preferred language
2. **Voice Integration** - Voice-to-text for consultations
3. **Predictive Analytics** - Success rate predictions
4. **Custom Training** - Fine-tune models on migration data
5. **Real-time Assistance** - Live AI support during sessions

This integration will transform Voyagery into an intelligent migration platform with AI-powered insights and recommendations!