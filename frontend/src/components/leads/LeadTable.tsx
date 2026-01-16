import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Lead, getStatusConfig, getScoreColor } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface LeadTableProps {
  leads: Lead[];
}

const getScoreTrend = (score: number) => {
  // Mock trend logic
  if (score > 200) return { icon: TrendingUp, className: 'text-success' };
  if (score > 100) return { icon: Minus, className: 'text-muted-foreground' };
  return { icon: TrendingDown, className: 'text-destructive' };
};

export const LeadTable = ({ leads }: LeadTableProps) => {
  const navigate = useNavigate();

  if (leads.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <ChevronRight className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-1">No leads yet</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          Add your first lead to start building real connections. Your journey begins here!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[300px]">Lead</TableHead>
            <TableHead className="hidden md:table-cell">Company</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead className="hidden sm:table-cell text-center">Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead, index) => {
            const statusConfig = getStatusConfig(lead.status);
            const scoreColor = getScoreColor(lead.score);
            const trend = getScoreTrend(lead.score);
            const TrendIcon = trend.icon;

            return (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/lead/${lead.id}`)}
                className="group cursor-pointer border-b transition-colors hover:bg-muted/50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-border">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground font-medium">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {lead.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {lead.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {lead.company}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${
                      scoreColor === 'high' ? 'score-high' : 
                      scoreColor === 'medium' ? 'score-medium' : 'score-low'
                    }`}>
                      <span>{lead.score}</span>
                      <TrendIcon className={`w-3.5 h-3.5 ${trend.className}`} />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-center">
                  <Badge 
                    variant="outline" 
                    className={`${statusConfig.className} border font-medium`}
                  >
                    {statusConfig.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
