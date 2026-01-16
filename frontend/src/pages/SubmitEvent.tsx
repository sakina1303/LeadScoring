import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Send, Zap, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getLeads, getEventTypes, submitEvent } from '@/lib/api';

const SubmitEvent = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getLeads(), getEventTypes()])
      .then(([leadsData, eventTypesData]) => {
        setLeads(leadsData);
        setEventTypes(eventTypesData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load leads or event types');
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !selectedEvent) return;
    setIsSubmitting(true);
    try {
      await submitEvent({ lead_id: selectedLead, event_type: selectedEvent });
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedLead('');
        setSelectedEvent('');
      }, 3000);
    } catch {
      setIsSubmitting(false);
      setError('Failed to submit event');
    }
  };

  const selectedEventDetails = eventTypes.find((e: any) => e.value === selectedEvent);
  const selectedLeadDetails = leads.find((l: any) => l._id === selectedLead);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3"
        >
          <Plus className="w-8 h-8 text-primary" />
          Submit Event
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Manually log an event to update a lead's score.
        </motion.p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="relative overflow-hidden">
          {/* Success Overlay */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/95 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4"
                >
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-1">Event Submitted!</h3>
                <p className="text-muted-foreground text-sm">
                  Score updated successfully.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              New Event
            </CardTitle>
            <CardDescription>
              Select a lead and event type to record the activity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Lead Selection */}
              <div className="space-y-2">
                <Label htmlFor="lead">Select Lead</Label>
                <Select value={selectedLead} onValueChange={setSelectedLead}>
                  <SelectTrigger id="lead" className="w-full">
                    <SelectValue placeholder="Choose a lead..." />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead._id} value={lead._id}>
                        <span className="flex items-center gap-2">
                          <span className="font-medium">{lead.name}</span>
                          <span className="text-muted-foreground"> {lead.company}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Event Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="event">Event Type</Label>
                {eventTypes.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground border rounded-lg bg-muted/50">No scoring rules configured yet</div>
                ) : (
                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger id="event" className="w-full">
                      <SelectValue placeholder="Choose an event type..." />
                    </SelectTrigger>
                    <SelectContent style={{ maxHeight: '220px', overflowY: 'auto' }}>
                      {eventTypes.map((event: any) => (
                        <SelectItem key={event.value} value={event.value}>
                          <span className="flex items-center gap-2">
                            <span>{event.label}</span>
                            <span className="text-xs text-primary font-medium">
                              +{event.points} pts
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Preview */}
              <AnimatePresence>
                {selectedLead && selectedEvent && selectedEventDetails && selectedLeadDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl bg-muted/50 p-4 border overflow-hidden"
                  >
                    <p className="text-sm text-muted-foreground mb-2">Preview</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{selectedLeadDetails.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedEventDetails.label}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Score:</span>
                        <span className="text-lg font-bold">{selectedLeadDetails.current_score || 0}</span>
                        <span className="text-success font-semibold">→ {(selectedLeadDetails.current_score || 0) + selectedEventDetails.points}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={!selectedLead || !selectedEvent || isSubmitting || eventTypes.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Event
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Event Types Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Event Points Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {eventTypes.map((event: any) => (
                <div 
                  key={event.value}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border"
                >
                  <span className="text-sm">{event.label}</span>
                  <span className="text-sm font-semibold text-primary">+{event.points}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SubmitEvent;
