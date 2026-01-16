import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      index: true,
      trim: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    current_score: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be negative'],
    },
    status: {
      type: String,
      default: 'new',
      enum: ['new', 'contacted', 'qualified', 'converted', 'rejected'],
    },
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
