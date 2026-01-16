// Mock data for the Lead Scoring System

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar?: string;
  score: number;
  status: 'hot' | 'warm' | 'cold' | 'new';
  createdAt: string;
  lastActivity: string;
}

export interface LeadEvent {
  id: string;
  leadId: string;
  type: 'email_open' | 'page_view' | 'form_submission' | 'demo_request' | 'purchase';
  points: number;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface ScoreHistory {
  date: string;
  score: number;
}


export const getScoreColor = (score: number): 'high' | 'medium' | 'low' => {
  if (score >= 150) return 'high';
  if (score >= 75) return 'medium';
  return 'low';
};

export const getStatusConfig = (status: Lead['status']) => {
  const configs = {
    hot: { label: 'Hot', className: 'score-high' },
    warm: { label: 'Warm', className: 'score-medium' },
    cold: { label: 'Cold', className: 'score-low' },
    new: { label: 'New', className: 'bg-primary/10 text-primary border-primary/20' },
  };
  return configs[status];
};
