import FileModel, { FOLDER } from '../schemas/file.schema';
import { createImageFromBuffer } from '../helpers/images.helper';

export const setFolderIconController = async (req, res) => {
  const { folderId } = req.params;
  const folder = await FileModel.findById(folderId);
  if (!folder || folder.type !== FOLDER) return res.status(404).json({ error: 'Folder not found' });

  const { iconUrl } = req.body;
  if (iconUrl) {
    folder.icon = { url: iconUrl, imageId: null };
    await folder.save();
    return res.status(200).json(await FileModel.findById(folderId).lean());
  }

  if (!req.file) return res.status(400).json({ error: 'No icon file or url provided' });
  if (req.file.size > 5 * 1024 * 1024) return res.status(413).json({ error: 'Icon too large' });

  const img = await createImageFromBuffer(req.file.buffer, req.file.mimetype);
  folder.icon = { imageId: img._id, url: null };
  await folder.save();

  res.status(200).json(await FileModel.findById(folderId).lean());
};
