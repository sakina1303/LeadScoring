import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { ScoreHistory } from '@/lib/mockData';
import { format, parseISO } from 'date-fns';

interface ScoreChartProps {
  data: ScoreHistory[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-xs text-muted-foreground mb-1">
          {format(parseISO(label), 'MMM d, yyyy')}
        </p>
        <p className="text-lg font-semibold text-foreground">
          Score: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const ScoreChart = ({ data }: ScoreChartProps) => {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      formattedDate: format(parseISO(item.date), 'MMM d'),
    }));
  }, [data]);

  const minScore = Math.min(...data.map(d => d.score)) - 10;
  const maxScore = Math.max(...data.map(d => d.score)) + 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(238 84% 67%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(238 84% 67%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false}
            stroke="hsl(var(--border))"
          />
          <XAxis 
            dataKey="formattedDate" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            dy={10}
          />
          <YAxis 
            domain={[minScore, maxScore]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="hsl(238 84% 67%)"
            strokeWidth={2.5}
            fill="url(#scoreGradient)"
            dot={false}
            activeDot={{
              r: 6,
              fill: 'hsl(238 84% 67%)',
              stroke: 'hsl(var(--background))',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
