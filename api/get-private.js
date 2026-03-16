/* ══════════════════════════════════════════
   API: get-private.js
   Vercel Serverless Function
   GET /api/get-private?stt=123&key=YOUR_KEY

   Bảo vệ dữ liệu nhạy cảm (CMND, SĐT)
   Chỉ cho phép truy cập với đúng ADMIN_KEY
═══════════════════════════════════════════ */
import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check admin key (set ADMIN_KEY in Vercel Environment Variables)
  const ADMIN_KEY = process.env.ADMIN_KEY;
  if (!ADMIN_KEY) {
    return res.status(503).json({ error: 'Admin key not configured' });
  }

  const { key, stt } = req.query;
  if (!key || key !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    // Read private data file
    const filePath = join(process.cwd(), 'data', 'private', 'students-private.json');
    const raw = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    if (stt) {
      // Return single student private data
      const student = data.hocSinh.find(s => String(s.stt) === String(stt));
      if (!student) return res.status(404).json({ error: 'Student not found' });
      
      // Remove the note field
      const { note, ...clean } = student;
      return res.status(200).json({ student: clean });
    }

    // Return all (admin only)
    return res.status(200).json({ 
      total: data.hocSinh.length,
      hocSinh: data.hocSinh 
    });

  } catch (err) {
    console.error('Get private error:', err);
    return res.status(500).json({ error: 'Cannot read private data' });
  }
}
