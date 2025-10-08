import mongoose from 'mongoose';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores'],
    },
    password: { type: String, required: true },
    tokenHash: { type: String },
  },
  { collection: 'users' }
);

UserSchema.pre('save', function (next) {
  if (this.isNew) this.tokenHash = crypto.randomBytes(16).toString('hex');
  next();
});

export default mongoose.model('User', UserSchema);
