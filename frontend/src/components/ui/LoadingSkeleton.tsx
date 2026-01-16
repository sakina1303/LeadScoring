import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant?: 'table' | 'card' | 'chart' | 'timeline';
  count?: number;
}

export const LoadingSkeleton = ({ variant = 'table', count = 5 }: LoadingSkeletonProps) => {
  if (variant === 'table') {
    return (
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-4 border-b">
          <div className="h-4 bg-muted rounded shimmer w-48" />
        </div>
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-4 border-b last:border-0"
          >
            <div className="w-10 h-10 rounded-full shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded shimmer w-1/3" />
              <div className="h-3 bg-muted rounded shimmer w-1/4" />
            </div>
            <div className="h-6 bg-muted rounded-full shimmer w-16" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border bg-card p-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded shimmer w-1/3" />
                <div className="h-3 bg-muted rounded shimmer w-1/4" />
              </div>
              <div className="h-8 bg-muted rounded shimmer w-20" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="h-5 bg-muted rounded shimmer w-32 mb-6" />
        <div className="h-[250px] bg-muted rounded-lg shimmer" />
      </div>
    );
  }

  if (variant === 'timeline') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-4"
          >
            <div className="w-12 h-12 rounded-xl shimmer" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 bg-muted rounded shimmer w-1/3" />
              <div className="h-3 bg-muted rounded shimmer w-1/4" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
};
