import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || 'demo-auth-token';
  return {
    'Authorization': `Bearer ${token}`
  };
}

export const api = {
  // 1. Profile
  async getProfile() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/profile`, { headers });
    return res.json();
  },

  async updateProfile(data: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // 2. Crop Recommendations
  async getCropRecommendations() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/crop-recommendations`, { headers });
    return res.json();
  },

  async getCropRecommendationById(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/crop-recommendations/${id}`, { headers });
    return res.json();
  },

  async createCropRecommendation(payload: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/crop-recommendations`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async deleteCropRecommendation(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/crop-recommendations/${id}`, {
      method: 'DELETE',
      headers
    });
    return res.json();
  },

  // 3. Soil Analysis
  async getSoilAnalyses() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/soil-analysis`, { headers });
    return res.json();
  },

  async getSoilAnalysisById(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/soil-analysis/${id}`, { headers });
    return res.json();
  },

  async createSoilAnalysis(payload: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/soil-analysis`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // 4. Fertilizer Advisory
  async getFertilizerAdvisories() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/fertilizer-advisory`, { headers });
    return res.json();
  },

  async createFertilizerAdvisory(payload: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/fertilizer-advisory`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // 5. Irrigation Advisory
  async getIrrigationAdvisories() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/irrigation-advisory`, { headers });
    return res.json();
  },

  async createIrrigationAdvisory(payload: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/irrigation-advisory`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // 6. Disease Detection
  async getDiseaseAnalyses() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/disease-detection`, { headers });
    return res.json();
  },

  async getDiseaseAnalysisById(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/disease-detection/${id}`, { headers });
    return res.json();
  },

  async createDiseaseAnalysis(formData: FormData) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/disease-detection`, {
      method: 'POST',
      headers, // browser sets multipart boundary automatically
      body: formData
    });
    return res.json();
  },

  // 7. Chat Assistant
  async sendChatMessage(payload: { conversationId?: string; message: string; preferredLanguage?: string }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getChatConversations() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/chat/conversations`, { headers });
    return res.json();
  },

  async getChatMessages(conversationId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/messages`, { headers });
    return res.json();
  },

  async deleteChatConversation(conversationId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}`, {
      method: 'DELETE',
      headers
    });
    return res.json();
  },

  // 8. Sources
  async getSources() {
    const res = await fetch(`${API_BASE_URL}/sources`);
    return res.json();
  }
};

