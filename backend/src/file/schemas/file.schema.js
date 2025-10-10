import mongoose from 'mongoose';
import PositionSchema from './position.schema';

export const FOLDER = 1;

const IconRefSchema = new mongoose.Schema(
  {
    imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', default: null },
    url: { type: String, default: null },
  },
  { _id: false }
);

const FileSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    type: { type: Number, required: true, enum: [FOLDER] },

    positions: {
      sm: {
        type: PositionSchema,
        required: function () {
          return !this.parentId;
        },
      },
      md: {
        type: PositionSchema,
        required: function () {
          return !this.parentId;
        },
      },
      lg: {
        type: PositionSchema,
        required: function () {
          return !this.parentId;
        },
      },
      xl: {
        type: PositionSchema,
        required: function () {
          return !this.parentId;
        },
      },
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      default: null,
      validate: {
        validator: async function (parentId) {
          if (!parentId) return true;
          const parent = await mongoose.model('File').findById(parentId).lean();
          return parent && parent.type === FOLDER;
        },
        message: 'Parent must be a folder',
      },
    },
    icon: IconRefSchema,
    contentImageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', default: null },
  },
  { collection: 'files' }
);

export default mongoose.model('File', FileSchema);
