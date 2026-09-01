import { BRAND_INFO, SERVICE_CATEGORIES, SERVICES, getWhatsappLink, getCallLink, getServiceBySlug } from './data/services.js';

// Global State
let currentCategory = 'all';
let currentSearchQuery = '';
let isSubmittingLead = false;

// Admin Session State (Stored in sessionStorage for security)
let adminToken = sessionStorage.getItem('dm_admin_token') || null;
let adminLeadsData = [];
let adminStatsData = null;
let adminFilterStatus = 'all';
let adminFilterService = 'all';
let adminSearchTerm = '';
let adminSortOrder = 'newest';

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
    'whatsapp': '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.476-.15-.677.15-.2.301-.777.98-.952 1.18-.176.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.783-1.676-2.083-.175-.3-.019-.462.132-.612.135-.135.301-.351.451-.527.15-.175.2-.3.3-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.235-.244-.588-.492-.508-.677-.518l-.577-.01c-.2 0-.527.075-.802.376s-1.054 1.03-1.054 2.511 1.08 2.912 1.23 3.113c.15.201 2.126 3.246 5.151 4.553.72.31 1.282.496 1.72.635.723.23 1.38.198 1.9.12.58-.087 1.78-.727 2.03-1.43.25-.703.25-1.305.175-1.43-.075-.125-.276-.2-.577-.35zM12 2C6.477 2 2 6.477 2 12c0 1.892.525 3.663 1.438 5.178L2 22l4.97-1.398A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>',
    'phone': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    'map-pin': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    'send': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'
  };

  return iconMap[iconName] || iconMap['file-text'];
}

