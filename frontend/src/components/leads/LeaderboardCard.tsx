import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Medal } from 'lucide-react';
import { Lead, getStatusConfig } from '@/lib/mockData';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface LeaderboardCardProps {
  lead: Lead;
  rank: number;
}

const rankConfig = {
  1: {
    gradient: 'from-amber-400 via-yellow-500 to-amber-600',
    bgGradient: 'from-amber-500/10 to-yellow-500/5',
    border: 'border-amber-500/30',
    icon: Trophy,
    iconColor: 'text-amber-500',
  },
  2: {
    gradient: 'from-slate-300 via-gray-400 to-slate-500',
    bgGradient: 'from-slate-400/10 to-gray-400/5',
    border: 'border-slate-400/30',
    icon: Medal,
    iconColor: 'text-slate-400',
  },
  3: {
    gradient: 'from-orange-400 via-amber-600 to-orange-700',
    bgGradient: 'from-orange-500/10 to-amber-500/5',
    border: 'border-orange-500/30',
    icon: Medal,
    iconColor: 'text-orange-500',
  },
};

export const LeaderboardCard = ({ lead, rank }: LeaderboardCardProps) => {
  const navigate = useNavigate();
  const isTopThree = rank <= 3;
  const config = rankConfig[rank as 1 | 2 | 3];
  const statusConfig = getStatusConfig(lead.status);
  const RankIcon = config?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      whileHover={{ scale: 1.01, y: -2 }}
      onClick={() => navigate(`/lead/${lead.id}`)}
      className={`relative overflow-hidden rounded-xl border bg-card p-4 cursor-pointer transition-shadow hover:shadow-lg ${
        isTopThree ? config.border : 'border-border'
      }`}
    >
      {/* Background gradient for top 3 */}
      {isTopThree && (
        <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-50`} />
      )}

      <div className="relative flex items-center gap-4">
        {/* Rank */}
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg ${
          isTopThree 
            ? `bg-gradient-to-br ${config.gradient} text-white shadow-md` 
            : 'bg-muted text-muted-foreground'
        }`}>
          {rank}
        </div>

        {/* Avatar & Info */}
        <div className="flex-1 flex items-center gap-3">
          <Avatar className="h-11 w-11 border-2 border-border">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 font-medium">
              {lead.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold truncate">{lead.name}</span>
              {isTopThree && RankIcon && (
                <RankIcon className={`w-4 h-4 ${config.iconColor}`} />
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{lead.company}</p>
          </div>
        </div>

        {/* Score & Status */}
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline" 
            className={`${statusConfig.className} border hidden sm:inline-flex`}
          >
            {statusConfig.label}
          </Badge>
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xl font-bold">{lead.score}</span>
            </div>
            <span className="text-xs text-muted-foreground">points</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
