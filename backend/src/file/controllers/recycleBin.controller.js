import FileSchema, { FOLDER } from '../schemas/file.schema.js';

const RECYCLE_BIN_LABEL = 'Recycle Bin';

const getDefaultBinPositions = () => ({
  sm: { row: 1, col: 4 },
  md: { row: 1, col: 8 },
  lg: { row: 1, col: 12 },
  xl: { row: 1, col: 16 },
});

export const createRecycleBin = async () => {
  const existingByName = await FileSchema.findOne({ label: RECYCLE_BIN_LABEL }).lean();

  if (existingByName) {
    console.log('Recycle Bin already exists with ID:', existingByName._id.toString());
    return;
  }

  const positions = getDefaultBinPositions();
  const occupiedBreakpoints = [];

  for (const [bp, pos] of Object.entries(positions)) {
    const taken = await FileSchema.exists({
      parentId: null,
      [`positions.${bp}.row`]: pos.row,
      [`positions.${bp}.col`]: pos.col,
    });
    if (taken) occupiedBreakpoints.push(bp);
  }

  if (occupiedBreakpoints.length > 0) {
    throw new Error(`Cannot place Recycle Bin: top-right cell is occupied at breakpoints [${occupiedBreakpoints.join(', ')}].`);
  }

  const doc = await FileSchema.create({
    label: RECYCLE_BIN_LABEL,
    type: FOLDER,
    positions,
    parentId: null,
    icon: {
      url: '/assets/recycle-bin-icon.png',
      imageId: null,
    },
  });

  console.log('Recycle Bin created with ID:', doc._id.toString());
  return doc;
};
