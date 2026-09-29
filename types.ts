
export interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  link?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface BlogPost {
  id: string;
  title: string;
  titleEn?: string;
  date: string;
  category: 'Cloud Architecture' | 'Vertex AI' | 'Fullstack' | 'DevOps' | string;
  categoryEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  readTime: string;
  readTimeEn?: string;
  imageUrl: string;
}
