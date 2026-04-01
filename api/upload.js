const db = require('./_db');
const { handle, requireAuth } = require('./_helpers');

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

module.exports = handle(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  if (!requireAuth(req, res)) return;

  // Expects JSON body: { filename, contentType, base64 }
  const { filename, contentType, base64 } = req.body;
  if (!filename || !base64) {
    return res.status(400).json({ error: 'filename and base64 required' });
  }

  // Validate content type
  const mime = (contentType || '').toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.includes(mime)) {
    return res.status(400).json({ error: 'Only image files are allowed.' });
  }

  const buffer = Buffer.from(base64, 'base64');

  // Server-side size check
  if (buffer.length > MAX_BYTES) {
    return res.status(400).json({ error: 'Image exceeds 2 MB limit.' });
  }
  const path = `${Date.now()}-${filename}`;

  const { data, error } = await db.storage
    .from('images')
    .upload(path, buffer, {
      contentType: contentType || 'image/jpeg',
      upsert: false,
    });

  if (error) return res.status(500).json({ error: error.message });

  const { data: urlData } = db.storage.from('images').getPublicUrl(path);
  return res.json({ url: urlData.publicUrl });
});
