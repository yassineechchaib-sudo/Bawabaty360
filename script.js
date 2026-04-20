// script.js - Logic UI (Arabic only)

(function() {
  // Dark mode
  const darkToggle = document.getElementById('dark-toggle');
  const body = document.body;
  
  function initDarkMode() {
    const saved = localStorage.getItem('bawabaty360-dark');
    if (saved === 'true') {
      body.classList.add('dark-mode');
      darkToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }
  initDarkMode();
  
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      const isDark = body.classList.contains('dark-mode');
      localStorage.setItem('bawabaty360-dark', isDark);
      darkToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
  }

  // Sidebar
  const hamburger = document.getElementById('hamburger-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const closeBtn = document.getElementById('sidebar-close');
  
  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  if (hamburger) hamburger.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Scroll to top
  const scrollBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Font size
  const sizeBtns = document.querySelectorAll('.font-size-btn');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const size = btn.dataset.size;
      if (size === 'small') document.documentElement.style.fontSize = '14px';
      else if (size === 'large') document.documentElement.style.fontSize = '18px';
      else document.documentElement.style.fontSize = '16px';
    });
  });

  // Countdown update
  window.updateCountdowns = function() {
    document.querySelectorAll('[data-deadline]').forEach(el => {
      const deadline = new Date(el.dataset.deadline).getTime();
      const now = new Date().getTime();
      const diff = deadline - now;
      if (diff < 0) {
        el.textContent = 'انتهى';
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (86400000)) / (3600000));
      const minutes = Math.floor((diff % 3600000) / 60000);
      el.textContent = `${days}ي ${hours}س ${minutes}د`;
    });
  };
  setInterval(() => { if (window.updateCountdowns) window.updateCountdowns(); }, 60000);
})();

// Helper to render concours cards
function renderConcoursCard(article) {
  return `
    <div class="concours-card" data-article-id="${article.id}">
      <span class="card-badge">السلم ${article.echelle}</span>
      <h3 class="card-title">${article.title}</h3>
      <div class="card-meta"><i class="fas fa-building"></i> ${article.ministry}</div>
      <div class="card-meta"><i class="fas fa-users"></i> ${article.postes} منصب</div>
      <div class="deadline-countdown"><i class="fas fa-hourglass-half"></i> <span data-deadline="${article.deadline}">--</span></div>
      <a href="concours.html?id=${article.id}" class="detail-link">تفاصيل <i class="fas fa-arrow-left"></i></a>
    </div>
  `;
}

function renderPrivateCard(offer) {
  return `
    <div class="concours-card" data-offer-id="${offer.id}">
      <span class="card-badge">${offer.category}</span>
      <h3 class="card-title">${offer.title}</h3>
      <div class="card-meta"><i class="fas fa-building"></i> ${offer.company}</div>
      <div class="card-meta"><i class="fas fa-map-marker-alt"></i> ${offer.city}</div>
      <div class="card-meta"><i class="fas fa-briefcase"></i> ${offer.contract} · ${offer.level}</div>
      ${offer.salary ? `<div class="card-meta salary-info"><i class="fas fa-money-bill"></i> ${offer.salary} درهم</div>` : ''}
      <a href="#" class="detail-link" data-action="view-private-detail" data-id="${offer.id}">تفاصيل <i class="fas fa-arrow-left"></i></a>
    </div>
  `;
}

function renderSuggestionCard(article) {
  return `
    <div class="suggestion-card" data-article-id="${article.id}">
      <span class="card-badge">سلم ${article.echelle}</span>
      <h4 class="suggestion-title">${article.title}</h4>
      <div class="suggestion-meta">${article.ministry}</div>
      <a href="concours.html?id=${article.id}" class="detail-link">اقرأ المزيد <i class="fas fa-arrow-left"></i></a>
    </div>
  `;
}

function getSuggestedArticles(currentArticle) {
  const allArticles = window.concoursData;
  const suggested = [];
  const targetEchelles = [currentArticle.echelle];
  
  if (currentArticle.echelle > 6) {
    targetEchelles.push(currentArticle.echelle - 1);
  }
  
  for (let article of allArticles) {
    if (article.id === currentArticle.id) continue;
    if (targetEchelles.includes(article.echelle)) {
      suggested.push(article);
      if (suggested.length >= 4) break;
    }
  }
  return suggested;
}