// Render Document Details
function renderServiceDocuments(service) {
  if (service.slug === 'marriage-registration' || service.hindiHeading) {
    return `
      <div class="docs-alert-box">
        <div class="docs-hindi-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <span>${service.hindiHeading || 'शादी रजिस्टर करने हेतु आवश्यक दस्तावेज़'}</span>
        </div>
        <ul class="docs-numbered-list">
          ${service.documents.map((doc, idx) => `
            <li class="docs-numbered-item">
              <span class="docs-num-pill">${idx + 1}</span>
              <span><strong>${doc}</strong></span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  if (service.gazetteSections) {
    const { under18, above18 } = service.gazetteSections;
    return `
      <div class="docs-alert-box" style="background: #f0f7ff; border-style: solid;">
        <div class="docs-alert-title" style="font-size: 1.05rem; margin-bottom: 0.85rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Gazette Notification – Required Documents
        </div>

        <div class="gazette-section-card">
          <div class="gazette-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            Section A: ${under18.title}
          </div>
          ${under18.groups.map(group => `
            <div class="gazette-group">
              <div class="gazette-group-title">• ${group.title}:</div>
              <ul class="docs-checklist" style="margin-top: 0.25rem; margin-left: 0.75rem;">
                ${group.items.map(item => `
                  <li class="docs-checklist-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" style="margin-top: 3px; flex-shrink: 0;"><polyline points="20 6 9 17 4 12"/></svg>
                    <span><strong>${item}</strong></span>
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
          <div class="gazette-address-notice">
            <strong>📍 Service / Office Address:</strong><br/>
            ${under18.serviceAddressNotice}
          </div>
        </div>

        <div class="gazette-section-card" style="border-color: #cbd5e1; margin-bottom: 0;">
          <div class="gazette-section-title" style="color: var(--color-primary);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            Section B: ${above18.title}
          </div>
          <div class="gazette-pending-notice">
            <p>${above18.message}</p>
          </div>
        </div>
      </div>
    `;
  }

  if (service.documents && service.documents.length > 0) {
    return `
      <div class="docs-alert-box">
        <div class="docs-alert-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Required Documents
        </div>
        <ul class="docs-checklist">
          ${service.documents.map(doc => `
            <li class="docs-checklist-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" style="margin-top: 3px; flex-shrink: 0;"><polyline points="20 6 9 17 4 12"/></svg>
              <span><strong>${doc}</strong></span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  return `
    <div class="docs-alert-box">
      <div class="docs-alert-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        Required Documents
      </div>
      <p class="docs-alert-desc">
        Exact document requirements vary depending on your specific case and jurisdiction in Gurugram. Contact <strong>DASTAVEZ MITRA</strong> for customized checklist guidance.
      </p>
    </div>
  `;
}

// Render Lead Capture Form Component
function renderLeadFormComponent(preselectedServiceName = '', sourcePage = '/') {
  return `
    <div class="lead-card-box" id="leadFormContainer">
      <div class="lead-form-header">
        <h3 class="lead-form-title">Request Documentation Assistance</h3>
        <p class="lead-form-subtitle">Fill in your basic details below and our team will get in touch with you directly in Gurugram.</p>
      </div>

      <div id="leadFormAlert"></div>

      <form id="leadCaptureForm" onsubmit="handleLeadSubmit(event, '${sourcePage}')" class="lead-form-grid">
        <!-- Anti-Spam Honeypot -->
        <div style="display:none;" aria-hidden="true">
          <input type="text" name="website_hp" id="website_hp" tabindex="-1" autocomplete="off" />
        </div>

        <div class="form-group">
          <label class="form-label" for="leadName">
            Full Name <span class="required-star">*</span>
          </label>
          <input 
            type="text" 
            id="leadName" 
            name="visitor_name" 
            class="form-input" 
            placeholder="Enter your full name" 
            required 
            minlength="2"
            maxlength="80"
            autocomplete="name"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="leadMobile">
            Mobile Number (WhatsApp) <span class="required-star">*</span>
          </label>
          <div class="mobile-input-container">
            <span class="country-code-badge">+91</span>
            <input 
              type="tel" 
              id="leadMobile" 
              name="mobile_number" 
              class="form-input" 
              placeholder="10-digit mobile number" 
              required 
              pattern="[6-9][0-9]{9}" 
              maxlength="10" 
              inputmode="numeric"
              autocomplete="tel"
              oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10)"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="leadService">
            Service / Work Required <span class="required-star">*</span>
          </label>
          <select id="leadService" name="service_requested" class="form-select" required>
            <option value="" disabled ${!preselectedServiceName ? 'selected' : ''}>-- Select Required Service --</option>
            ${SERVICES.map(s => `
              <option value="${s.name}" ${preselectedServiceName === s.name ? 'selected' : ''}>
                ${s.name} (${s.categoryName})
              </option>
            `).join('')}
            <option value="Other / General Enquiry" ${preselectedServiceName === 'Other / General Enquiry' ? 'selected' : ''}>
              Other / General Enquiry
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="leadEmail">
            Email Address <span style="font-size: 0.78rem; font-weight: normal; color: var(--color-text-muted);">(Optional)</span>
          </label>
          <input 
            type="email" 
            id="leadEmail" 
            name="email" 
            class="form-input" 
            placeholder="name@example.com (optional)" 
            maxlength="100"
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="leadMessage">
            Additional Details / Notes <span style="font-size: 0.78rem; font-weight: normal; color: var(--color-text-muted);">(Optional)</span>
          </label>
          <textarea 
            id="leadMessage" 
            name="message" 
            class="form-textarea" 
            rows="3" 
            placeholder="Briefly describe your vehicle, timeline, or requirement..."
            maxlength="500"
          ></textarea>
        </div>

        <div class="consent-checkbox-wrapper">
          <input type="checkbox" id="leadConsent" name="consent" required />
          <label for="leadConsent">
            I agree that DASTAVEZ MITRA may use the information provided to contact me regarding my enquiry in accordance with the <a href="#/privacy">Privacy Policy</a>.
          </label>
        </div>

        <button type="submit" class="btn-lead-submit" id="leadSubmitBtn">
          ${getIconHtml('send')}
          <span>Submit Enquiry</span>
        </button>
      </form>
    </div>
  `;
}

// Render Service Card with Separate WhatsApp & Call Buttons
function renderServiceCard(service) {
  const waUrl = getWhatsappLink(service.whatsappMessage);
  const callUrl = getCallLink();

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
        <button class="btn-card-docs" onclick="openServiceDetail('${service.slug}')" aria-label="View Required Documents for ${service.name}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Required Documents
        </button>
        
        <div class="card-action-row">
          <a href="tel:+919540403071" class="btn-card-call" aria-label="Call directly for ${service.name}">
            ${getIconHtml('phone')}
            Call Now
          </a>
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-wa" aria-label="WhatsApp for ${service.name}">
            ${getIconHtml('whatsapp')}
            WhatsApp
          </a>
        </div>
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
              WHATSAPP: 9871592002
            </a>
            <a href="tel:+919540403071" class="btn-secondary" style="font-weight: 700;">
              ${getIconHtml('phone')}
              CALL: 9540403071
            </a>
          </div>

          <div class="hero-highlights">
            <div class="highlight-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>WhatsApp: <strong>9871592002</strong></span>
            </div>
            <div class="highlight-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Calling: <strong>9540403071</strong></span>
            </div>
            <div class="highlight-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Gurugram Only</span>
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
            <a href="#/services/vehicle-noc-form-28" class="preview-service-item">
              <span>📄 Vehicle NOC – Form 28</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </a>
            <a href="#/services/international-driving-licence" class="preview-service-item">
              <span>💳 International Driving Licence</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </a>
            <a href="#/services/marriage-registration" class="preview-service-item">
              <span>💍 Marriage Registration (शादी दस्तावेज़)</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </a>
            <a href="#/services/gazette-name-change" class="preview-service-item">
              <span>📑 Gazette Notification / Name Change</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          </div>

          <div class="preview-wa-direct">
            <p>Direct Phone & WhatsApp Support</p>
            <div style="display: flex; gap: 0.4rem; justify-content: center; margin-top: 0.5rem;">
              <a href="tel:+919540403071" class="btn-card-call" style="flex: 1; padding: 0.6rem; justify-content: center;">
                📞 Call 9540403071
              </a>
              <a href="${getWhatsappLink()}" target="_blank" rel="noopener noreferrer" class="btn-card-wa" style="flex: 1; padding: 0.6rem; justify-content: center;">
                💬 WhatsApp 9871592002
              </a>
            </div>
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
          <div>
            <span class="location-notice-badge">
              ${getIconHtml('map-pin')}
              ${BRAND_INFO.serviceLocationNotice}
            </span>
          </div>
          <p class="section-subtitle">Select your service below to view Required Documents, Call us, or message on WhatsApp.</p>
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
              placeholder="Search services (e.g. Vehicle NOC, Marriage, DL, Duplicate RC)..."
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

    <!-- Lead Capture Section on Homepage -->
    <section class="lead-section" id="enquiry-section">
      <div class="container">
        ${renderLeadFormComponent('', '/')}
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="section how-it-works-section" id="how-it-works">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Simple & Transparent</span>
          <h2 class="section-title">How DASTAVEZ MITRA Works</h2>
          <p class="section-subtitle">4 easy steps to get your documentation paperwork assisted smoothly in Gurugram.</p>
        </div>

        <div class="steps-grid">
          <div class="step-card">
            <div class="step-badge">1</div>
            <h3 class="step-title">Choose Your Service</h3>
            <p class="step-desc">Browse through our documentation service categories and select the paperwork you need help with.</p>
          </div>

          <div class="step-card">
            <div class="step-badge">2</div>
            <h3 class="step-title">Check Required Documents</h3>
            <p class="step-desc">Click "Required Documents" to review the guidelines and document checklist before proceeding.</p>
          </div>

          <div class="step-card">
            <div class="step-badge">3</div>
            <h3 class="step-title">Call or WhatsApp</h3>
            <p class="step-desc">Connect on WhatsApp at 9871592002 or call Helpline 9540403071 for immediate guidance.</p>
          </div>

          <div class="step-card">
            <div class="step-badge">4</div>
            <h3 class="step-title">Get Assistance</h3>
            <p class="step-desc">Receive clear guidance, form preparation help, and step-by-step assistance until completion.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Action Banner -->
    <section class="container" style="margin-bottom: 4rem;">
      <div style="background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light)); color: white; border-radius: var(--radius-xl); padding: 2.5rem 1.5rem; text-align: center; box-shadow: var(--shadow-lg);">
        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem;">Have a Question Regarding Any Document?</h2>
        <p style="font-size: 1rem; opacity: 0.9; margin-bottom: 1.5rem; max-width: 600px; margin-left: auto; margin-right: auto;">
          Contact DASTAVEZ MITRA directly for quick consultation and document verification in Gurugram.
        </p>
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <a href="tel:+919540403071" class="btn-secondary" style="font-size: 1rem; padding: 0.85rem 1.5rem; font-weight: 700;">
            ${getIconHtml('phone')}
            CALL: 9540403071
          </a>
          <a href="${getWhatsappLink()}" target="_blank" rel="noopener noreferrer" class="btn-primary-wa" style="font-size: 1rem; padding: 0.85rem 1.5rem;">
            ${getIconHtml('whatsapp')}
            WHATSAPP: 9871592002
          </a>
        </div>
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
        <div>
          <span class="location-notice-badge">
            ${getIconHtml('map-pin')}
            ${BRAND_INFO.serviceLocationNotice}
          </span>
        </div>
        <p class="section-subtitle">Explore our documentation categories or search for your required paperwork.</p>
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
            placeholder="Filter services by keyword (e.g. Form 28, International DL, Marriage, Gazette)..."
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
          <span class="location-notice-badge" style="margin: 0; font-size: 0.78rem; padding: 0.2rem 0.6rem;">
            ${getIconHtml('map-pin')} Gurugram Only
          </span>
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
        ${renderServiceDocuments(service)}

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

        <!-- Action Buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 2rem;">
          <a href="tel:+919540403071" class="btn-secondary" style="font-weight: 700; justify-content: center; padding: 0.9rem;">
            ${getIconHtml('phone')}
            CALL: 9540403071
          </a>
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary-wa" style="justify-content: center; padding: 0.9rem;">
            ${getIconHtml('whatsapp')}
            WHATSAPP: 9871592002
          </a>
        </div>
      </article>

      <!-- Embedded Lead Form for this specific service -->
      <div style="margin-top: 2.5rem;">
        ${renderLeadFormComponent(service.name, `/services/${service.slug}`)}
      </div>
    </div>
  `;
}

// Render Dedicated Enquiry Page
function renderEnquiryView() {
  return `
    <div class="container" style="padding-top: 2.5rem; padding-bottom: 4rem;">
      <div class="section-header">
        <span class="section-tag">Online Assistance</span>
        <h1 class="section-title">Request Service Assistance</h1>
        <div>
          <span class="location-notice-badge">
            ${getIconHtml('map-pin')}
            ${BRAND_INFO.serviceLocationNotice}
          </span>
        </div>
        <p class="section-subtitle">Submit your requirement online or contact our Gurugram desk directly.</p>
      </div>

      <div style="max-width: 680px; margin: 0 auto;">
        ${renderLeadFormComponent('', '/enquiry')}
      </div>
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
        <div>
          <span class="location-notice-badge">
            ${getIconHtml('map-pin')}
            ${BRAND_INFO.serviceLocationNotice}
          </span>
        </div>
        <p class="section-subtitle">Find document guidelines for your specific service and inquire directly with our team in Gurugram.</p>
      </div>

      <div style="max-width: 850px; margin: 0 auto;">
        ${SERVICES.map(s => `
          <div class="docs-hub-card">
            <div class="docs-hub-header">
              <div class="docs-hub-title">
                ${getIconHtml(s.icon)}
                <span>${s.name}</span>
              </div>
              <div style="display: flex; gap: 0.4rem;">
                <a href="tel:+919540403071" class="btn-card-call" style="padding: 0.5rem 0.75rem;">
                  ${getIconHtml('phone')} Call
                </a>
                <a href="${getWhatsappLink(s.whatsappMessage)}" target="_blank" rel="noopener noreferrer" class="btn-card-wa" style="padding: 0.5rem 0.75rem;">
                  ${getIconHtml('whatsapp')} WhatsApp
                </a>
              </div>
            </div>
            <p style="font-size: 0.92rem; color: var(--color-text-muted); margin-bottom: 0.75rem;">
              ${s.shortDescription}
            </p>
            ${renderServiceDocuments(s)}
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
        <div>
          <span class="location-notice-badge">
            ${getIconHtml('map-pin')}
            ${BRAND_INFO.serviceLocationNotice}
          </span>
        </div>
        <p class="section-subtitle">A seamless 4-step documentation assistance experience designed for convenience in Gurugram.</p>
      </div>

      <div class="steps-grid" style="margin-bottom: 4rem;">
        <div class="step-card">
          <div class="step-badge">1</div>
          <h3 class="step-title">Choose Your Service</h3>
          <p class="step-desc">Identify the paperwork you need assistance with from our catalog of documentation services.</p>
        </div>

        <div class="step-card">
          <div class="step-badge">2</div>
          <h3 class="step-title">Check Required Documents</h3>
          <p class="step-desc">Review the basic guidelines and document readiness for your specific procedure.</p>
        </div>

        <div class="step-card">
          <div class="step-badge">3</div>
          <h3 class="step-title">Call or WhatsApp</h3>
          <p class="step-desc">Reach out via WhatsApp at 9871592002 or Call Helpline 9540403071 for immediate consultation.</p>
        </div>

        <div class="step-card">
          <div class="step-badge">4</div>
          <h3 class="step-title">Get Assistance</h3>
          <p class="step-desc">Get guided preparation, form assistance, and completion support for your documentation.</p>
        </div>
      </div>

      <div style="background: white; border-radius: var(--radius-xl); border: 1px solid var(--color-border); padding: 2.5rem; max-width: 800px; margin: 0 auto; box-shadow: var(--shadow-md);">
        <h3 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700; color: var(--color-primary); margin-bottom: 1rem;">Direct Contact Channels</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
          <a href="tel:+919540403071" class="btn-card-call" style="padding: 1rem; justify-content: center; font-size: 1rem;">
            ${getIconHtml('phone')} Call: 9540403071
          </a>
          <a href="${getWhatsappLink()}" target="_blank" rel="noopener noreferrer" class="btn-card-wa" style="padding: 1rem; justify-content: center; font-size: 1rem;">
            ${getIconHtml('whatsapp')} WhatsApp: 9871592002
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
        <div>
          <span class="location-notice-badge">
            ${getIconHtml('map-pin')}
            ${BRAND_INFO.serviceLocationNotice}
          </span>
        </div>
        <p class="section-subtitle">Your reliable partner for documentation and paperwork assistance in Gurugram.</p>
      </div>

      <div style="background: white; border-radius: var(--radius-xl); border: 1px solid var(--color-border); padding: 2.5rem; box-shadow: var(--shadow-md); margin-bottom: 2rem;">
        <h3 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: var(--color-primary); margin-bottom: 1rem;">Who We Are</h3>
        <p style="font-size: 1rem; color: var(--color-text-muted); line-height: 1.7; margin-bottom: 1.5rem;">
          <strong>DASTAVEZ MITRA</strong> is an independent documentation and paperwork assistance service operating in Gurugram. Navigating paperwork for vehicle transfers, Form 28 NOC, duplicate RC, driving licences, affidavits, marriage registrations, power of attorney, agreements, and official name changes can often feel confusing and time-consuming. We provide structured guidance to help you understand requirements, prepare forms accurately, and complete documentation smoothly.
        </p>

        <div style="border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
          <h4 style="font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem;">Office Location & Direct Helplines</h4>
          <p style="font-size: 0.95rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">
            📍 <strong>Office Address:</strong> ${BRAND_INFO.officeAddress}
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.25rem;">
            <a href="tel:+919540403071" class="btn-secondary" style="font-weight: 700;">
              ${getIconHtml('phone')} Call: 9540403071
            </a>
            <a href="${getWhatsappLink()}" target="_blank" rel="noopener noreferrer" class="btn-primary-wa">
              ${getIconHtml('whatsapp')} WhatsApp: 9871592002
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
        <div>
          <span class="location-notice-badge" style="background: rgba(255, 255, 255, 0.18); color: white; border-color: rgba(255, 255, 255, 0.35); margin-bottom: 0.75rem;">
            ${getIconHtml('map-pin')}
            ${BRAND_INFO.serviceLocationNotice}
          </span>
        </div>
        <h1 class="contact-hero-title">Contact DASTAVEZ MITRA</h1>
        <p class="contact-hero-subtitle">
          We are directly reachable via WhatsApp and Phone for all documentation queries, document checklist inquiries, and service assistance in Gurugram.
        </p>
        
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-top: 1.5rem;">
          <a href="tel:+919540403071" class="btn-secondary" style="font-size: 1.05rem; padding: 0.9rem 1.8rem; font-weight: 700;">
            ${getIconHtml('phone')}
            CALL: 9540403071
          </a>
          <a href="${getWhatsappLink()}" target="_blank" rel="noopener noreferrer" class="btn-primary-wa" style="font-size: 1.05rem; padding: 0.9rem 1.8rem;">
            ${getIconHtml('whatsapp')}
            WHATSAPP: 9871592002
          </a>
        </div>
      </div>

      <div class="contact-channels-grid" style="margin-bottom: 3rem;">
        <!-- WhatsApp Card -->
        <div class="channel-card featured">
          <div class="channel-icon-circle wa-circle">
            ${getIconHtml('whatsapp')}
          </div>
          <div>
            <h3 class="channel-title">WhatsApp Support</h3>
            <p class="channel-handle">9871592002</p>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">Direct chat for quick document checks & checklist queries.</p>
          </div>
          <a href="${getWhatsappLink()}" target="_blank" rel="noopener noreferrer" class="btn-channel btn-channel-wa">
            ${getIconHtml('whatsapp')}
            Chat on WhatsApp
          </a>
        </div>

        <!-- Phone / Calling Helpline Card -->
        <div class="channel-card">
          <div class="channel-icon-circle" style="background: #e0f2fe; color: #0077b6;">
            ${getIconHtml('phone')}
          </div>
          <div>
            <h3 class="channel-title">Calling Helpline</h3>
            <p class="channel-handle">9540403071</p>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">Direct voice call for inquiries and consultation in Gurugram.</p>
          </div>
          <a href="tel:+919540403071" class="btn-secondary" style="justify-content: center; font-weight: 700;">
            ${getIconHtml('phone')}
            Call 9540403071
          </a>
        </div>

        <!-- Office Desk Card -->
        <div class="channel-card">
          <div class="channel-icon-circle" style="background: #fef3c7; color: #92400e;">
            ${getIconHtml('map-pin')}
          </div>
          <div>
            <h3 class="channel-title">Court Office Desk</h3>
            <p class="channel-handle" style="font-size: 0.88rem; color: var(--color-primary);">District Court, Gurugram</p>
            <p style="font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 1.25rem; line-height: 1.4;">
              ${BRAND_INFO.officeAddress}
            </p>
          </div>
          <a href="${getWhatsappLink('Hello DASTAVEZ MITRA, I want to visit your Gurugram Court office.')}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="font-size: 0.85rem; padding: 0.6rem;">
            Get Office Directions
          </a>
        </div>
      </div>

      <!-- Online Lead Form on Contact Page -->
      <div style="max-width: 680px; margin: 0 auto;">
        ${renderLeadFormComponent('', '/contact')}
      </div>
    </div>
  `;
}

// Render Privacy Policy View
function renderLegalPrivacyView() {
  return `
    <div class="container" style="padding-top: 2.5rem; padding-bottom: 4rem; max-width: 850px;">
      <h1 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--color-primary); margin-bottom: 1.5rem;">Privacy Policy</h1>
      
      <div style="background: white; border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 2rem; box-shadow: var(--shadow-sm); line-height: 1.7; color: var(--color-text-muted);">
        <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">1. Information We Collect</h3>
        <p style="margin-bottom: 1.25rem;">
          When you submit an enquiry through our lead form or connect with us via WhatsApp/Phone, we collect basic contact information: your Full Name, Mobile Number, requested documentation service, optional email address, and message details. We do not ask for or collect sensitive numbers (such as Aadhaar numbers, PAN card numbers, OTPs, or bank account details) on the initial enquiry form.
        </p>

        <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">2. How Enquiry Information is Used</h3>
        <p style="margin-bottom: 1.25rem;">
          The information you provide is used exclusively by DASTAVEZ MITRA to contact you regarding your service enquiry, clarify document requirements, and provide procedural assistance. We do not sell, rent, or trade your contact details with third-party commercial marketing companies.
        </p>

        <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">3. Confidentiality & Storage</h3>
        <p style="margin-bottom: 1.25rem;">
          Enquiries are stored securely on our protected servers and are accessible only to authorized DASTAVEZ MITRA staff. Lead data is NEVER published or exposed publicly. We apply industry-standard technical safeguards, authentication controls, and encryption measures.
        </p>

        <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">4. Consent & User Rights</h3>
        <p style="margin-bottom: 1.25rem;">
          By submitting an enquiry form on our website, you provide explicit consent to be contacted by DASTAVEZ MITRA via WhatsApp, Phone Call, or Email regarding your documentation request. If you wish to update or delete your enquiry records, you may contact us directly.
        </p>

        <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">5. Contact Details</h3>
        <p>
          For any privacy-related queries, please contact DASTAVEZ MITRA at:<br/>
          • WhatsApp: <strong>9871592002</strong><br/>
          • Helpline Call: <strong>9540403071</strong><br/>
          • Office: ${BRAND_INFO.officeAddress}
        </p>
      </div>
    </div>
  `;
}

// Render Terms & Conditions View (18 Clauses)
function renderLegalTermsView() {
  return `
    <div class="container" style="padding-top: 2.5rem; padding-bottom: 4rem; max-width: 900px;">
      <div class="section-header" style="text-align: left; margin-bottom: 2rem;">
        <span class="section-tag">Legal Framework & Service Terms</span>
        <h1 class="section-title">Terms & Conditions</h1>
        <p class="section-subtitle">Please read these terms carefully before engaging documentation assistance services with DASTAVEZ MITRA.</p>
      </div>

      <div style="margin-bottom: 2rem;">
        <div class="terms-clause-card">
          <h3>1. Nature of Service</h3>
          <p>DASTAVEZ MITRA provides documentation drafting, paperwork compilation, procedural guidance, application assistance, and facilitation services. DASTAVEZ MITRA is an independent assistance service and does not own, manage, or control decisions made by government departments, Regional Transport Offices (RTO / RTA), courts, marriage registrars, police authorities, banks, passport offices, or any other statutory authority.</p>
        </div>

        <div class="terms-clause-card">
          <h3>2. No Guarantee of Government Decision</h3>
          <p>Submission, drafting, or procedural assistance provided by DASTAVEZ MITRA does not guarantee approval, registration, issuance of certificate/licence, cancellation of hypothecation/challan, reduction of penalties, or any specific outcome. All official approvals, dismissals, timelines, and statutory determinations rest solely within the legal discretion of the respective competent government authorities.</p>
        </div>

        <div class="terms-clause-card">
          <h3>3. Document Responsibility</h3>
          <p>The customer is solely responsible for providing genuine, valid, complete, and accurate documents, personal details, and identity proofs. DASTAVEZ MITRA acts in good faith based upon information and records provided directly by the customer.</p>
        </div>

        <div class="terms-clause-card">
          <h3>4. Prohibition of Forged / False Documents</h3>
          <p>Customers must not submit or request the use of forged, fabricated, counterfeit, altered, tampered, or misleading documents or declarations. Any submission of fraudulent documents is strictly illegal, and the customer assumes sole legal liability for any false information provided.</p>
        </div>

        <div class="terms-clause-card">
          <h3>5. Government & Authority Delays</h3>
          <p>Any delay caused by government portals, server downtimes, appointment unavailability, strike, statutory backlog, police verification, physical inspection, administrative processing, or other third-party factors is strictly outside DASTAVEZ MITRA's control. DASTAVEZ MITRA is not liable for delays originating from authority workflows.</p>
        </div>

        <div class="terms-clause-card">
          <h3>6. Customer Verification</h3>
          <p>The customer is advised and expected to thoroughly verify and confirm all draft documents, spelling, numbers, dates, and application details before final execution, stamping, or official submission to any authority.</p>
        </div>

        <div class="terms-clause-card">
          <h3>7. Legal Eligibility</h3>
          <p>The customer is responsible for ensuring that they satisfy all legal eligibility criteria, age limits, residency rules, marital eligibility, and statutory requirements applicable to the requested service under relevant Indian laws.</p>
        </div>

        <div class="terms-clause-card">
          <h3>8. Service Fees & Statutory Charges</h3>
          <p>Fees paid to DASTAVEZ MITRA cover professional drafting, guidance, and assistance services as communicated to the customer. Government fees, statutory taxes, stamp duty, challan payments, and official portal charges, where applicable, are separate statutory liabilities unless explicitly stated in writing.</p>
        </div>

        <div class="terms-clause-card">
          <h3>9. No Representation as a Government Authority</h3>
          <p>DASTAVEZ MITRA is an independent private documentation assistance service and is not a government department, official government portal, court, or statutory body. We do not claim to be or represent ourselves as government officials.</p>
        </div>

        <div class="terms-clause-card">
          <h3>10. Independent Third-Party & Authority Decisions</h3>
          <p>DASTAVEZ MITRA is not responsible or legally liable for independent decisions, rejections, queries, objections, or actions taken by government officials, registrars, transport officers, or third-party institutions.</p>
        </div>

        <div class="terms-clause-card">
          <h3>11. Privacy & Document Handling</h3>
          <p>Customer documents and personal information are handled with professional discretion and used exclusively for the purpose of facilitating the requested documentation assistance, subject to applicable laws.</p>
        </div>

        <div class="terms-clause-card">
          <h3>12. Accuracy of Website Information</h3>
          <p>Information, timelines, and guidelines published on this website are provided for general informational purposes. Government rules, statutory forms, and procedural workflows may change periodically without prior notice.</p>
        </div>

        <div class="terms-clause-card">
          <h3>13. Website Document Guidance</h3>
          <p>Required document checklists displayed on the website represent standard procedural guidance. Individual cases may be subject to additional verification, supporting affidavits, or specific requirements mandated by the concerned authority.</p>
        </div>

        <div class="terms-clause-card">
          <h3>14. Limitation of Liability</h3>
          <p>To the fullest extent permitted by applicable law, DASTAVEZ MITRA, its proprietors, staff, and representatives shall not be liable for indirect, incidental, consequential, or punitive damages, rejection of applications by statutory bodies, policy changes, technical disruptions, or circumstances beyond reasonable control.</p>
        </div>

        <div class="terms-clause-card">
          <h3>15. Lawful Purpose</h3>
          <p>All services, draft agreements, affidavits, and consultations provided by DASTAVEZ MITRA must be utilized solely for lawful and legitimate purposes in compliance with the laws of India.</p>
        </div>

        <div class="terms-clause-card">
          <h3>16. No Circumvention of Legal Norms</h3>
          <p>DASTAVEZ MITRA does not provide services to evade, bypass, circumvent, or violate any statutory requirement, safety regulation, judicial order, court directive, or transport department guideline.</p>
        </div>

        <div class="terms-clause-card">
          <h3>17. Changes in Authority Requirements</h3>
          <p>Statutory rules and document requirements are governed by state transport departments, revenue authorities, and government gazettes. Customers are encouraged to confirm current checklist specifics prior to final submission.</p>
        </div>

        <div class="terms-clause-card">
          <h3>18. Contact & Clarifications</h3>
          <p>For any queries, clarifications regarding document checklists, or service scope, customers may contact DASTAVEZ MITRA directly via WhatsApp at <strong>9871592002</strong>, Call at <strong>9540403071</strong>, or visit our office desk at <strong>${BRAND_INFO.officeAddress}</strong>.</p>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// Admin CRM Dashboard View
// ==========================================
function renderAdminView() {
  if (!adminToken) {
    return `
      <div class="admin-view-wrapper">
        <div class="container">
          <div class="admin-login-card">
            <div class="logo-badge" style="margin: 0 auto 1rem; width: 44px; height: 44px; font-size: 1.2rem;">DM</div>
            <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--color-primary); margin-bottom: 0.5rem;">Admin CRM Portal</h2>
            <p style="font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">Authenticate to access customer enquiries and lead pipeline.</p>

            <div id="adminLoginAlert"></div>

            <form onsubmit="handleAdminLogin(event)" style="display: flex; flex-direction: column; gap: 1rem; text-align: left;">
              <div class="form-group">
                <label class="form-label" for="adminPassword">Admin Password</label>
                <input 
                  type="password" 
                  id="adminPassword" 
                  class="form-input" 
                  placeholder="Enter admin password" 
                  required 
                  autocomplete="current-password"
                />
              </div>

              <button type="submit" class="btn-lead-submit" id="adminLoginBtn" style="margin-top: 0.5rem;">
                <span>Unlock CRM Dashboard</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  // Authenticated CRM Dashboard
  const stats = adminStatsData || { total: 0, today: 0, new: 0, contacted: 0, followup: 0, converted: 0, closed: 0 };
  const filteredLeads = getFilteredAdminLeads();

  return `
    <div class="admin-view-wrapper">
      <div class="container" style="max-width: 1100px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <span class="section-tag" style="background: #e0f2fe; color: #0284c7;">Internal CRM</span>
            <h1 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--color-primary); margin-top: 0.25rem;">
              Enquiry Lead Management
            </h1>
            <p style="font-size: 0.85rem; color: var(--color-text-muted);">
              Storage: <span style="font-weight: 700; color: #16a34a;">${stats.storageMode || 'Active'}</span>
            </p>
          </div>

          <div style="display: flex; gap: 0.5rem;">
            <button class="btn-secondary" onclick="fetchAdminData()" style="padding: 0.55rem 0.9rem; font-size: 0.85rem;">
              🔄 Refresh
            </button>
            <button class="btn-secondary" onclick="exportLeadsCsv()" style="padding: 0.55rem 0.9rem; font-size: 0.85rem;">
              📥 Export CSV
            </button>
            <button class="btn-secondary" onclick="handleAdminLogout()" style="padding: 0.55rem 0.9rem; font-size: 0.85rem; color: #dc2626; border-color: #fca5a5;">
              🚪 Logout
            </button>
          </div>
        </div>

        <!-- Top Metrics Cards -->
        <div class="admin-stats-grid">
          <div class="admin-stat-card stat-today">
            <span class="stat-label">Today's Leads</span>
            <span class="stat-val">${stats.today || 0}</span>
          </div>
          <div class="admin-stat-card stat-new">
            <span class="stat-label">New Leads</span>
            <span class="stat-val">${stats.new || 0}</span>
          </div>
          <div class="admin-stat-card stat-contacted">
            <span class="stat-label">Contacted</span>
            <span class="stat-val">${stats.contacted || 0}</span>
          </div>
          <div class="admin-stat-card">
            <span class="stat-label">Follow-up</span>
            <span class="stat-val">${stats.followup || 0}</span>
          </div>
          <div class="admin-stat-card stat-converted">
            <span class="stat-label">Converted</span>
            <span class="stat-val">${stats.converted || 0}</span>
          </div>
          <div class="admin-stat-card">
            <span class="stat-label">Total Leads</span>
            <span class="stat-val">${stats.total || 0}</span>
          </div>
        </div>

        <!-- Filter and Search Bar -->
        <div class="admin-controls-card">
          <input 
            type="text" 
            class="admin-search-input" 
            placeholder="Search by visitor name, mobile number, or notes..." 
            value="${adminSearchTerm}"
            oninput="handleAdminSearch(this.value)"
          />

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <select class="admin-select" onchange="handleAdminStatusFilter(this.value)">
              <option value="all" ${adminFilterStatus === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="New" ${adminFilterStatus === 'New' ? 'selected' : ''}>New</option>
              <option value="Contacted" ${adminFilterStatus === 'Contacted' ? 'selected' : ''}>Contacted</option>
              <option value="Follow-up" ${adminFilterStatus === 'Follow-up' ? 'selected' : ''}>Follow-up</option>
              <option value="Converted" ${adminFilterStatus === 'Converted' ? 'selected' : ''}>Converted</option>
              <option value="Closed" ${adminFilterStatus === 'Closed' ? 'selected' : ''}>Closed</option>
            </select>

            <select class="admin-select" onchange="handleAdminServiceFilter(this.value)">
              <option value="all" ${adminFilterService === 'all' ? 'selected' : ''}>All Services</option>
              ${SERVICES.map(s => `<option value="${s.name}" ${adminFilterService === s.name ? 'selected' : ''}>${s.name}</option>`).join('')}
              <option value="Other / General Enquiry" ${adminFilterService === 'Other / General Enquiry' ? 'selected' : ''}>Other / General Enquiry</option>
            </select>

            <select class="admin-select" onchange="handleAdminSort(this.value)">
              <option value="newest" ${adminSortOrder === 'newest' ? 'selected' : ''}>Newest First</option>
              <option value="oldest" ${adminSortOrder === 'oldest' ? 'selected' : ''}>Oldest First</option>
            </select>
          </div>
        </div>

        <!-- Leads Table / Mobile Cards -->
        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Visitor Name</th>
                <th>Mobile Number</th>
                <th>Service Requested</th>
                <th>Status</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredLeads.length > 0 ? filteredLeads.map(lead => {
                const dateStr = new Date(lead.created_at).toLocaleString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', hour12: true
                });
                const statusClass = (lead.lead_status || 'New').toLowerCase().replace(' ', '-');

                return `
                  <tr>
                    <td style="font-size: 0.82rem; color: var(--color-text-muted); white-space: nowrap;">
                      ${dateStr}
                    </td>
                    <td>
                      <strong style="color: var(--color-primary);">${lead.visitor_name}</strong>
                      ${lead.email ? `<div style="font-size: 0.78rem; color: var(--color-text-muted);">${lead.email}</div>` : ''}
                    </td>
                    <td>
                      <div style="font-weight: 700; font-family: monospace; font-size: 0.95rem;">
                        ${lead.mobile_number}
                      </div>
                    </td>
                    <td>
                      <span style="font-size: 0.85rem; font-weight: 600;">${lead.service_requested}</span>
                    </td>
                    <td>
                      <span class="status-badge status-${statusClass}">${lead.lead_status || 'New'}</span>
                    </td>
                    <td style="font-size: 0.78rem; color: var(--color-text-muted);">
                      ${lead.source_page || '/'}
                    </td>
                    <td>
                      <div class="lead-quick-actions">
                        <a href="tel:+91${lead.mobile_number}" class="btn-lead-action btn-action-call" title="Call directly">
                          ${getIconHtml('phone')} Call
                        </a>
                        <a href="https://wa.me/91${lead.mobile_number}?text=${encodeURIComponent(`Hello ${lead.visitor_name}, this is DASTAVEZ MITRA regarding your enquiry for ${lead.service_requested}.`)}" target="_blank" rel="noopener noreferrer" class="btn-lead-action btn-action-wa" title="Open WhatsApp">
                          ${getIconHtml('whatsapp')} WhatsApp
                        </a>
                        <button class="btn-lead-action btn-action-edit" onclick="openLeadDetailModal('${lead.id}')">
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('') : `
                <tr>
                  <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--color-text-muted);">
                    No enquiries found matching your filters.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Global Filter Handlers for Service Search
function filterServices() {
  return SERVICES.filter(service => {
    const matchesCategory = currentCategory === 'all' || service.category === currentCategory;
    const query = currentSearchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      service.name.toLowerCase().includes(query) || 
      service.shortDescription.toLowerCase().includes(query) ||
      service.categoryName.toLowerCase().includes(query) ||
      service.slug.toLowerCase().includes(query) ||
      (service.documents && service.documents.some(doc => doc.toLowerCase().includes(query)));

    return matchesCategory && matchesSearch;
  });
}

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
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.classList.toggle('active', chip.getAttribute('onclick') && chip.getAttribute('onclick').includes(`'${categoryId}'`));
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

// ==========================================
// Lead Submission Handler
// ==========================================
window.handleLeadSubmit = async function(event, sourcePage = '/') {
  event.preventDefault();
  if (isSubmittingLead) return;

  const form = event.target;
  const alertBox = form.closest('.lead-card-box')?.querySelector('#leadFormAlert') || document.getElementById('leadFormAlert');
  const submitBtn = form.querySelector('button[type="submit"]');

  const name = form.visitor_name?.value?.trim();
  const mobile = form.mobile_number?.value?.trim();
  const service = form.service_requested?.value;
  const email = form.email?.value?.trim();
  const message = form.message?.value?.trim();
  const consent = form.consent?.checked;
  const website_hp = form.website_hp?.value;

  if (!name || name.length < 2) {
    if (alertBox) alertBox.innerHTML = '<div class="form-alert-error">Please enter your full name (minimum 2 characters).</div>';
    return;
  }

  if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
    if (alertBox) alertBox.innerHTML = '<div class="form-alert-error">Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).</div>';
    return;
  }

  if (!service) {
    if (alertBox) alertBox.innerHTML = '<div class="form-alert-error">Please select the service or work required.</div>';
    return;
  }

  if (!consent) {
    if (alertBox) alertBox.innerHTML = '<div class="form-alert-error">Please check the consent box to proceed.</div>';
    return;
  }

  isSubmittingLead = true;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Submitting...</span>`;
  }

  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitor_name: name,
        mobile_number: mobile,
        service_requested: service,
        email,
        message,
        consent_status: true,
        source_page: sourcePage || window.location.hash || '/',
        website_hp
      })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      const container = form.closest('.lead-card-box');
      if (container) {
        container.innerHTML = `
          <div class="lead-success-card">
            <div class="success-icon-circle">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 class="lead-success-title">Enquiry Received Successfully!</h3>
            <p class="lead-success-msg">
              Thank you, <strong>${name}</strong>. Your enquiry for <strong>${service}</strong> has been received. DASTAVEZ MITRA will contact you shortly on <strong>${mobile}</strong>.
            </p>
            <div class="success-actions-grid">
              <a href="tel:+919540403071" class="btn-card-call" style="padding: 0.85rem; justify-content: center; font-size: 0.95rem;">
                ${getIconHtml('phone')} Call: 9540403071
              </a>
              <a href="${getWhatsappLink(`Hello DASTAVEZ MITRA, I have submitted an enquiry for ${service} (Name: ${name}).`)}" target="_blank" rel="noopener noreferrer" class="btn-card-wa" style="padding: 0.85rem; justify-content: center; font-size: 0.95rem;">
                ${getIconHtml('whatsapp')} WhatsApp: 9871592002
              </a>
            </div>
          </div>
        `;
      }
    } else {
      if (alertBox) {
        alertBox.innerHTML = `<div class="form-alert-error">${data.error || 'Something went wrong. Please try again or contact us directly on WhatsApp.'}</div>`;
      }
    }
  } catch (err) {
    if (alertBox) {
      alertBox.innerHTML = '<div class="form-alert-error">Something went wrong. Please try again or contact us directly on WhatsApp at 9871592002.</div>';
    }
  } finally {
    isSubmittingLead = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `${getIconHtml('send')} <span>Submit Enquiry</span>`;
    }
  }
};

