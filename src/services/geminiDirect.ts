const API_KEY = 'AIzaSyAo51Iq95IyOZMfh1G1c2mcT987ts3SUmQ';

export async function makeRequest(prompt: string) {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
}

export const geminiService = {
  async getClimateNews() {
    try {
      const prompt = `Generate 6 recent climate change and environmental news headlines with descriptions. Format as JSON array with objects containing: title, content, category (climate/pollution/policy/research), publishedAt (recent date). Make them realistic and current.`;
      
      const data = await makeRequest(prompt);
      const text = data.candidates[0].content.parts[0].text;
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
      const prompt = `Generate a daily eco-friendly tip for sustainable living. Include a catchy title and practical description. Format as JSON with: title, description, category.`;
      
      const data = await makeRequest(prompt);
      const text = data.candidates[0].content.parts[0].text;
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
      const prompt = `Analyze a carbon footprint of ${footprint} kg CO2 per year. Provide a summary, personalized suggestions to reduce it, and specific actionable tips. Format as JSON with: summary, suggestions (array), tips (array).`;
      
      const data = await makeRequest(prompt);
      const text = data.candidates[0].content.parts[0].text;
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
      const prompt = `Generate 8 current environmental news articles covering climate change, sustainability, renewable energy, and conservation. Format as JSON array with: id, title, content, category, imageUrl (use placeholder), publishedAt, source.`;
      
      const data = await makeRequest(prompt);
      const text = data.candidates[0].content.parts[0].text;
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