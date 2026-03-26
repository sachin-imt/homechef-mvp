const db = require('./_db');
const { handle } = require('./_helpers');

module.exports = handle(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  // Expects JSON body: { filename, contentType, base64 }
  const { filename, contentType, base64 } = req.body;
  if (!filename || !base64) {
    return res.status(400).json({ error: 'filename and base64 required' });
  }

  const buffer = Buffer.from(base64, 'base64');
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