// ==========================================
// Admin Authentication & CRM Handlers
// ==========================================
window.handleAdminLogin = async function(e) {
  e.preventDefault();
  const password = document.getElementById('adminPassword')?.value;
  const alertBox = document.getElementById('adminLoginAlert');
  const submitBtn = document.getElementById('adminLoginBtn');

  if (!password) return;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Verifying...</span>';
  }

  try {
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const data = await res.json();
    if (res.ok && data.success && data.token) {
      adminToken = data.token;
      sessionStorage.setItem('dm_admin_token', adminToken);
      await fetchAdminData();
      router();
    } else {
      if (alertBox) {
        alertBox.innerHTML = `<div class="form-alert-error">${data.error || 'Invalid admin password.'}</div>`;
      }
    }
  } catch (err) {
    if (alertBox) {
      alertBox.innerHTML = '<div class="form-alert-error">Unable to connect to server. Please try again.</div>';
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Unlock CRM Dashboard</span>';
    }
  }
};

window.handleAdminLogout = function() {
  adminToken = null;
  sessionStorage.removeItem('dm_admin_token');
  adminLeadsData = [];
  adminStatsData = null;
  router();
};

async function fetchAdminData() {
  if (!adminToken) return;

  try {
    const [leadsRes, statsRes] = await Promise.all([
      fetch('/api/leads', { headers: { 'Authorization': `Bearer ${adminToken}` } }),
      fetch('/api/stats', { headers: { 'Authorization': `Bearer ${adminToken}` } })
    ]);

    if (leadsRes.status === 401 || statsRes.status === 401) {
      window.handleAdminLogout();
      return;
    }

    const leadsJson = await leadsRes.json();
    const statsJson = await statsRes.json();

    if (leadsJson.success) adminLeadsData = leadsJson.leads || [];
    if (statsJson.success) adminStatsData = statsJson.stats || null;

    if (window.location.hash === '#/admin') {
      const app = document.getElementById('app-root');
      if (app) app.innerHTML = renderAdminView();
    }
  } catch (err) {
    console.error('Error fetching admin CRM data:', err);
  }
}

