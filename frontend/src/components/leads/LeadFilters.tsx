import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface LeadFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  scoreRange: [number, number];
  onScoreRangeChange: (value: [number, number]) => void;
  maxScore: number;
}

export const LeadFilters = ({
  searchTerm,
  onSearchChange,
  scoreRange,
  onScoreRangeChange,
  maxScore,
}: LeadFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = scoreRange[0] > 0 || scoreRange[1] < maxScore;

  const resetFilters = () => {
    onScoreRangeChange([0, maxScore]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search leads by name, email, or company..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-card border-border"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              1
            </Badge>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl border bg-card space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Score Range</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {scoreRange[0]} - {scoreRange[1]}
                  </span>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="h-7 text-xs"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
              <Slider
                value={scoreRange}
                onValueChange={(value) => onScoreRangeChange(value as [number, number])}
                min={0}
                max={maxScore}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>{maxScore}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