// Index page init
function initIndex() {
  const container = document.getElementById('featured-cards-container');
  if (!container) return;
  const featured = window.concoursData.slice(0, 6);
  container.innerHTML = featured.map(renderConcoursCard).join('');
  window.updateCountdowns();
}

// Concours page
function initConcours() {
  createQuickNav();
  const data = window.concoursData.sort((a,b) => new Date(b.datePub) - new Date(a.datePub));
  
  const recentContainer = document.getElementById('recent-concours-container');
  if (recentContainer) recentContainer.innerHTML = data.map(renderConcoursCard).join('');
  
  function renderEchelle(echelle) {
    const container = document.getElementById(`echelle${echelle}-container`);
    if (container) {
      const filtered = data.filter(a => a.echelle === echelle);
      container.innerHTML = filtered.map(renderConcoursCard).join('');
    }
  }
  [6,8,9,10,11].forEach(renderEchelle);
  
  window.updateCountdowns();
  
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  if (articleId) {
    const article = data.find(a => a.id == articleId);
    if (article) {
      document.querySelectorAll('.concours-section').forEach(s => s.style.display = 'none');
      showArticleDetail(article);
      const backBtn = document.getElementById('back-to-list');
      if (backBtn) {
        backBtn.addEventListener('click', function() {
          window.location.href = 'concours.html';
        });
      }
    }
  }
  
  document.querySelectorAll('[data-action="view-detail"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.dataset.id;
      const article = data.find(a => a.id == id);
      if (article) showArticleDetail(article);
    });
  });
  
  const backBtn = document.getElementById('back-to-list');
  if (backBtn) backBtn.addEventListener('click', hideArticleDetail);
}

