export interface User {
  id: number;
  email: string;
  role: 'admin' | 'organizer' | 'assistant';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}