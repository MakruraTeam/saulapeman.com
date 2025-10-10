import { createImageFromBuffer } from '../helpers/images.helper';
import ImageModel from '../schemas/images.schema';
import { formatToMime, getOrCreateRendition } from '../helpers/images.helper';

export const uploadImageController = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });
  const img = await createImageFromBuffer(req.file.buffer, req.file.mimetype);
  res.status(201).json({ imageId: img._id });
};

export const streamImageController = async (req, res) => {
  const { imageId } = req.params;
  const { preset, w, h } = req.query;

  const image = await ImageModel.findById(imageId).select('+original.data +renditions.data').exec();

  if (!image) return res.status(404).json({ error: 'Image not found' });

  if (image.externalUrl) {
    return res.redirect(302, image.externalUrl);
  }

  const wantOriginal = !preset && !w && !h;

  if (wantOriginal) {
    res.setHeader('Content-Type', image.original.contentType || formatToMime(image.original.format));
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    res.setHeader('Content-Length', String(image.original.bytes));
    return res.status(200).end(image.original.data);
  }

  let key = '';
  let maxWidth;
  let maxHeight;

  if (preset) {
    if (preset === 'thumb') {
      key = 'thumb';
      maxWidth = 128;
      maxHeight = 128;
    } else if (preset === 'preview') {
      key = 'preview';
      maxWidth = 1024;
      maxHeight = 768;
    } else {
      key = `preset_${preset}`;
      maxWidth = 512;
      maxHeight = 512;
    }
  } else {
    maxWidth = w ? Math.max(1, Math.min(4096, parseInt(w, 10))) : undefined;
    maxHeight = h ? Math.max(1, Math.min(4096, parseInt(h, 10))) : undefined;
    key = `w${maxWidth || ''}_h${maxHeight || ''}`;
  }

  const rendition = await getOrCreateRendition(image, key, { maxWidth, maxHeight, format: 'webp' });

  if (!rendition) return res.status(404).json({ error: 'Rendition not available' });

  res.setHeader('Content-Type', formatToMime(rendition.format));
  res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
  res.setHeader('Content-Length', String(rendition.bytes));
  return res.status(200).end(rendition.data);
};
