import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAo51Iq95IyOZMfh1G1c2mcT987ts3SUmQ';
const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiService = {
  async getClimateNews() {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
      const prompt = `Generate 6 recent climate change and environmental news headlines with descriptions. Format as JSON array with objects containing: title, content, category (climate/pollution/policy/research), publishedAt (recent date). Make them realistic and current.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      console.error('Error fetching climate news:', error);
      return [];
    }
  },

  async getDailyEcoTip() {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
      const prompt = `Generate a daily eco-friendly tip for sustainable living. Include a catchy title and practical description. Format as JSON with: title, description, category.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (error) {
      console.error('Error fetching eco tip:', error);
      return null;
    }
  },

  async getCarbonFootprintAnalysis(footprint: number) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
      const prompt = `Analyze a carbon footprint of ${footprint} kg CO2 per year. Provide a summary, personalized suggestions to reduce it, and specific actionable tips. Format as JSON with: summary, suggestions (array), tips (array).`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (error) {
      console.error('Error getting carbon analysis:', error);
      return null;
    }
  },

  async getEnvironmentalNews() {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
      const prompt = `Generate 8 current environmental news articles covering climate change, sustainability, renewable energy, and conservation. Format as JSON array with: id, title, content, category, imageUrl (use placeholder), publishedAt, source.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      console.error('Error fetching environmental news:', error);
      return [];
    }
  }
};