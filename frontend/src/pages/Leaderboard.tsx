import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp } from 'lucide-react';
import { LeaderboardCard } from '@/components/leads/LeaderboardCard';
import { StatCard } from '@/components/ui/StatCard';
import { getLeaderboard } from '@/lib/api';

const Leaderboard = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getLeaderboard()
      .then(data => {
        setLeads(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load leaderboard');
        setLoading(false);
      });
  }, []);

  const sortedLeads = useMemo(() => {
    return [...leads].sort((a, b) => (b.current_score || 0) - (a.current_score || 0));
  }, [leads]);

  const stats = useMemo(() => {
    const topScore = sortedLeads[0]?.current_score ?? 0;
    const top3Avg = sortedLeads.length >= 3 ? Math.round(
      sortedLeads.slice(0, 3).reduce((acc, l) => acc + (l.current_score || 0), 0) / 3
    ) : 0;
    const totalPoints = sortedLeads.reduce((acc, l) => acc + (l.current_score || 0), 0);
    return { topScore, top3Avg, totalPoints };
  }, [sortedLeads]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3"
        >
          <Trophy className="w-8 h-8 text-warning" />
          Leaderboard
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Top performing leads ranked by engagement score.
        </motion.p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Top Score"
          value={stats.topScore}
          icon={Crown}
          iconColor="text-warning"
        />
        <StatCard
          title="Top 3 Average"
          value={stats.top3Avg}
          icon={Medal}
          iconColor="text-accent"
        />
        <StatCard
          title="Total Points"
          value={stats.totalPoints.toLocaleString()}
          icon={TrendingUp}
          iconColor="text-success"
        />
      </div>

      {/* Top 3 Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative rounded-2xl border bg-gradient-to-br from-primary/5 via-accent/5 to-warning/5 p-6 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 relative z-10">
          <Crown className="w-5 h-5 text-warning" />
          Top Performers
        </h2>
        
        <div className="space-y-3 relative z-10">
          {sortedLeads.slice(0, 3).map((lead, index) => (
            <LeaderboardCard key={lead.id} lead={lead} rank={index + 1} />
          ))}
        </div>
      </motion.div>

      {/* Rest of Rankings */}
      {sortedLeads.length > 3 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">All Rankings</h2>
          <div className="space-y-3">
            {sortedLeads.slice(3).map((lead, index) => (
              <LeaderboardCard key={lead.id} lead={lead} rank={index + 4} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
