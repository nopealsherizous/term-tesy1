/* ══════════════════════════════════════════
   HOME Page
═══════════════════════════════════════════ */
import { store } from '../core/store.js';

const $ = id => document.getElementById(id);

export function renderHome() {
  const el = $('viewHome');
  if (!el) return;
  const now    = new Date();
  const dd     = String(now.getDate()).padStart(2,'0');
  const mm     = String(now.getMonth()+1).padStart(2,'0');
  const today  = store.ALL.filter(s => { const p=(s.ngaySinh||'').split('/'); return p.length>=2&&p[0]===dd&&p[1]===mm; });
  const k10    = store.ALL.filter(s=>s.lop?.startsWith('10')).length;
  const k11    = store.ALL.filter(s=>s.lop?.startsWith('11')).length;
  const k12    = store.ALL.filter(s=>s.lop?.startsWith('12')).length;
  const nam    = store.ALL.filter(s=>s.gioiTinh==='Nam').length;
  const nu     = store.ALL.filter(s=>s.gioiTinh==='Nữ').length;
  const lops   = new Set(store.ALL.map(s=>s.lop).filter(Boolean));
  const recentNews = store.news.filter(n=>n.status==='published').slice(0,3);

  el.innerHTML = `
    <div style="max-width:900px">
      <div style="margin-bottom:16px;animation:fadeUp .3s ease both">
        <div style="font-family:'Lexend Deca',sans-serif;font-size:22px;font-weight:900;color:var(--t1);margin-bottom:4px">🏫 THPT Cẩm Bình</div>
        <div style="font-size:13px;color:var(--t3)">Năm học ${store.meta?.namHoc || '2025-2026'} · Cổng thông tin học sinh</div>
      </div>

      <div class="home-stat-row" style="margin-bottom:16px">
        ${[
          {n:store.ALL.length,l:'Học sinh',c:'var(--red)'},
          {n:lops.size,l:'Lớp học',c:'var(--gold2)'},
          {n:nam,l:'Nam',c:'var(--blue)'},
          {n:nu,l:'Nữ',c:'var(--pink)'},
          {n:k10,l:'Khối 10',c:'var(--blue)'},
          {n:k11,l:'Khối 11',c:'var(--green)'},
          {n:k12,l:'Khối 12',c:'#8a1a0a'},
        ].map(t=>`<div class="home-stat-tile"><div class="home-stat-n" style="color:${t.c}">${t.n.toLocaleString('vi')}</div><div class="home-stat-l">${t.l}</div></div>`).join('')}
      </div>

      <div class="home-grid">
        <div class="home-card">
          <h3>🎂 Sinh nhật hôm nay</h3>
          ${today.length === 0
            ? '<p style="color:var(--t4);font-size:13px">Không có sinh nhật hôm nay</p>'
            : `<div class="home-bd-list">${today.map(s=>`<div class="home-bd-item" onclick="app.showDetail(${s.stt})"><span class="home-bd-icon">🎂</span><span class="home-bd-name">${s.hoTen}</span><span class="home-bd-lop">${s.lop||''}</span></div>`).join('')}</div>`
          }
          ${today.length > 0 ? `<div style="margin-top:8px;font-size:11px;color:var(--t4)">${today.length} bạn có sinh nhật hôm nay!</div>` : ''}
        </div>

        <div class="home-card">
          <h3>📰 Tin mới nhất</h3>
          ${recentNews.length === 0
            ? '<p style="color:var(--t4);font-size:13px">Chưa có tin tức</p>'
            : `<div class="home-news-list">${recentNews.map(n=>`<div class="home-news-item" onclick="app.navigate('/news/${n.id}')"><div class="home-news-title">${n.title}</div><div class="home-news-meta">${n.author} · ${new Date(n.createdAt).toLocaleDateString('vi')}</div></div>`).join('')}</div>`
          }
          <button onclick="app.navigate('/news')" style="margin-top:10px;width:100%;padding:7px;border-radius:var(--rs);border:1.5px solid var(--border);background:var(--surface2);color:var(--t2);font-size:12px;font-weight:600;cursor:pointer">Xem tất cả tin →</button>
        </div>

        <div class="home-card">
          <h3>⚡ Truy cập nhanh</h3>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${[
              {icon:'🔍',label:'Tìm kiếm học sinh',fn:"app.navigate('/students')"},
              {icon:'🎂',label:'Lịch sinh nhật',fn:"app.navigate('/birthdays')"},
              {icon:'📊',label:'Thống kê trường',fn:"app.navigate('/stats')"},
              {icon:'📰',label:'Tin tức',fn:"app.navigate('/news')"},
              {icon:'✍️',label:'Gửi bài viết',fn:"app.navigate('/submit')"},
            ].map(i=>`<button onclick="${i.fn}" style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:var(--rs);border:1.5px solid var(--border);background:var(--surface2);color:var(--t1);font-size:13px;font-weight:500;cursor:pointer;transition:background .15s;text-align:left" onmouseover="this.style.background='rgba(192,57,43,.06)'" onmouseout="this.style.background='var(--surface2)'">${i.icon} ${i.label}</button>`).join('')}
          </div>
        </div>

        <div class="home-card">
          <h3>📅 Sinh nhật tháng này</h3>
          ${(() => {
            const thisMonth = store.ALL.filter(s=>{const p=(s.ngaySinh||'').split('/');return p.length>=2&&parseInt(p[1])===(now.getMonth()+1);}).sort((a,b)=>{const pa=a.ngaySinh.split('/'),pb=b.ngaySinh.split('/');return parseInt(pa[0])-parseInt(pb[0]);}).slice(0,8);
            return thisMonth.length === 0
              ? '<p style="color:var(--t4);font-size:13px">Không có sinh nhật trong tháng</p>'
              : `<div class="home-bd-list">${thisMonth.map(s=>`<div class="home-bd-item" onclick="app.showDetail(${s.stt})"><span style="font-size:12px;color:var(--t3);min-width:28px">${s.ngaySinh.split('/')[0]}/${s.ngaySinh.split('/')[1]}</span><span class="home-bd-name" style="font-size:12px">${s.hoTen}</span><span class="home-bd-lop">${s.lop||''}</span></div>`).join('')}</div><button onclick="app.navigate('/birthdays')" style="margin-top:8px;width:100%;padding:6px;border-radius:var(--rs);border:1.5px solid var(--border);background:var(--surface2);color:var(--t2);font-size:12px;font-weight:600;cursor:pointer">Xem tất cả →</button>`;
          })()}
        </div>
      </div>
    </div>`;
}
