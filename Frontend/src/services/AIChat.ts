import api from './api'

export default async (requestText: string, contextText: string) =>
{
    const response = await api.post("AI",{requestText,contextText});
    return response.data;
}