
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
  date: string;
  category: 'Cloud Architecture' | 'Vertex AI' | 'Fullstack' | 'DevOps';
  excerpt: string;
  content: string;
  readTime: string;
  imageUrl: string;
}
