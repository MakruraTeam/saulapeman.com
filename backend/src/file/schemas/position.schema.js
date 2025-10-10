import mongoose from 'mongoose';

const PositionSchema = new mongoose.Schema(
  {
    row: { type: Number, required: true, min: 1 },
    col: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

export default PositionSchema;
