import { BRAND_INFO, SERVICE_CATEGORIES, SERVICES, getWhatsappLink, getServiceBySlug } from './data/services.js';

// Global State
let currentCategory = 'all';
let currentSearchQuery = '';

// Icons helper
function getIconHtml(iconName) {
  const iconMap = {
    'car': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>',
    'shield-check': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
    'truck': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
    'alert-circle': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    'heart': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    'zap': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    'sun': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
    'users': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'file-text': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>',
    'clipboard': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>',
    'book-open': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    'feather': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>',
    'user-check': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>',
    'award': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
    'target': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    'credit-card': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
    'copy': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    'file-check': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 12 18 17 13"/></svg>',
    'check-circle': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    'layers': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    'whatsapp': '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.476-.15-.677.15-.2.301-.777.98-.952 1.18-.176.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.783-1.676-2.083-.175-.3-.019-.462.132-.612.135-.135.301-.351.451-.527.15-.175.2-.3.3-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.235-.244-.588-.492-.508-.677-.518l-.577-.01c-.2 0-.527.075-.802.376s-1.054 1.03-1.054 2.511 1.08 2.912 1.23 3.113c.15.201 2.126 3.246 5.151 4.553.72.31 1.282.496 1.72.635.723.23 1.38.198 1.9.12.58-.087 1.78-.727 2.03-1.43.25-.703.25-1.305.175-1.43-.075-.125-.276-.2-.577-.35zM12 2C6.477 2 2 6.477 2 12c0 1.892.525 3.663 1.438 5.178L2 22l4.97-1.398A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>'
  };

  return iconMap[iconName] || iconMap['file-text'];
}

// Render Service Card
function renderServiceCard(service) {
  const waUrl = getWhatsappLink(service.whatsappMessage);
  return `
    <article class="service-card" data-category="${service.category}" id="card-${service.slug}">
      <div class="card-top">
        <div class="card-header-meta">
          <div class="card-icon-box">
            ${getIconHtml(service.icon)}
          </div>
          <span class="card-category-tag">${service.categoryName}</span>
        </div>
        <h3 class="card-title">${service.name}</h3>
        <p class="card-desc">${service.shortDescription}</p>
      </div>
      <div class="card-actions">
        <button class="btn-card-docs" onclick="openServiceDetail('${service.slug}')" aria-label="View required documents for ${service.name}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Req. Docs
        </button>
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-wa" aria-label="Contact now on WhatsApp for ${service.name}">
          ${getIconHtml('whatsapp')}
          CONTACT NOW
        </a>
      </div>
    </article>
  `;
}

