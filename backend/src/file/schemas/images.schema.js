import mongoose from 'mongoose';

const RenditionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true }, // e.g. 'thumb', 'preview', 'w256'
    data: { type: Buffer, required: true, select: false },
    width: Number,
    height: Number,
    format: String,
    bytes: Number,
  },
  { _id: false }
);

const ImageSchema = new mongoose.Schema(
  {
    original: {
      data: { type: Buffer, required: true, select: false },
      contentType: { type: String, required: true },
      bytes: { type: Number, required: true },
      width: Number,
      height: Number,
      format: String,
    },
    externalUrl: { type: String, default: null },
    renditions: { type: [RenditionSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'images' }
);

ImageSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Image', ImageSchema);