function getFilteredAdminLeads() {
  return adminLeadsData.filter(lead => {
    const matchesStatus = adminFilterStatus === 'all' || (lead.lead_status || 'New').toLowerCase() === adminFilterStatus.toLowerCase();
    const matchesService = adminFilterService === 'all' || lead.service_requested === adminFilterService;
    const q = adminSearchTerm.toLowerCase().trim();
    const matchesSearch = !q ||
      lead.visitor_name.toLowerCase().includes(q) ||
      lead.mobile_number.includes(q) ||
      lead.service_requested.toLowerCase().includes(q) ||
      (lead.notes && lead.notes.toLowerCase().includes(q));

    return matchesStatus && matchesService && matchesSearch;
  }).sort((a, b) => {
    if (adminSortOrder === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at);
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });
}

window.handleAdminSearch = function(val) {
  adminSearchTerm = val;
  const app = document.getElementById('app-root');
  if (app && window.location.hash === '#/admin') app.innerHTML = renderAdminView();
};

window.handleAdminStatusFilter = function(val) {
  adminFilterStatus = val;
  const app = document.getElementById('app-root');
  if (app && window.location.hash === '#/admin') app.innerHTML = renderAdminView();
};

window.handleAdminServiceFilter = function(val) {
  adminFilterService = val;
  const app = document.getElementById('app-root');
  if (app && window.location.hash === '#/admin') app.innerHTML = renderAdminView();
};

