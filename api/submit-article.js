/* ══════════════════════════════════════════
   API: submit-article.js
   Vercel Serverless Function
   POST /api/submit-article
═══════════════════════════════════════════ */
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, author, summary, content, category } = req.body;

    // Validate required fields
    if (!title || !author || !summary || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Basic sanitization - strip HTML tags
    const sanitize = str => String(str || '').replace(/<[^>]*>/g, '').trim().slice(0, 5000);

    const article = {
      id: 'news-' + Date.now(),
      title:    sanitize(title).slice(0, 200),
      author:   sanitize(author).slice(0, 100),
      summary:  sanitize(summary).slice(0, 300),
      content:  sanitize(content),
      category: ['thong-bao','lich-thi','thanh-tich','hoat-dong','khac'].includes(category) ? category : 'khac',
      status:   'pending',
      createdAt: new Date().toISOString(),
    };

    // In production: store in Vercel KV or send email notification
    // For now, log it (you can connect Vercel KV or a webhook here)
    console.log('New article submission:', article);

    // Example: Send to a webhook (uncomment and configure)
    // await fetch(process.env.WEBHOOK_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(article)
    // });

    return res.status(200).json({ 
      success: true, 
      message: 'Bài viết đã được gửi và đang chờ duyệt',
      id: article.id
    });

  } catch (err) {
    console.error('Submit error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
