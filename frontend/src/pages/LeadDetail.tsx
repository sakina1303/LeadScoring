import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Mail, 
  Building2, 
  Calendar, 
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { getLead, getLeadHistory } from '@/lib/api';
import { getStatusConfig, getScoreColor } from '@/lib/mockData';
import { ScoreChart } from '@/components/leads/ScoreChart';
import { EventTimeline } from '@/components/leads/EventTimeline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<any | null>(null);
  const [scoreHistory, setScoreHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getLead(id), getLeadHistory(id)])
      .then(([leadData, historyData]) => {
        setLead(leadData);
        setScoreHistory(historyData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load lead details');
        setLoading(false);
      });
  }, [id]);


  if (loading) return <div>Loading...</div>;
  if (error || !lead) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Lead not found</h2>
        <p className="text-muted-foreground mb-6">
          The lead you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/')}> <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard </Button>
      </motion.div>
    );
  }

  const statusConfig = getStatusConfig(lead.status);
  const scoreColor = getScoreColor(lead.current_score || 0);

  // For event timeline, use scoreHistory as a proxy (or extend backend to provide events if needed)
  // Only map to allowed LeadEvent types for demo
  const allowedTypes = ['email_open', 'page_view', 'form_submission', 'demo_request', 'purchase'] as const;
  const leadEvents = useMemo(() => {
    // If backend provides event timeline, replace this logic
    return scoreHistory.map((h, idx) => ({
      id: idx.toString(),
      leadId: lead.id,
      type: allowedTypes[idx % allowedTypes.length],
      points: h.score,
      timestamp: h.timestamp || h.date,
      metadata: {},
    }));
  }, [scoreHistory, lead.id]);

  return (
    <div className="container py-8 md:py-12 max-w-4xl mx-auto">
      {/* Lead Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border bg-card p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row gap-6 md:items-start">
          {/* Avatar & Basic Info */}
          <div className="flex items-center gap-4 flex-1">
            <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-border">
              <AvatarFallback className="text-xl bg-gradient-to-br from-primary/20 to-accent/20 font-semibold">
                {lead.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl font-bold">{lead.name}</h1>
                <Badge 
                  variant="outline" 
                  className={`${statusConfig.className} border font-medium`}
                >
                  {statusConfig.label}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  {lead.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {lead.company}
                </span>
              </div>
            </div>
          </div>

          {/* Score Display */}
          <div className="flex flex-col items-center md:items-end">
            <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-3xl font-bold border ${
              scoreColor === 'high' ? 'score-high' : 
              scoreColor === 'medium' ? 'score-medium' : 'score-low'
            }`}>
              <TrendingUp className="w-6 h-6" />
              {lead.score}
            </div>
            <span className="text-sm text-muted-foreground mt-2">Current Score</span>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            Created {format(parseISO(lead.createdAt), 'MMM d, yyyy')}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Last active {format(parseISO(lead.lastActivity), 'MMM d, yyyy')}
          </span>
          <span className="flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            {leadEvents.length} events recorded
          </span>
        </div>
      </motion.div>

      {/* Charts & Timeline */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
              Score Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreChart data={scoreHistory} />
          </CardContent>
        </Card>

        {/* Event Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-primary" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EventTimeline events={leadEvents} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadDetail;
