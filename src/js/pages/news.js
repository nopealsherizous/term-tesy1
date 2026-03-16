/* ══════════════════════════════════════════
   NEWS Page
═══════════════════════════════════════════ */
import { store } from '../core/store.js';

const $ = id => document.getElementById(id);

const CAT_LABELS = {
  'thong-bao':'Thông báo', 'lich-thi':'Lịch thi', 'thanh-tich':'Thành tích',
  'hoat-dong':'Hoạt động', 'khac':'Khác',
};

export function renderNews() {
  const el = $('viewNews');
  if (!el) return;
  const published = store.news.filter(n => n.status === 'published');
  if (!published.length) {
    el.innerHTML = `<div class="no-rows"><div class="no-rows-ico">📰</div><h3>Chưa có tin tức</h3><p>Hãy quay lại sau!</p></div>`;
    return;
  }
  el.innerHTML = `<div class="news-grid">${published.map(n => `
    <div class="news-card anim-fade" onclick="app.navigate('/news/${n.id}')">
      <span class="news-cat">${CAT_LABELS[n.category] || 'Tin tức'}</span>
      <div class="news-title">${n.title}</div>
      <div class="news-summary">${n.summary}</div>
      <div class="news-meta">
        <span class="news-author">✍️ ${n.author}</span>
        <span>${new Date(n.createdAt).toLocaleDateString('vi')}</span>
      </div>
    </div>`).join('')}</div>`;
}

export function renderNewsDetail(id) {
  const el = $('viewNewsDetail');
  if (!el) return;
  const n = store.news.find(x => x.id === id);
  if (!n) {
    el.innerHTML = `<div class="no-rows"><div class="no-rows-ico">❌</div><h3>Không tìm thấy bài viết</h3></div>`;
    return;
  }
  el.innerHTML = `
    <button class="news-detail-back" onclick="app.navigate('/news')">← Quay lại tin tức</button>
    <div class="news-detail-card">
      <span class="news-cat">${CAT_LABELS[n.category] || 'Tin tức'}</span>
      <div class="news-detail-title">${n.title}</div>
      <div class="news-detail-meta">
        <span>✍️ ${n.author}</span>
        <span>📅 ${new Date(n.createdAt).toLocaleDateString('vi', {year:'numeric',month:'long',day:'numeric'})}</span>
      </div>
      <div class="news-detail-content">${n.content}</div>
    </div>`;
}

export function renderSubmit() {
  const el = $('viewSubmit');
  if (!el) return;
  el.innerHTML = `
    <div class="submit-card">
      <h2>✍️ Gửi bài viết</h2>
      <p class="sub-desc">Bài viết của bạn sẽ được admin duyệt trước khi đăng.</p>
      <div class="form-group">
        <label class="form-label">Tiêu đề bài viết *</label>
        <input type="text" id="sub-title" class="form-input" placeholder="Nhập tiêu đề..." maxlength="200">
      </div>
      <div class="form-group">
        <label class="form-label">Tác giả *</label>
        <input type="text" id="sub-author" class="form-input" placeholder="Tên của bạn..." maxlength="100">
      </div>
      <div class="form-group">
        <label class="form-label">Danh mục</label>
        <select id="sub-cat" class="form-select">
          <option value="thong-bao">Thông báo</option>
          <option value="hoat-dong">Hoạt động</option>
          <option value="thanh-tich">Thành tích</option>
          <option value="khac">Khác</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Tóm tắt *</label>
        <input type="text" id="sub-summary" class="form-input" placeholder="Tóm tắt ngắn gọn (1-2 câu)..." maxlength="300">
      </div>
      <div class="form-group">
        <label class="form-label">Nội dung *</label>
        <textarea id="sub-content" class="form-textarea" placeholder="Nhập nội dung bài viết..."></textarea>
      </div>
      <button class="form-submit" onclick="app.submitArticle()">📨 Gửi bài viết</button>
    </div>`;
}

export function handleSubmitArticle() {
  const title   = $('sub-title')?.value.trim();
  const author  = $('sub-author')?.value.trim();
  const summary = $('sub-summary')?.value.trim();
  const content = $('sub-content')?.value.trim();
  const cat     = $('sub-cat')?.value || 'khac';

  if (!title || !author || !summary || !content) {
    alert('Vui lòng điền đầy đủ thông tin bắt buộc (*)');
    return;
  }

  const article = { title, author, summary, content, category: cat, status: 'pending', createdAt: new Date().toISOString() };

  // Show success (in production, send to API)
  const el = $('viewSubmit');
  if (el) {
    el.innerHTML = `
      <div class="submit-card">
        <div class="submit-success">
          <div class="ss-icon">✅</div>
          <h3>Gửi bài thành công!</h3>
          <p>Bài viết "<strong>${title}</strong>" của bạn đã được gửi đi và đang chờ admin duyệt. Cảm ơn bạn đã đóng góp!</p>
          <button onclick="app.navigate('/news')" style="margin-top:16px;padding:9px 20px;border-radius:var(--r);border:none;background:var(--red);color:#fff;font-size:13px;font-weight:700;cursor:pointer">← Quay lại tin tức</button>
        </div>
      </div>`;
  }
  console.log('Article submitted (pending):', article);
}