// Render Home View
function renderHomeView() {
  const filtered = filterServices();
  
  return `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-glow"></div>
      <div class="container hero-grid">
        <div class="hero-content">
          <div class="hero-tag">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
            Trustworthy Documentation Assistance
          </div>
          <h1 class="hero-title">
            Documentation Ka Kaam?<br/>
            <span class="highlight">DASTAVEZ MITRA</span> Se Sampark Kijiye.
          </h1>
          <p class="hero-subtitle">
            ${BRAND_INFO.subheading}
          </p>

          <div class="hero-cta-group">
            <a href="${getWhatsappLink()}" target="_blank" rel="noopener noreferrer" class="btn-primary-wa">
              ${getIconHtml('whatsapp')}
              CONTACT NOW
            </a>
            <a href="#/services" class="btn-secondary">
              VIEW ALL SERVICES
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>

          <div class="hero-highlights">
            <div class="highlight-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Direct WhatsApp Contact: <strong>${BRAND_INFO.whatsappNumber}</strong></span>
            </div>
            <div class="highlight-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Document Guidance</span>
            </div>
            <div class="highlight-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Convenient Process</span>
            </div>
          </div>
        </div>

        <!-- Hero Card Preview -->
        <div class="hero-card-preview">
          <div class="preview-header">
            <div>
              <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--color-primary);">Quick Service Finder</h3>
              <p style="font-size: 0.8rem; color: var(--color-text-muted);">Popular documentation assistance</p>
            </div>
            <span class="preview-status"><span class="status-dot"></span> Online</span>
          </div>

          <div class="preview-service-list">
            <a href="#/services/rc-transfer" class="preview-service-item">
              <span>🚗 RC Transfer & Vehicle Paperwork</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </a>
            <a href="#/services/marriage-registration" class="preview-service-item">
              <span>💍 Marriage Registration Assistance</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </a>
            <a href="#/services/affidavit" class="preview-service-item">
              <span>📜 Affidavit & Agreement Drafting</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </a>
            <a href="#/services/traffic-challan" class="preview-service-item">
              <span>🚦 Traffic Challan Assistance</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          </div>

          <div class="preview-wa-direct">
            <p>Need urgent documentation help?</p>
            <a href="${getWhatsappLink()}" target="_blank" rel="noopener noreferrer" class="preview-phone-btn">
              ${getIconHtml('whatsapp')}
              WhatsApp ${BRAND_INFO.whatsappNumber}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid Section -->
    <section class="section" id="services-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Explore Services</span>
          <h2 class="section-title">All Documentation & Assistance Services</h2>
          <p class="section-subtitle">Select your service below to view required documents or connect directly on WhatsApp.</p>
        </div>

        <div class="filter-controls-wrapper">
          <div class="search-box-container">
            <span class="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <input 
              type="text" 
              id="serviceSearchInput" 
              class="search-input" 
              placeholder="Search services (e.g. RC Transfer, Marriage, Affidavit, Challan, DL...)"
              value="${currentSearchQuery}"
              oninput="handleSearchChange(this.value)"
            />
          </div>

          <div class="category-chips">
            ${SERVICE_CATEGORIES.map(cat => `
              <button 
                class="category-chip ${currentCategory === cat.id ? 'active' : ''}" 
                onclick="handleCategoryChange('${cat.id}')">
                ${cat.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="services-grid" id="servicesGrid">
          ${filtered.length > 0 ? filtered.map(renderServiceCard).join('') : `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: var(--radius-lg); border: 1px dashed var(--color-border);">
              <p style="font-size: 1.1rem; color: var(--color-text-muted); margin-bottom: 1rem;">No services match your search query: "<strong>${currentSearchQuery}</strong>"</p>
              <button class="btn-secondary" onclick="resetFilters()">Clear Filters</button>
            </div>
          `}
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="section how-it-works-section" id="how-it-works">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Simple & Transparent</span>
          <h2 class="section-title">How DASTAVEZ MITRA Works</h2>
          <p class="section-subtitle">4 easy steps to get your documentation paperwork assisted smoothly.</p>
        </div>

        <div class="steps-grid">
          <div class="step-card">
            <div class="step-badge">1</div>
            <h3 class="step-title">Choose Your Service</h3>
            <p class="step-desc">Browse through our 20+ documentation service categories and select the paperwork you need help with.</p>
          </div>

          <div class="step-card">
            <div class="step-badge">2</div>
            <h3 class="step-title">Check Required Documents</h3>
            <p class="step-desc">Click "Req. Docs" to review the basic guidelines and document checklist before proceeding.</p>
          </div>

          <div class="step-card">
            <div class="step-badge">3</div>
            <h3 class="step-title">Contact DASTAVEZ MITRA</h3>
            <p class="step-desc">Click "CONTACT NOW" to open a pre-filled WhatsApp conversation directly with our team.</p>
          </div>

          <div class="step-card">
            <div class="step-badge">4</div>
            <h3 class="step-title">Get Assistance</h3>
            <p class="step-desc">Receive clear guidance, form preparation help, and step-by-step assistance until completion.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Why Choose Us</span>
          <h2 class="section-title">Why DASTAVEZ MITRA</h2>
          <p class="section-subtitle">Dedicated assistance designed to make documentation simple, fast, and accessible.</p>
        </div>

        <div class="why-grid">
          <div class="why-card">
            <div class="why-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="why-content">
              <h4>Documentation Assistance</h4>
              <p>Specialized assistance across vehicle, personal, and commercial documentation requirements.</p>
            </div>
          </div>

          <div class="why-card">
            <div class="why-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="why-content">
              <h4>Easy WhatsApp Contact</h4>
              <p>Instant 1-click WhatsApp messaging at 9871592002 with pre-filled service details.</p>
            </div>
          </div>

          <div class="why-card">
            <div class="why-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="why-content">
              <h4>Service-Specific Guidance</h4>
              <p>Structured guidelines for forms, affidavits, and filing workflows for your specific case.</p>
            </div>
          </div>

          <div class="why-card">
            <div class="why-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="why-content">
              <h4>Convenient Process</h4>
              <p>Save time and avoid hassle with step-by-step guidance right on your phone.</p>
            </div>
          </div>

          <div class="why-card">
            <div class="why-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="why-content">
              <h4>Multiple Documentation Services</h4>
              <p>From RTO/RTA and marriages to affidavits, agreements, and power of attorney — all in one place.</p>
            </div>
          </div>

          <div class="why-card">
            <div class="why-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="why-content">
              <h4>Social Presence</h4>
              <p>Follow our updates and tips on Instagram @dastavezmitra and Facebook.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick WhatsApp Action Banner -->
    <section class="container" style="margin-bottom: 4rem;">
      <div style="background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light)); color: white; border-radius: var(--radius-xl); padding: 2.5rem 1.5rem; text-align: center; box-shadow: var(--shadow-lg);">
        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem;">Have a Question Regarding Any Document?</h2>
        <p style="font-size: 1rem; opacity: 0.9; margin-bottom: 1.5rem; max-width: 600px; margin-left: auto; margin-right: auto;">Message DASTAVEZ MITRA on WhatsApp directly for quick consultation and document verification.</p>
        <a href="${getWhatsappLink()}" target="_blank" rel="noopener noreferrer" class="btn-primary-wa" style="font-size: 1.05rem; padding: 0.9rem 2rem;">
          ${getIconHtml('whatsapp')}
          CONTACT NOW ON WHATSAPP: ${BRAND_INFO.whatsappNumber}
        </a>
      </div>
    </section>
  `;
}

// Render Services Catalog View
function renderServicesView() {
  const filtered = filterServices();

  return `
    <div class="container" style="padding-top: 2.5rem; padding-bottom: 4rem;">
      <div class="section-header">
        <span class="section-tag">Full Catalog</span>
        <h1 class="section-title">All Documentation Services</h1>
        <p class="section-subtitle">Explore all 20 available documentation categories or search for your required paperwork.</p>
      </div>

      <div class="filter-controls-wrapper">
        <div class="search-box-container">
          <span class="search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <input 
            type="text" 
            id="serviceSearchInput" 
            class="search-input" 
            placeholder="Filter services by keyword..."
            value="${currentSearchQuery}"
            oninput="handleSearchChange(this.value)"
          />
        </div>

        <div class="category-chips">
          ${SERVICE_CATEGORIES.map(cat => `
            <button 
              class="category-chip ${currentCategory === cat.id ? 'active' : ''}" 
              onclick="handleCategoryChange('${cat.id}')">
              ${cat.label}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="services-grid">
        ${filtered.length > 0 ? filtered.map(renderServiceCard).join('') : `
          <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: var(--radius-lg); border: 1px dashed var(--color-border);">
            <p style="font-size: 1.1rem; color: var(--color-text-muted); margin-bottom: 1rem;">No services match your search query: "<strong>${currentSearchQuery}</strong>"</p>
            <button class="btn-secondary" onclick="resetFilters()">Clear Filters</button>
          </div>
        `}
      </div>
    </div>
  `;
}

// Render Dedicated Service Detail View
function renderServiceDetailView(slug) {
  const service = getServiceBySlug(slug);
  if (!service) {
    return `
      <div class="container" style="padding: 4rem 1.25rem; text-align: center;">
        <h2 style="font-size: 2rem; color: var(--color-primary); margin-bottom: 1rem;">Service Not Found</h2>
        <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">The requested documentation service could not be located.</p>
        <a href="#/services" class="btn-secondary">View All Services</a>
      </div>
    `;
  }

  const waUrl = getWhatsappLink(service.whatsappMessage);

  return `
    <div class="container" style="padding-top: 2.5rem; padding-bottom: 4rem; max-width: 800px;">
      <a href="#/services" style="display: inline-flex; align-items: center; gap: 0.4rem; color: var(--color-accent); font-weight: 700; font-size: 0.9rem; margin-bottom: 1.5rem;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
        Back to Services
      </a>

      <article style="background: white; border-radius: var(--radius-xl); border: 1px solid var(--color-border); padding: 2rem; box-shadow: var(--shadow-lg);">
        <div class="detail-badge-row">
          <span class="card-category-tag">${service.categoryName}</span>
        </div>
        <h1 class="detail-title">${service.name}</h1>
        <p class="detail-intro">${service.shortDescription}</p>

        <!-- Who Needs This -->
        <div class="detail-card-box">
          <h4>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            Who May Need This Service
          </h4>
          <p>${service.whoNeedsThis}</p>
        </div>

        <!-- Required Documents Section -->
        <div class="docs-alert-box">
          <div class="docs-alert-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Required Documents
          </div>
          ${service.documents && service.documents.length > 0 ? `
            <ul class="docs-checklist">
              ${service.documents.map(doc => `
                <li class="docs-checklist-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" style="margin-top: 3px; flex-shrink: 0;"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>${doc}</span>
                </li>
              `).join('')}
            </ul>
          ` : `
            <p class="docs-alert-desc">
              Exact document requirements vary depending on your specific case and jurisdiction. Contact <strong>DASTAVEZ MITRA</strong> on WhatsApp for the customized checklist and immediate guidance.
            </p>
          `}
        </div>

        <!-- Step by Step Process -->
        <div class="detail-card-box">
          <h4>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Step-by-Step Basic Process
          </h4>
          <ul class="process-steps-list">
            ${service.process.map((step, idx) => `
              <li class="process-step-item">
                <span class="step-num-badge">${idx + 1}</span>
                <span class="step-text">${step}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Important Note / Disclaimer -->
        <div style="background: var(--color-warning-bg); border: 1px solid var(--color-warning-border); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 2rem;">
          <p style="font-size: 0.85rem; color: var(--color-warning-text); line-height: 1.5;">
            <strong>Important Note:</strong> ${service.notes || 'Requirements, processing timelines, and fee structures may vary as per government/authority rules and individual case facts.'}
          </p>
        </div>

        <!-- WhatsApp CTA -->
        <div style="text-align: center; padding-top: 1rem; border-top: 1px solid var(--color-border);">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary-wa" style="width: 100%; justify-content: center; font-size: 1.1rem; padding: 1rem;">
            ${getIconHtml('whatsapp')}
            CONTACT NOW ON WHATSAPP: ${BRAND_INFO.whatsappNumber}
          </a>
          <p class="disclaimer-micro" style="margin-top: 0.75rem;">Pre-filled message: "${service.whatsappMessage}"</p>
        </div>
      </article>
    </div>
  `;
}

// Render Documents Hub View
function renderDocumentsView() {
  return `
    <div class="container" style="padding-top: 2.5rem; padding-bottom: 4rem;">
      <div class="section-header">
        <span class="section-tag">Checklists & Guidance</span>
        <h1 class="section-title">Required Documents Explorer</h1>
        <p class="section-subtitle">Find document guidelines for your specific service and inquire directly with our team.</p>
      </div>

      <div style="max-width: 850px; margin: 0 auto;">
        ${SERVICES.map(s => `
          <div class="docs-hub-card">
            <div class="docs-hub-header">
              <div class="docs-hub-title">
                ${getIconHtml(s.icon)}
                <span>${s.name}</span>
              </div>
              <a href="${getWhatsappLink(s.whatsappMessage)}" target="_blank" rel="noopener noreferrer" class="btn-card-wa" style="padding: 0.5rem 1rem;">
                ${getIconHtml('whatsapp')}
                Ask on WhatsApp
              </a>
            </div>
            <p style="font-size: 0.92rem; color: var(--color-text-muted); margin-bottom: 0.75rem;">
              ${s.shortDescription}
            </p>
            <div style="background: #f8fafc; border-radius: var(--radius-md); padding: 0.85rem; border: 1px solid var(--color-border); font-size: 0.88rem; color: var(--color-text-main);">
              <strong>Document Guidance:</strong> Exact document requirements depend on jurisdiction and case specifications. Connect on WhatsApp (<strong>${BRAND_INFO.whatsappNumber}</strong>) with your details to receive the tailored document checklist.
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Render How It Works Dedicated View
function renderHowItWorksView() {
  return `
    <div class="container" style="padding-top: 2.5rem; padding-bottom: 4rem;">
      <div class="section-header">
        <span class="section-tag">Process Overview</span>
        <h1 class="section-title">How DASTAVEZ MITRA Works</h1>
        <p class="section-subtitle">A seamless 4-step documentation assistance experience designed for convenience.</p>
      </div>

      <div class="steps-grid" style="margin-bottom: 4rem;">
        <div class="step-card">
          <div class="step-badge">1</div>
          <h3 class="step-title">Choose Your Service</h3>
          <p class="step-desc">Identify the paperwork you need assistance with from our catalog of 20+ documentation services.</p>
        </div>

        <div class="step-card">
          <div class="step-badge">2</div>
          <h3 class="step-title">Check Required Documents</h3>
          <p class="step-desc">Review the basic guidelines and document readiness for your specific procedure.</p>
        </div>

        <div class="step-card">
          <div class="step-badge">3</div>
          <h3 class="step-title">Contact DASTAVEZ MITRA</h3>
          <p class="step-desc">Connect directly on WhatsApp at 9871592002 with our pre-filled service inquiry button.</p>
        </div>

        <div class="step-card">
          <div class="step-badge">4</div>
          <h3 class="step-title">Get Assistance</h3>
          <p class="step-desc">Get guided preparation, form assistance, and completion support for your documentation.</p>
        </div>
      </div>

      <div style="background: white; border-radius: var(--radius-xl); border: 1px solid var(--color-border); padding: 2.5rem; max-width: 800px; margin: 0 auto; box-shadow: var(--shadow-md);">
        <h3 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700; color: var(--color-primary); margin-bottom: 1rem;">Why Customers Prefer WhatsApp Assistance</h3>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; color: var(--color-text-muted); font-size: 0.95rem;">
          <li style="display: flex; gap: 0.5rem; align-items: center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Direct one-on-one communication without filling complicated multi-page forms.</li>
          <li style="display: flex; gap: 0.5rem; align-items: center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Easily share document photos/scans for quick pre-checking.</li>
          <li style="display: flex; gap: 0.5rem; align-items: center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Receive instant guidance on missing fields or signatures.</li>
          <li style="display: flex; gap: 0.5rem; align-items: center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Stay updated on your paperwork progress directly on WhatsApp.</li>
        </ul>

        <div style="margin-top: 2rem; text-align: center;">
          <a href="${getWhatsappLink()}" target="_blank" rel="noopener noreferrer" class="btn-primary-wa">
            ${getIconHtml('whatsapp')}
            CONTACT NOW ON WHATSAPP: ${BRAND_INFO.whatsappNumber}
          </a>
        </div>
      </div>
    </div>
  `;
}

// Render About View
function renderAboutView() {
  return `
    <div class="container" style="padding-top: 2.5rem; padding-bottom: 4rem; max-width: 850px;">
      <div class="section-header">
        <span class="section-tag">About Our Service</span>
        <h1 class="section-title">About DASTAVEZ MITRA</h1>
        <p class="section-subtitle">Your reliable partner for documentation and paperwork assistance.</p>
      </div>

      <div style="background: white; border-radius: var(--radius-xl); border: 1px solid var(--color-border); padding: 2.5rem; box-shadow: var(--shadow-md); margin-bottom: 2rem;">
        <h3 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: var(--color-primary); margin-bottom: 1rem;">Who We Are</h3>
        <p style="font-size: 1rem; color: var(--color-text-muted); line-height: 1.7; margin-bottom: 1.5rem;">
          <strong>DASTAVEZ MITRA</strong> is an independent documentation and assistance service. Navigating paperwork for vehicle transfers, affidavits, marriage registrations, power of attorney, agreements, and official name changes can often feel confusing and time-consuming. We provide structured guidance to help you understand requirements, prepare forms accurately, and complete documentation smoothly.
        </p>

        <h3 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: var(--color-primary); margin-bottom: 1rem;">Our Core Focus Areas</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: var(--color-bg-main); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <strong style="color: var(--color-primary);">🚗 Vehicle & RTO Services</strong>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.25rem;">RC transfers, duplicate RC, NOC, and challan assistance.</p>
          </div>
          <div style="background: var(--color-bg-main); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <strong style="color: var(--color-primary);">💍 Marriage Documentation</strong>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.25rem;">Marriage registration, Same-Day assistance, Arya Samaj marriage.</p>
          </div>
          <div style="background: var(--color-bg-main); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <strong style="color: var(--color-primary);">📜 Affidavits & Agreements</strong>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.25rem;">Declarations, rent agreements, live-in agreements, drafting.</p>
          </div>
          <div style="background: var(--color-bg-main); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <strong style="color: var(--color-primary);">📑 Power of Attorney & Wills</strong>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.25rem;">GPA, SPA, legal heir certificates, and testamentary drafting.</p>
          </div>
        </div>

        <div style="border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
          <h4 style="font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem;">Connect With Us</h4>
          <p style="font-size: 0.95rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">
            Have a question or need paperwork guidance? Reach out on WhatsApp or follow us on Instagram.
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
            <a href="${getWhatsappLink()}" target="_blank" rel="noopener noreferrer" class="btn-primary-wa">
              ${getIconHtml('whatsapp')}
              WhatsApp: ${BRAND_INFO.whatsappNumber}
            </a>
            <a href="${BRAND_INFO.instagramUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="border-color: #e1306c; color: #e1306c;">
              Instagram ${BRAND_INFO.instagramHandle}
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render Contact View
function renderContactView() {
  return `
    <div class="container" style="padding-top: 2.5rem; padding-bottom: 4rem;">
      <div class="contact-hero-banner">
        <h1 class="contact-hero-title">Contact DASTAVEZ MITRA</h1>
        <p class="contact-hero-subtitle">
          We are directly reachable via WhatsApp for all documentation queries, document checklist inquiries, and service assistance.
        </p>
        <a href="${getWhatsappLink()}" target="_blank" rel="noopener noreferrer" class="btn-primary-wa" style="font-size: 1.1rem; padding: 1rem 2.25rem;">
          ${getIconHtml('whatsapp')}
          CONTACT NOW ON WHATSAPP: ${BRAND_INFO.whatsappNumber}
        </a>
      </div>

      <div class="contact-channels-grid">
        <!-- WhatsApp Card -->
        <div class="channel-card featured">
          <div class="channel-icon-circle wa-circle">
            ${getIconHtml('whatsapp')}
          </div>
          <div>
            <h3 class="channel-title">WhatsApp Contact</h3>
            <p class="channel-handle">${BRAND_INFO.whatsappDisplayNumber}</p>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">Primary contact channel for instant replies & document verification.</p>
          </div>
          <a href="${getWhatsappLink()}" target="_blank" rel="noopener noreferrer" class="btn-channel btn-channel-wa">
            ${getIconHtml('whatsapp')}
            Chat on WhatsApp
          </a>
        </div>

        <!-- Instagram Card -->
        <div class="channel-card">
          <div class="channel-icon-circle ig-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </div>
          <div>
            <h3 class="channel-title">Instagram</h3>
            <p class="channel-handle">${BRAND_INFO.instagramHandle}</p>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">Follow for documentation guides, updates & helpful tips.</p>
          </div>
          <a href="${BRAND_INFO.instagramUrl}" target="_blank" rel="noopener noreferrer" class="btn-channel btn-channel-ig">
            Follow on Instagram
          </a>
        </div>

        <!-- Facebook Card -->
        <div class="channel-card">
          <div class="channel-icon-circle fb-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </div>
          <div>
            <h3 class="channel-title">Facebook</h3>
            <p class="channel-handle">${BRAND_INFO.facebookName}</p>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">Connect with our official Facebook community page.</p>
          </div>
          <a href="${BRAND_INFO.facebookUrl}" target="_blank" rel="noopener noreferrer" class="btn-channel btn-channel-fb">
            Visit Facebook Page
          </a>
        </div>
      </div>
    </div>
  `;
}

// Render Legal / Privacy View
function renderLegalView(type) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';

  return `
    <div class="container" style="padding-top: 2.5rem; padding-bottom: 4rem; max-width: 800px;">
      <h1 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--color-primary); margin-bottom: 1.5rem;">${title}</h1>
      
      <div style="background: white; border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 2rem; box-shadow: var(--shadow-sm); line-height: 1.7; color: var(--color-text-muted);">
        <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">General Disclaimer</h3>
        <p style="margin-bottom: 1.25rem;">
          ${BRAND_INFO.disclaimer}
        </p>

        <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">${isPrivacy ? 'Information We Receive' : 'Service Assistance Scope'}</h3>
        <p style="margin-bottom: 1.25rem;">
          ${isPrivacy ? 
            'Information and documents shared over WhatsApp or communication channels are used solely for assisting with the specific documentation requirement requested by the user. We do not sell or distribute user contact details.' : 
            'DASTAVEZ MITRA provides documentation assistance, form drafting, and procedural guidance. Acceptance, rejection, approval timelines, and fees are governed by the relevant governmental authorities, registrar offices, and transport departments.'}
        </p>

        <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">Contact for Inquiries</h3>
        <p>
          For any clarifications regarding documentation services or policies, contact DASTAVEZ MITRA directly via WhatsApp at <strong>${BRAND_INFO.whatsappNumber}</strong> or Instagram <strong>${BRAND_INFO.instagramHandle}</strong>.
        </p>
      </div>
    </div>
  `;
}

// Filter services based on category and search query
function filterServices() {
  return SERVICES.filter(service => {
    const matchesCategory = currentCategory === 'all' || service.category === currentCategory;
    const query = currentSearchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      service.name.toLowerCase().includes(query) || 
      service.shortDescription.toLowerCase().includes(query) ||
      service.categoryName.toLowerCase().includes(query) ||
      service.slug.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });
}

// Global Filter Handlers
window.handleCategoryChange = function(categoryId) {
  currentCategory = categoryId;
  const grid = document.getElementById('servicesGrid');
  if (grid) {
    const filtered = filterServices();
    grid.innerHTML = filtered.length > 0 ? filtered.map(renderServiceCard).join('') : `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: var(--radius-lg); border: 1px dashed var(--color-border);">
        <p style="font-size: 1.1rem; color: var(--color-text-muted); margin-bottom: 1rem;">No services found in this category.</p>
        <button class="btn-secondary" onclick="resetFilters()">Show All Services</button>
      </div>
    `;
  }
  // Update chips UI
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.classList.toggle('active', chip.getAttribute('onclick').includes(`'${categoryId}'`));
  });
};

window.handleSearchChange = function(query) {
  currentSearchQuery = query;
  const grid = document.getElementById('servicesGrid');
  if (grid) {
    const filtered = filterServices();
    grid.innerHTML = filtered.length > 0 ? filtered.map(renderServiceCard).join('') : `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: var(--radius-lg); border: 1px dashed var(--color-border);">
        <p style="font-size: 1.1rem; color: var(--color-text-muted); margin-bottom: 1rem;">No services match your search: "<strong>${query}</strong>"</p>
        <button class="btn-secondary" onclick="resetFilters()">Clear Filters</button>
      </div>
    `;
  }
};

window.resetFilters = function() {
  currentCategory = 'all';
  currentSearchQuery = '';
  const searchInput = document.getElementById('serviceSearchInput');
  if (searchInput) searchInput.value = '';
  window.handleCategoryChange('all');
};

// Modal Handler
window.openServiceDetail = function(slug) {
  const service = getServiceBySlug(slug);
  if (!service) return;

  const modalOverlay = document.getElementById('serviceModal');
  const modalBody = document.getElementById('modalDynamicContent');
  if (!modalOverlay || !modalBody) return;

  const waUrl = getWhatsappLink(service.whatsappMessage);

  modalBody.innerHTML = `
    <div class="detail-badge-row">
      <span class="card-category-tag">${service.categoryName}</span>
    </div>
    <h2 class="detail-title">${service.name}</h2>
    <p class="detail-intro">${service.shortDescription}</p>

    <div class="detail-card-box">
      <h4>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        Who May Need This Service
      </h4>
      <p>${service.whoNeedsThis}</p>
    </div>

    <div class="docs-alert-box">
      <div class="docs-alert-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        Required Documents
      </div>
      ${service.documents && service.documents.length > 0 ? `
        <ul class="docs-checklist">
          ${service.documents.map(doc => `
            <li class="docs-checklist-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" style="margin-top: 3px; flex-shrink: 0;"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${doc}</span>
            </li>
          `).join('')}
        </ul>
      ` : `
        <p class="docs-alert-desc">
          Exact document requirements vary depending on your specific case and jurisdiction. Contact <strong>DASTAVEZ MITRA</strong> on WhatsApp for the customized checklist and immediate guidance.
        </p>
      `}
    </div>

    <div class="detail-card-box">
      <h4>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        Step-by-Step Basic Process
      </h4>
      <ul class="process-steps-list">
        ${service.process.map((step, idx) => `
          <li class="process-step-item">
            <span class="step-num-badge">${idx + 1}</span>
            <span class="step-text">${step}</span>
          </li>
        `).join('')}
      </ul>
    </div>

    <div style="background: var(--color-warning-bg); border: 1px solid var(--color-warning-border); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 1.5rem;">
      <p style="font-size: 0.8rem; color: var(--color-warning-text); line-height: 1.4;">
        <strong>Note:</strong> ${service.notes || 'Procedures and document verification may vary by local authority guidelines.'}
      </p>
    </div>

    <div class="modal-footer-cta" style="padding: 0;">
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-modal-wa">
        ${getIconHtml('whatsapp')}
        CONTACT NOW ON WHATSAPP: ${BRAND_INFO.whatsappNumber}
      </a>
      <p class="disclaimer-micro">Pre-filled message: "${service.whatsappMessage}"</p>
    </div>
  `;

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeServiceModal = function() {
  const modalOverlay = document.getElementById('serviceModal');
  if (modalOverlay) {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// Router Dispatcher
function router() {
  const hash = window.location.hash.slice(1) || '/';
  const appContainer = document.getElementById('app-root');
  if (!appContainer) return;

  // Close mobile drawer on route change
  window.toggleMobileMenu(false);
  window.closeServiceModal();

  // Highlight Nav Links
  document.querySelectorAll('.nav-link, .drawer-links a').forEach(link => {
    const href = link.getAttribute('href');
    const isCurrent = (hash === '/' && href === '#/') || (hash !== '/' && href === `#${hash}`);
    link.classList.toggle('active', isCurrent);
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Route matching
  if (hash === '/' || hash === '') {
    appContainer.innerHTML = renderHomeView();
  } else if (hash === '/services') {
    appContainer.innerHTML = renderServicesView();
  } else if (hash.startsWith('/services/')) {
    const slug = hash.replace('/services/', '');
    appContainer.innerHTML = renderServiceDetailView(slug);
  } else if (hash === '/documents') {
    appContainer.innerHTML = renderDocumentsView();
  } else if (hash === '/how-it-works') {
    appContainer.innerHTML = renderHowItWorksView();
  } else if (hash === '/about') {
    appContainer.innerHTML = renderAboutView();
  } else if (hash === '/contact') {
    appContainer.innerHTML = renderContactView();
  } else if (hash === '/privacy') {
    appContainer.innerHTML = renderLegalView('privacy');
  } else if (hash === '/terms') {
    appContainer.innerHTML = renderLegalView('terms');
  } else {
    appContainer.innerHTML = renderHomeView();
  }
}

// Mobile Menu Toggle
window.toggleMobileMenu = function(forceState) {
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (!drawer || !backdrop) return;

  const isOpen = forceState !== undefined ? forceState : !drawer.classList.contains('open');
  drawer.classList.toggle('open', isOpen);
  backdrop.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
};

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('hashchange', router);
  router();

  // Close modal when clicking on backdrop
  const modal = document.getElementById('serviceModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.closeServiceModal();
      }
    });
  }

  // Escape key closes modal or drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeServiceModal();
      window.toggleMobileMenu(false);
    }
  });
});
