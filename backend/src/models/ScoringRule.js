import mongoose from 'mongoose';

const { Schema } = mongoose;

const scoringRuleSchema = new Schema(
  {
    event_type: {
      type: String,
      required: [true, 'Event type is required'],
      unique: true,
      trim: true,
    },
    points: {
      type: Number,
      required: [true, 'Points are required'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: false,
  }
);

const ScoringRule = mongoose.model('ScoringRule', scoringRuleSchema);

export async function seedDefaultScoringRules() {
  const count = await ScoringRule.countDocuments();
  if (count === 0) {
    const defaultRules = [
      { event_type: 'Email Open', points: 10 },
      { event_type: 'Page View', points: 5 },
      { event_type: 'Form Submission', points: 20 },
      { event_type: 'Demo Request', points: 50 },
      { event_type: 'Purchase', points: 100 },
    ];
    await ScoringRule.insertMany(defaultRules);
    return true;
  }
  return false;
}

export default ScoringRule;
