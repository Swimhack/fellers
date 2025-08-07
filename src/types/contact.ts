export interface ContactSubmission {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  location: string;
  details: string;
  created_at?: string;
  status?: 'new' | 'contacted' | 'resolved';
}