function showArticleDetail(article) {
  const section = document.getElementById('article-detail-section');
  const content = document.getElementById('article-detail-content');
  if (!section || !content) return;
  
  document.querySelectorAll('.concours-section').forEach(s => s.style.display = 'none');
  
  let regionalRows = '';
  if (article.regions) {
    regionalRows = Object.entries(article.regions).map(([r, nb]) => `<tr><td>${r}</td><td>${nb}</td></tr>`).join('');
  }
  
  const conditionsList = article.conditions ? article.conditions.map(c => `<li>${c}</li>`).join('') : '';
  const piecesList = article.pieces ? article.pieces.map(p => `<li>${p}</li>`).join('') : '';
  const notesList = article.notesImportantes ? article.notesImportantes.map(n => `<li>${n}</li>`).join('') : '';
  
  content.innerHTML = `
    <article class="article-detail">
      <div class="article-header">
        <h2>${article.fullTitle || article.title}</h2>
      </div>
      
      ${ (article.images && article.images.length > 0) ? `
  <div class="article-gallery">
    ${article.images.map(img => `
      <div class="gallery-item">
        <img src="${img}" alt="صورة من الإعلان" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'500\' viewBox=\'0 0 800 500\'%3E%3Crect width=\'800\' height=\'500\' fill=\'%23e2e8f0\'/%3E%3Ctext x=\'40\' y=\'40\' font-size=\'20\' fill=\'%23475569\'%3Eالصورة غير متوفرة%3C/text%3E%3C/svg%3E';">
      </div>
    `).join('')}
  </div>
` : (article.image ? `
  <div class="image-placeholder">
    <img src="${article.image}" alt="إعلان رسمي" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'500\' viewBox=\'0 0 800 500\'%3E%3Crect width=\'800\' height=\'500\' fill=\'%23e2e8f0\'/%3E%3Ctext x=\'40\' y=\'40\' font-size=\'20\' fill=\'%23475569\'%3Eالصورة غير متوفرة%3C/text%3E%3C/svg%3E';">
  </div>
` : `
  <div class="image-placeholder">
    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23e2e8f0'/%3E%3Ctext x='40' y='40' font-size='20' fill='%23475569'%3Eإعلان مباراة رسمي — ${article.ministry} — بختم رسمي%3C/text%3E%3C/svg%3E" alt="إعلان رسمي">
  </div>
`) }
      
     <!-- حاوية الإعلان الأول -->
<div class="ad-container"><div id="container-62aeec08f830e83a3e29d72c45206a0e"></div></div>
      
      <p class="intro-text">${article.introText || article.description}</p>
      
      <h3>شروط المشاركة</h3>
      <p>${article.conditionsIntro || 'يشترط في المترشحين توفر الشروط التالية:'}</p>
      <ul class="conditions-list">
        ${conditionsList}
      </ul>
      
      <h3>ملف الترشيح</h3>
      <p>${article.piecesIntro || 'يتكون ملف الترشيح من الوثائق التالية:'}</p>
      <ol class="pieces-list">
        ${piecesList}
      </ol>
      
      <h3>آخر أجل للتقديم</h3>
      <p>${article.deadlineIntro || 'يجب إيداع الترشيحات إلكترونياً قبل:'} <strong>${article.inscriptionFin}</strong>.</p>
      <div class="deadline-countdown"><i class="fas fa-hourglass-half"></i> <span data-deadline="${article.deadline}"></span></div>
      
      <p style="margin-top: 1.5rem;">
  📝 للتسجيل في المباراة، المرجو زيارة الرابط التالي: 
  <a href="${article.lienInscription || '#'}" target="_blank" class="text-link">منصة التسجيل الإلكتروني</a>
</p>

<h3>ملاحظات هامة</h3>
      <ul>
        ${notesList}
      </ul>
      
      <h3>مركز المباراة</h3>
      <p>${article.centreMabara || article.lieu}</p>
      
      <h3>طبيعة الاختبارات</h3>
      <p>${article.epreuves || 'تجرى المباراة على مرحلتين: اختبار كتابي واختبار شفوي. سيتم تحديد توقيت ومدة الاختبارات لاحقاً في الاستدعاءات الرسمية.'}</p>
      
      <h3>بعد الاختبار</h3>
      <p>${article.apresTest || 'سيتم الإعلان عن النتائج عبر الموقع الرسمي للوزارة ومنصة التشغيل العمومي. المقبولون سيتلقون استدعاءاتهم لاستكمال ملفات التعيين.'}</p>
      
      ${article.regions ? `
      <h3>التوزيع الجهوي للمناصب</h3>
      <table class="salary-table"><thead><tr><th>الجهة</th><th>عدد المناصب</th></tr></thead><tbody>${regionalRows}</tbody></table>
      ` : ''}
      
      <a href="${article.lienInscription || '#'}" class="btn btn-primary btn-large" target="_blank"><i class="fas fa-pen"></i> رابط التسجيل لاجتياز المباراة</a>
      
     <!-- حاوية الإعلان الثاني -->
<div class="ad-container"><div id="ad-slot-2"></div></div>
      
      <!-- أزرار المشاركة والنسخ -->
      <div class="share-actions">
        <span>شارك هذه المباراة:</span>
        <div class="share-buttons-bottom">
          <button class="share-btn facebook" id="share-facebook"><i class="fab fa-facebook-f"></i> فيسبوك</button>
          <button class="share-btn whatsapp" id="share-whatsapp"><i class="fab fa-whatsapp"></i> واتساب</button>
          <button class="share-btn copy" id="copy-link"><i class="fas fa-link"></i> نسخ الرابط</button>
        </div>
      </div>
      
      <!-- قسم الاقتراحات -->
      <section class="suggestions-section">
        <h3><i class="fas fa-lightbulb"></i> قد يهمك أيضاً</h3>
        <div class="suggestions-grid" id="suggestions-container"></div>
      </section>
    </article>
  `;
  section.style.display = 'block';
  
  // تحميل الإعلانات ديناميكيًا
  loadArticleAds();
  
  // ملء الاقتراحات
  const suggestionsContainer = document.getElementById('suggestions-container');
  if (suggestionsContainer) {
    const suggestions = getSuggestedArticles(article);
    suggestionsContainer.innerHTML = suggestions.map(renderSuggestionCard).join('');
  }
  
  // إضافة وظائف المشاركة ونسخ الرابط
  const currentUrl = window.location.href;
  const fbBtn = document.getElementById('share-facebook');
  const waBtn = document.getElementById('share-whatsapp');
  const copyBtn = document.getElementById('copy-link');
  
  if (fbBtn) fbBtn.addEventListener('click', () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  });
  if (waBtn) waBtn.addEventListener('click', () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + currentUrl)}`, '_blank');
  });
  if (copyBtn) copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert('تم نسخ الرابط إلى الحافظة');
    });
  });
  
  window.updateCountdowns();
}

// دالة تحميل إعلانات Adsterra ديناميكيًا
function loadArticleAds() {
  // الإعلان الأول (Native Banner) - يستخدم المعرف الأصلي من Adsterra
  const adContainer1 = document.getElementById('container-62aeec08f830e83a3e29d72c45206a0e');
  if (adContainer1 && !document.getElementById('ad-script-1')) {
    const script1 = document.createElement('script');
    script1.id = 'ad-script-1';
    script1.async = true;
    script1.setAttribute('data-cfasync', 'false');
    script1.src = 'https://pl29205519.profitablecpmratenetwork.com/62aeec08f830e83a3e29d72c45206a0e/invoke.js';
    document.body.appendChild(script1);
  }

  // الإعلان الثاني (Banner) - يحتاج إلى معرف محدد و atOptions
  const adContainer2 = document.getElementById('ad-slot-2');
  if (adContainer2 && !document.getElementById('ad-script-2')) {
    // تأكد من تعريف atOptions قبل تحميل السكربت
    window.atOptions = {
      'key': 'fe793f89cc48b4ba3cf3e5271b60bfcd',
      'format': 'iframe',
      'height': 250,
      'width': 300,
      'params': {}
    };
    const script2 = document.createElement('script');
    script2.id = 'ad-script-2';
    script2.src = 'https://www.highperformanceformat.com/fe793f89cc48b4ba3cf3e5271b60bfcd/invoke.js';
    document.body.appendChild(script2);
  }
}

function hideArticleDetail() {
  document.querySelectorAll('.concours-section').forEach(s => s.style.display = 'block');
  document.getElementById('article-detail-section').style.display = 'none';
}

// Emplois supérieurs
function initEmploisSuperieurs() {
  const container = document.getElementById('emplois-superieurs-container');
  if (!container) return;
  container.innerHTML = window.emploisSuperieursData.map(renderConcoursCard).join('');
  window.updateCountdowns();
  
  document.querySelectorAll('[data-action="view-detail"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const article = window.emploisSuperieursData.find(a => a.id == link.dataset.id);
      if (article) showArticleDetail(article);
    });
  });
  document.getElementById('back-to-list-sup')?.addEventListener('click', hideArticleDetail);
}

// Postes responsabilité
function initPostesResponsabilite() {
  const container = document.getElementById('postes-responsabilite-container');
  if (!container) return;
  container.innerHTML = window.postesRespData.map(renderConcoursCard).join('');
  window.updateCountdowns();
  
  document.querySelectorAll('[data-action="view-detail"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const article = window.postesRespData.find(a => a.id == link.dataset.id);
      if (article) showArticleDetail(article);
    });
  });
  document.getElementById('back-to-list-resp')?.addEventListener('click', hideArticleDetail);
}

// Secteur Privé
function initSecteurPrive() {
  const container = document.getElementById('private-offers-container');
  if (!container) return;
  const renderFiltered = () => {
    const cat = document.getElementById('filter-category')?.value || 'all';
    const level = document.getElementById('filter-level')?.value || 'all';
    const contract = document.getElementById('filter-contract')?.value || 'all';
    const filtered = window.privateOffers.filter(o => 
      (cat === 'all' || o.category === cat) &&
      (level === 'all' || o.level === level) &&
      (contract === 'all' || o.contract === contract)
    );
    container.innerHTML = filtered.map(renderPrivateCard).join('');
    attachPrivateDetailEvents();
  };
  renderFiltered();
  ['filter-category','filter-level','filter-contract'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', renderFiltered);
  });
}

function attachPrivateDetailEvents() {
  document.querySelectorAll('[data-action="view-private-detail"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const offer = window.privateOffers.find(o => o.id == link.dataset.id);
      if (offer) showPrivateDetail(offer);
    });
  });
  document.getElementById('back-to-list-private')?.addEventListener('click', () => {
    document.querySelectorAll('.filters-bar, #private-offers-container').forEach(el => el.style.display = '');
    document.getElementById('article-detail-section').style.display = 'none';
  });
}

function showPrivateDetail(offer) {
  const section = document.getElementById('article-detail-section');
  const content = document.getElementById('article-detail-content-private');
  document.querySelector('.filters-bar').style.display = 'none';
  document.getElementById('private-offers-container').style.display = 'none';
  
  content.innerHTML = `
    <article class="article-detail">
      <h2>${offer.fullTitle}</h2>
      <p><strong>${offer.company}</strong> · ${offer.city}</p>
      <p>${offer.description}</p>
      <p><strong>الملف المطلوب:</strong> ${offer.profile}</p>
      <p><strong>نوع العقد:</strong> ${offer.contract} · ${offer.level}</p>
      <p><strong>الأجر المقترح:</strong> ${offer.salary} درهم</p>
      <a href="#" class="btn btn-primary">تقديم الطلب</a>
    </article>
  `;
  section.style.display = 'block';
}

// Salaires
function initSalaires() {
  const tbody = document.getElementById('salary-table-body');
  if (!tbody) return;
  tbody.innerHTML = window.salaryData.map(s => `
    <tr><td>${s.echelle}</td><td>${s.grade}</td><td>${s.indice}</td><td>${s.brut}</td><td>${s.primes}</td></tr>
  `).join('');
}

// Calendrier
function initCalendrier() {
  const container = document.getElementById('calendar-container');
  if (!container) return;
  const months = ['يناير','فبراير','مارس','أبريل','ماي','يونيو','يوليوز','غشت','شتنبر','أكتوبر','نونبر','دجنبر'];
  let html = '';
  window.calendarData.forEach(month => {
    html += `<div class="calendar-month"><h3>${months[month.month-1]} 2026</h3>`;
    month.events.forEach(ev => html += `<div class="event-item"><strong>${ev.title}</strong><br>${ev.date} - ${ev.lieu}</div>`);
    html += '</div>';
  });
  container.innerHTML = html;
}

// FAQ
function initFAQ() {
  const container = document.getElementById('faq-container');
  if (!container) return;
  container.innerHTML = window.faqData.map(q => `
    <div class="faq-item"><h3>${q.question}</h3><p>${q.answer}</p></div>
  `).join('');
}

// إنشاء قائمة التنقل السريع في صفحة المباريات
function createQuickNav() {
  const main = document.querySelector('.concours-page');
  if (!main) return;
  
  const navHtml = `
    <div class="quick-nav">
      <span class="quick-nav-label">انتقل إلى:</span>
      <div class="quick-nav-links">
        <a class="quick-nav-link" data-scroll-to="recent">العروض الأخيرة</a>
        <a class="quick-nav-link" data-scroll-to="echelle6">السلم 6</a>
        <a class="quick-nav-link" data-scroll-to="echelle8">السلم 8</a>
        <a class="quick-nav-link" data-scroll-to="echelle9">السلم 9</a>
        <a class="quick-nav-link" data-scroll-to="echelle10">السلم 10</a>
        <a class="quick-nav-link" data-scroll-to="echelle11">السلم 11</a>
      </div>
    </div>
  `;
  
  main.insertAdjacentHTML('afterbegin', navHtml);
  
  document.querySelector('[data-scroll-to="recent"]').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.concours-section:first-of-type').scrollIntoView({ behavior: 'smooth' });
  });
  document.querySelector('[data-scroll-to="echelle6"]').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('echelle6-container').closest('.concours-section').scrollIntoView({ behavior: 'smooth' });
  });
  document.querySelector('[data-scroll-to="echelle8"]').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('echelle8-container').closest('.concours-section').scrollIntoView({ behavior: 'smooth' });
  });
  document.querySelector('[data-scroll-to="echelle9"]').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('echelle9-container').closest('.concours-section').scrollIntoView({ behavior: 'smooth' });
  });
  document.querySelector('[data-scroll-to="echelle10"]').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('echelle10-container').closest('.concours-section').scrollIntoView({ behavior: 'smooth' });
  });
  document.querySelector('[data-scroll-to="echelle11"]').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('echelle11-container').closest('.concours-section').scrollIntoView({ behavior: 'smooth' });
  });
}

// Expose init functions
window.initIndex = initIndex;
window.initConcours = initConcours;
window.initEmploisSuperieurs = initEmploisSuperieurs;
window.initPostesResponsabilite = initPostesResponsabilite;
window.initSecteurPrive = initSecteurPrive;
window.initSalaires = initSalaires;
window.initCalendrier = initCalendrier;
window.initFAQ = initFAQ;
