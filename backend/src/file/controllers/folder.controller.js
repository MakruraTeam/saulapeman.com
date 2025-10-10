import FileSchema, { FOLDER } from '../schemas/file.schema.js';
import { parseMaybeJson, resolveIconRef } from '../helpers/folder.helper.js';
import { createImageFromBuffer } from '../helpers/images.helper.js';

export const createFolderController = async (req, res) => {
  const bodyPositions = parseMaybeJson(req.body.positions);
  const { label, parentId = null, icon } = req.body;
  const positions = bodyPositions;

  try {
    if (!label || typeof label !== 'string' || label.trim() === '') {
      return res.status(400).json({ error: 'Label is required and must be a non-empty string' });
    }

    if (parentId) {
      const parent = await FileSchema.findById(parentId).lean();
      if (!parent || parent.type !== FOLDER) {
        return res.status(400).json({ error: 'Parent must be a valid folder ID' });
      }
    }

    if (!positions || typeof positions !== 'object') {
      return res.status(400).json({ error: 'Positions are required and must be an object' });
    }

    const folder = await new FileSchema({
      label: label.trim(),
      type: FOLDER,
      parentId,
      positions,
    }).save();

    let iconRef = null;

    if (req.file) {
      if (req.file.size > 10 * 1024 * 1024) {
        await FileSchema.findByIdAndDelete(folder._id);
        return res.status(413).json({ error: 'Image is too large' });
      }
      const imgDoc = await createImageFromBuffer(req.file.buffer, req.file.mimetype);
      iconRef = { imageId: imgDoc._id, url: null };
    } else {
      iconRef = await resolveIconRef(icon);
    }

    if (iconRef) {
      folder.icon = iconRef;
      await folder.save();
    }

    return res.status(201).json(await FileSchema.findById(folder._id).lean());
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
  }
};

export const getFolderByIdController = async (req, res) => {
  const { folderId } = req.params;
  try {
    const folder = await FileSchema.findById(folderId).lean();
    if (!folder || folder.type !== FOLDER) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    return res.status(200).json(folder);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllFilesInsideFolderController = async (req, res) => {
  const { folderId } = req.params;

  try {
    const folder = await FileSchema.findById(folderId).lean();
    if (!folder || folder.type !== FOLDER) {
      return res.status(400).json({ error: 'Folder not found' });
    }
    const files = await FileSchema.find({ parentId: folderId }).lean();
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const editFolderController = async (req, res) => {
  const { folderId } = req.params;

  const bodyPositions = parseMaybeJson(req.body.positions);
  const { label, parentId = null, icon, iconRemove } = req.body;
  const positions = bodyPositions;

  try {
    const folder = await FileSchema.findById(folderId);
    if (!folder || folder.type !== FOLDER) {
      return res.status(400).json({ error: 'Folder not found' });
    }

    if (label && (typeof label !== 'string' || label.trim() === '')) {
      return res.status(400).json({ error: 'Label must be a non-empty string' });
    }

    if (parentId) {
      const parent = await FileSchema.findById(parentId).lean();
      if (!parent || parent.type !== FOLDER) {
        return res.status(400).json({ error: 'Parent must be a valid folder ID' });
      }

      if (parentId === folderId) {
        return res.status(400).json({ error: 'Folder cannot be its own parent' });
      }

      let currentParentId = parent.parentId;
      while (currentParentId) {
        if (currentParentId.toString() === folderId) {
          return res.status(400).json({ error: 'Circular parent reference detected' });
        }
        const currentParent = await FileSchema.findById(currentParentId).lean();
        currentParentId = currentParent ? currentParent.parentId : null;
      }
    }

    if (positions && typeof positions !== 'object') {
      return res.status(400).json({ error: 'Positions must be an object' });
    }

    if (label) folder.label = label.trim();
    folder.parentId = parentId;
    if (positions) folder.positions = positions;

    if (iconRemove === true) {
      folder.icon = undefined;
    } else if (req.file) {
      if (req.file.size > 10 * 1024 * 1024) {
        return res.status(413).json({ error: 'Image is too large' });
      }
      const imgDoc = await createImageFromBuffer(req.file.buffer, req.file.mimetype);
      folder.icon = { imageId: imgDoc._id, url: null };
    } else if (typeof icon !== 'undefined') {
      const iconRef = await resolveIconRef(icon);
      folder.icon = iconRef || undefined;
    }

    const updatedFolder = await folder.save();
    return res.status(200).json(await FileSchema.findById(updatedFolder._id).lean());
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
  }
};

export const deleteFolderController = async (req, res) => {
  const { folderId } = req.params;

  try {
    const folder = await FileSchema.findById(folderId).lean();
    if (!folder || folder.type !== FOLDER) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const idsToDelete = [folder._id];
    let frontier = [folder._id];

    while (frontier.length) {
      const children = await FileSchema.find({ parentId: { $in: frontier } }, { _id: 1 }).lean();
      if (!children.length) break;

      const childIds = children.map((c) => c._id);
      idsToDelete.push(...childIds);
      frontier = childIds;
    }

    await FileSchema.deleteMany({ _id: { $in: idsToDelete } });

    return res.status(200).json({ message: 'Folder and all nested contents deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
