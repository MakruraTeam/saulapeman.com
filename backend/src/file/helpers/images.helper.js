import sharp from 'sharp';
import ImageModel from '../schemas/images.schema';

export function formatToMime(fmt) {
  switch ((fmt || '').toLowerCase()) {
    case 'webp':
      return 'image/webp';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'avif':
      return 'image/avif';
    default:
      return 'application/octet-stream';
  }
}

export async function createImageFromBuffer(buf, mime) {
  const meta = await sharp(buf).metadata();
  const doc = await ImageModel.create({
    original: {
      data: buf,
      contentType: mime,
      bytes: buf.length,
      width: meta.width || null,
      height: meta.height || null,
      format: (meta.format === 'jpeg' ? 'jpg' : meta.format) || undefined,
    },
    renditions: [],
  });
  return doc;
}

export async function getOrCreateRendition(image, key, opts) {
  if (image.externalUrl) return null;

  const existing = (image.renditions || []).find((r) => r.key === key);
  if (existing) return existing;

  const { maxWidth, maxHeight, format = 'webp' } = opts;
  const pipeline = sharp(image.original.data).resize({
    width: maxWidth,
    height: maxHeight,
    fit: 'inside',
    withoutEnlargement: true,
  });

  const buf =
    format === 'webp'
      ? await pipeline.webp({ quality: 85 }).toBuffer()
      : format === 'jpeg'
      ? await pipeline.jpeg({ quality: 85 }).toBuffer()
      : await pipeline.png().toBuffer();

  const meta = await sharp(buf).metadata();
  const rendition = {
    key,
    data: buf,
    width: meta.width || null,
    height: meta.height || null,
    format,
    bytes: buf.length,
  };

  image.renditions.push(rendition);
  await image.save();

  return rendition;
}