window.handleAdminSort = function(val) {
  adminSortOrder = val;
  const app = document.getElementById('app-root');
  if (app && window.location.hash === '#/admin') app.innerHTML = renderAdminView();
};

// Lead Detail / Status Management Modal
window.openLeadDetailModal = function(leadId) {
  const lead = adminLeadsData.find(l => l.id === leadId);
  if (!lead) return;

  const modalOverlay = document.getElementById('serviceModal');
  const modalBody = document.getElementById('modalDynamicContent');
  if (!modalOverlay || !modalBody) return;

  const dateStr = new Date(lead.created_at).toLocaleString('en-IN');

  modalBody.innerHTML = `
    <div style="text-align: left;">
      <span class="status-badge status-${(lead.lead_status || 'New').toLowerCase()}">${lead.lead_status || 'New'}</span>
      <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: var(--color-primary); margin-top: 0.5rem;">
        ${lead.visitor_name}
      </h2>
      <p style="font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">
        Received on: <strong>${dateStr}</strong> • Source: <code>${lead.source_page || '/'}</code>
      </p>

      <div style="background: #f8fafc; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem; font-size: 0.92rem;">
        <div>📞 <strong>Mobile:</strong> <a href="tel:+91${lead.mobile_number}" style="color: var(--color-accent); font-weight: 700;">${lead.mobile_number}</a></div>
        ${lead.email ? `<div style="margin-top: 0.35rem;">✉️ <strong>Email:</strong> ${lead.email}</div>` : ''}
        <div style="margin-top: 0.35rem;">📑 <strong>Service Requested:</strong> ${lead.service_requested}</div>
        ${lead.message ? `<div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed #cbd5e1;">💬 <strong>Message:</strong> ${lead.message}</div>` : ''}
      </div>

      <form onsubmit="handleLeadUpdate(event, '${lead.id}')" style="display: flex; flex-direction: column; gap: 1rem;">
        <div class="form-group">
          <label class="form-label" for="editLeadStatus">Update Pipeline Status</label>
          <select id="editLeadStatus" name="lead_status" class="form-select">
            <option value="New" ${lead.lead_status === 'New' ? 'selected' : ''}>New</option>
            <option value="Contacted" ${lead.lead_status === 'Contacted' ? 'selected' : ''}>Contacted</option>
            <option value="Follow-up" ${lead.lead_status === 'Follow-up' ? 'selected' : ''}>Follow-up</option>
            <option value="Converted" ${lead.lead_status === 'Converted' ? 'selected' : ''}>Converted</option>
            <option value="Closed" ${lead.lead_status === 'Closed' ? 'selected' : ''}>Closed</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="editLeadNotes">Internal Staff Notes</label>
          <textarea id="editLeadNotes" name="notes" class="form-textarea" rows="3" placeholder="Add internal notes about conversation, rate discussed, appointment date...">${lead.notes || ''}</textarea>
        </div>

        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
          <button type="submit" class="btn-lead-submit" style="flex: 1; padding: 0.75rem;">
            Save Lead Updates
          </button>
        </div>
      </form>
    </div>
  `;

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.handleLeadUpdate = async function(e, leadId) {
  e.preventDefault();
  const form = e.target;
  const status = form.lead_status.value;
  const notes = form.notes.value;

  try {
    const res = await fetch('/api/update-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ id: leadId, lead_status: status, notes })
    });

    if (res.ok) {
      window.closeServiceModal();
      await fetchAdminData();
    } else {
      alert('Failed to update lead.');
    }
  } catch (err) {
    alert('Error updating lead.');
  }
};

window.exportLeadsCsv = function() {
  const leads = getFilteredAdminLeads();
  if (leads.length === 0) {
    alert('No leads to export.');
    return;
  }

  const headers = ['ID', 'Date', 'Visitor Name', 'Mobile Number', 'Email', 'Service', 'Status', 'Source', 'Notes'];
  const rows = leads.map(l => [
    l.id,
    `"${new Date(l.created_at).toISOString()}"`,
    `"${(l.visitor_name || '').replace(/"/g, '""')}"`,
    `"${l.mobile_number}"`,
    `"${(l.email || '').replace(/"/g, '""')}"`,
    `"${(l.service_requested || '').replace(/"/g, '""')}"`,
    `"${l.lead_status || 'New'}"`,
    `"${(l.source_page || '').replace(/"/g, '""')}"`,
    `"${(l.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `dastavez_mitra_leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Modal Handlers
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
      <span class="location-notice-badge" style="margin: 0; font-size: 0.78rem; padding: 0.2rem 0.6rem;">
        ${getIconHtml('map-pin')} Gurugram Only
      </span>
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

    ${renderServiceDocuments(service)}

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

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; padding-top: 0.5rem;">
      <a href="tel:+919540403071" class="btn-secondary" style="font-weight: 700; justify-content: center; padding: 0.85rem;">
        ${getIconHtml('phone')} Call 9540403071
      </a>
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary-wa" style="justify-content: center; padding: 0.85rem;">
        ${getIconHtml('whatsapp')} WhatsApp Us
      </a>
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

