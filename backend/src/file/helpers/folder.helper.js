import { FRONTEND_URL } from '../../server.js';

export const TARGET_SIZES = [32, 64, 128, 256, 512];

export function parseMaybeJson(value) {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export const isObjectId = (v) => typeof v === 'string' && /^[a-f\d]{24}$/i.test(v);

export function isFrontendAssetUrl(url) {
  if (typeof url !== 'string') return false;
  const allowRel = url.startsWith('/uploads/') || url.startsWith('/assets/');
  const allowAbs = url.startsWith(`${FRONTEND_URL}/uploads/`) || url.startsWith(`${FRONTEND_URL}/assets/`);
  return allowRel || allowAbs;
}

export async function resolveIconRef(iconPayload) {
  if (!iconPayload) return null;

  const payload = typeof iconPayload === 'string' ? safeJson(iconPayload) : iconPayload;
  if (!payload) return null;

  const { imageId, url } = payload;

  if (imageId && url) {
    const err = new Error('Provide either icon.imageId or icon.url, not both');
    err.status = 400;
    throw err;
  }

  if (imageId) {
    if (!isObjectId(imageId)) {
      const err = new Error('icon.imageId must be a valid ObjectId string');
      err.status = 400;
      throw err;
    }
    const exists = await ImageModel.exists({ _id: imageId });
    if (!exists) {
      const err = new Error('icon.imageId not found');
      err.status = 400;
      throw err;
    }
    return { imageId, url: null };
  }

  if (url) {
    if (!isFrontendAssetUrl(url)) {
      const err = new Error('icon.url must point to frontend /uploads or /assets');
      err.status = 400;
      throw err;
    }
    return { imageId: null, url };
  }

  return null;
}

export function safeJson(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
