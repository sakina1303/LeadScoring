import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const scoreHistorySchema = new Schema(
  {
    lead_id: {
      type: Types.ObjectId,
      ref: 'Lead',
      required: [true, 'Lead ID is required'],
      index: true,
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: false,
  }
);

const ScoreHistory = mongoose.model('ScoreHistory', scoreHistorySchema);
export default ScoreHistory;