window.closeLeadModal = function() {
  const modalOverlay = document.getElementById('leadModal');
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
  window.closeLeadModal();

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
  } else if (hash === '/enquiry') {
    appContainer.innerHTML = renderEnquiryView();
  } else if (hash === '/documents') {
    appContainer.innerHTML = renderDocumentsView();
  } else if (hash === '/how-it-works') {
    appContainer.innerHTML = renderHowItWorksView();
  } else if (hash === '/about') {
    appContainer.innerHTML = renderAboutView();
  } else if (hash === '/contact') {
    appContainer.innerHTML = renderContactView();
  } else if (hash === '/privacy') {
    appContainer.innerHTML = renderLegalPrivacyView();
  } else if (hash === '/terms') {
    appContainer.innerHTML = renderLegalTermsView();
  } else if (hash === '/admin') {
    if (adminToken && adminLeadsData.length === 0) {
      fetchAdminData();
    }
    appContainer.innerHTML = renderAdminView();
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

  // Close modals when clicking backdrop
  ['serviceModal', 'leadModal'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          window.closeServiceModal();
          window.closeLeadModal();
        }
      });
    }
  });

  // Escape key closes modal or drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeServiceModal();
      window.closeLeadModal();
      window.toggleMobileMenu(false);
    }
  });

  // Preload admin stats if token present
  if (adminToken) {
    fetchAdminData();
  }
});
