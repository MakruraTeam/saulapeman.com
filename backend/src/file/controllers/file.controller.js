import FileSchema from '../schemas/file.schema';

export const getAllFilesController = async (req, res) => {
  try {
    const files = await FileSchema.find().lean();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const moveToRecycleBinController = async (req, res) => {
  const { fileId } = req.params;

  try {
    const file = await FileSchema.findById(fileId);
    if (!file) {
      return res.status(400).json({ error: 'File not found' });
    }

    const trashBin = await FileSchema.findOne({ label: 'Recycle Bin' }).lean();
    file.positions = null;
    file.parentId = trashBin._id;
    const updatedFile = await file.save();
    res.status(200).json(updatedFile);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
