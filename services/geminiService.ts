
export interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

export const getChatResponse = async (
  userMessage: string, 
  lang: 'fr' | 'en' = 'fr',
  history: ChatHistoryItem[] = []
): Promise<string> => {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, lang, history }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${res.status}`);
    }

    const data = await res.json();
    return data.response || (lang === 'en' 
      ? "Sorry, I couldn't process your question right now." 
      : "Désolé, je n'ai pas pu traiter votre question pour le moment.");
  } catch (error) {
    console.error("Chat API Error:", error);
    return lang === 'en' 
      ? "The virtual assistant is taking a short break. Feel free to use the contact form to message Maxime directly!"
      : "L'assistant virtuel fait une courte pause. N'hésitez pas à utiliser le formulaire de contact pour écrire directement à Maxime !";
  }
};

