import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const eventSchema = new Schema(
  {
    event_id: {
      type: String,
      required: [true, 'Event ID is required'],
      unique: true,
      index: true,
      trim: true,
    },
    lead_id: {
      type: Types.ObjectId,
      ref: 'Lead',
      required: [true, 'Lead ID is required'],
      index: true,
    },
    event_type: {
      type: String,
      required: [true, 'Event type is required'],
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    processed: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;
