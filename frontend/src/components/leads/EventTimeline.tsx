import { motion } from 'framer-motion';
import { 
  Mail, 
  Eye, 
  FileText, 
  Calendar, 
  ShoppingCart,
  Clock,
  Plus
} from 'lucide-react';
import { LeadEvent } from '@/lib/mockData';
const eventTypeLabels: Record<string, string> = {
  email_open: 'Email Opened',
  page_view: 'Page Viewed',
  form_submission: 'Form Submitted',
  demo_request: 'Demo Requested',
  purchase: 'Purchase',
};
import { format, parseISO } from 'date-fns';

interface EventTimelineProps {
  events: LeadEvent[];
}

const eventIcons = {
  email_open: Mail,
  page_view: Eye,
  form_submission: FileText,
  demo_request: Calendar,
  purchase: ShoppingCart,
};

const eventColors = {
  email_open: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  page_view: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  form_submission: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  demo_request: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  purchase: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
};

export const EventTimeline = ({ events }: EventTimelineProps) => {
  if (events.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium mb-1">No events yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Events will appear here as the lead interacts with your content.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-4">
        {events.map((event, index) => {
          const Icon = eventIcons[event.type];
          const colorClass = eventColors[event.type];
          const eventTypeLabel = eventTypeLabels[event.type] || event.type;
          const timestamp = parseISO(event.timestamp);

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-4 group"
            >
              {/* Icon */}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-xl border ${colorClass} transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-medium">{eventTypeLabel}</span>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass} border`}>
                    <Plus className="w-3 h-3" />
                    {event.points} pts
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{format(timestamp, 'MMM d, yyyy')}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{format(timestamp, 'h:mm a')}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
