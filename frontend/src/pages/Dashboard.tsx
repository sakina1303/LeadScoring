import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Zap, Target } from 'lucide-react';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { StatCard } from '@/components/ui/StatCard';

import { getLeads } from '@/lib/api';
import { subscribeToScoreUpdates, unsubscribeFromScoreUpdates } from '@/lib/socket';


const Dashboard = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    setLoading(true);
    getLeads()
      .then(data => {
        setLeads(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load leads');
        setLoading(false);
      });

    // Real-time score updates
    const handleScoreUpdate = ({ leadId, newScore }: { leadId: string; newScore: number }) => {
      setLeads(prev => prev.map(l => l._id === leadId ? { ...l, current_score: newScore } : l));
    };
    subscribeToScoreUpdates(handleScoreUpdate);
    return () => unsubscribeFromScoreUpdates(handleScoreUpdate);
  }, []);

  const maxScore = useMemo(() => {
    if (leads.length === 0) return 1000;
    return Math.max(...leads.map(l => l.current_score || 0)) + 50;
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.company || '').toLowerCase().includes(searchTerm.toLowerCase());
      const score = lead.current_score || 0;
      const matchesScore = score >= scoreRange[0] && score <= scoreRange[1];
      return matchesSearch && matchesScore;
    });
  }, [leads, searchTerm, scoreRange]);

  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const hotLeads = leads.filter(l => l.status === 'hot').length;
    const avgScore = totalLeads > 0 ? Math.round(leads.reduce((acc, l) => acc + (l.current_score || 0), 0) / totalLeads) : 0;
    const totalScore = leads.reduce((acc, l) => acc + (l.current_score || 0), 0);
    return { totalLeads, hotLeads, avgScore, totalScore };
  }, [leads]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight mb-2"
        >
          Welcome to Your Leads
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          See your real leads, real scores, and real progress—instantly.
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={Users}
        />
        <StatCard
          title="Hot Leads"
          value={stats.hotLeads}
          icon={Zap}
          iconColor="text-warning"
        />
        <StatCard
          title="Average Score"
          value={stats.avgScore}
          icon={Target}
          iconColor="text-accent"
        />
        <StatCard
          title="Total Points"
          value={stats.totalScore.toLocaleString()}
          icon={TrendingUp}
          iconColor="text-success"
        />
      </div>

      {/* Filters & Table */}
      <div className="space-y-4">
        <LeadFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          scoreRange={scoreRange}
          onScoreRangeChange={setScoreRange}
          maxScore={maxScore}
        />
        <LeadTable leads={filteredLeads} />
      </div>
    </div>
  );
};

export default Dashboard;
