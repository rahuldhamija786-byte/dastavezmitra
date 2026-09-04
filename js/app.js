import { BRAND_INFO, SERVICE_CATEGORIES, SERVICES, getWhatsappLink, getCallLink, getServiceBySlug } from './data/services.js';

// Global State
let currentCategory = 'all';
let currentSearchQuery = '';
let isSubmittingLead = false;

// Admin Session State
let adminToken = sessionStorage.getItem('dm_admin_token') || null;
let adminLeadsData = [];
let adminStatsData = null;
let adminFilterStatus = 'all';
let adminFilterService = 'all';
let adminSearchTerm = '';
let adminSortOrder = 'newest';

// Legal Mitra AI Chat State
let aiChatMessages = [
  {
    role: 'assistant',
    text: `Namaste! Main **Legal Mitra** (Legal Information Assistant) hoon.\n\nMain aapko Indian legal concepts aur documentation procedures simple language mein samjhane mein madad karta hoon.\n\nAap apna legal prashn pooch sakte hain (Jaise: *Unpaid salary, Cheque bounce Section 138, Traffic challan, BNS 2023 vs IPC 1860, Property agreement, Will distribution, ya Marriage registration*).`
  }
];
let isAiTyping = false;

// Check if current time is within calling hours (9 AM - 7 PM IST)
function isCallingHoursActive() {
  try {
    const istString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const istHours = new Date(istString).getHours();
    return istHours >= 9 && istHours < 19;
  } catch (err) {
    const totalMinutes = new Date().getUTCHours() * 60 + new Date().getUTCMinutes() + 330;
    const istHours = Math.floor(((totalMinutes % 1440) + 1440) % 1440 / 60);
    return istHours >= 9 && istHours < 19;
  }
}

// Contact Modal Controllers (Two Number Selection)
window.openCallModal = function() {
  const modal = document.getElementById('callModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeCallModal = function() {
  const modal = document.getElementById('callModal');
  if (modal) {
    modal.classList.remove('open');
    if (!document.querySelector('.modal-overlay.open')) {
      document.body.style.overflow = '';
    }
  }
};

window.openWhatsappModal = function(customMessage) {
  const modal = document.getElementById('whatsappModal');
  if (!modal) return;
  const msg = customMessage || BRAND_INFO.defaultWhatsappMessage;
  const link1 = document.getElementById('waModalLink1');
  const link2 = document.getElementById('waModalLink2');
  if (link1) {
    link1.href = `https://wa.me/919871592002?text=${encodeURIComponent(msg)}`;
  }
  if (link2) {
    link2.href = `https://wa.me/919540403071?text=${encodeURIComponent(msg)}`;
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeWhatsappModal = function() {
  const modal = document.getElementById('whatsappModal');
  if (modal) {
    modal.classList.remove('open');
    if (!document.querySelector('.modal-overlay.open')) {
      document.body.style.overflow = '';
    }
  }
};

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
    'credit-card': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
    'copy': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    'file-check': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 12 18 17 13"/></svg>',
    'check-circle': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    'layers': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    'whatsapp': '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.476-.15-.677.15-.2.301-.777.98-.952 1.18-.176.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.783-1.676-2.083-.175-.3-.019-.462.132-.612.135-.135.301-.351.451-.527.15-.175.2-.3.3-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.235-.244-.588-.492-.508-.677-.518l-.577-.01c-.2 0-.527.075-.802.376s-1.054 1.03-1.054 2.511 1.08 2.912 1.23 3.113c.15.201 2.126 3.246 5.151 4.553.72.31 1.282.496 1.72.635.723.23 1.38.198 1.9.12.58-.087 1.78-.727 2.03-1.43.25-.703.25-1.305.175-1.43-.075-.125-.276-.2-.577-.35zM12 2C6.477 2 2 6.477 2 12c0 1.892.525 3.663 1.438 5.178L2 22l4.97-1.398A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>',
    'instagram': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
    'phone': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    'map-pin': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    'send': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    'sparkles': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>'
  };

  return iconMap[iconName] || iconMap['file-text'];
}

// Render Document Details for Service View / Modal / Hub
function renderServiceDocuments(service) {
  let output = '';

  // 1. Statutory Hindi Notice (Age Requirement)
  if (service.ageRequirementHindi) {
    output += `
      <div class="statutory-hindi-notice">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>${service.ageRequirementHindi}</span>
      </div>
    `;
  }

  // 2. Personal Appearance / Notary Notice
  if (service.personalAppearanceNotice) {
    output += `
      <div class="statutory-hindi-notice" style="background: #f0fdf4; border-color: #86efac; color: #166534;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
        <span>${service.personalAppearanceNotice}</span>
      </div>
    `;
  }

  // 3. RTO Sub-Services
  if (service.subServices && service.subServices.length > 0) {
    output += `
      <div class="docs-alert-box" style="background: #f8fafc;">
        <div class="docs-alert-title" style="color: var(--color-primary); font-size: 1.05rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Available RTO Services & Sub-Services
        </div>
        <div class="rto-subservices-grid">
          ${service.subServices.map(sub => `
            <div class="rto-subservice-card">
              <div>
                <h4 class="rto-subservice-title">${sub.name}</h4>
                <p class="rto-subservice-desc">${sub.description}</p>
              </div>
              <button type="button" onclick="openWhatsappModal('Hello DASTAVEZ MITRA, I need assistance for RTO: ${escapeHtml(sub.name)}.')" class="btn-subservice-action">
                <span>Inquire on WhatsApp</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 4. Categorized Documents (Traffic Challan & Legal Heir)
  if (service.categorizedDocuments && service.categorizedDocuments.length > 0) {
    output += `
      <div class="docs-alert-box">
        <div class="docs-alert-title" style="margin-bottom: 1rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Required Documents Checklist
        </div>
        ${service.categorizedDocuments.map(cat => `
          <div class="categorized-doc-group">
            <div class="categorized-doc-group-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              ${cat.groupTitle}
            </div>
            <ul class="docs-checklist" style="margin-top: 0.35rem;">
              ${cat.items.map(item => `
                <li class="docs-checklist-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" style="margin-top: 3px; flex-shrink: 0;"><polyline points="20 6 9 17 4 12"/></svg>
                  <span><strong>${item}</strong></span>
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    `;
    return output;
  }

  // 5. Fallback Service Custom Box
  if (service.isFallbackService) {
    output += `
      <div class="docs-alert-box" style="background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-color: #cbd5e1;">
        <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--color-primary); margin-bottom: 0.5rem;">
          ${service.fallbackPromptHeading || 'कोई अन्य Specific Document यहाँ Mention नहीं है?'}
        </h3>
        <p style="font-size: 0.95rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 1.25rem;">
          ${service.fallbackPromptText || 'आप हमें अपना matter/message भेज सकते हैं। WhatsApp या Call के माध्यम से हम आपकी सहायता के लिए उपलब्ध हैं।'}
        </p>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button type="button" onclick="openCallModal()" class="btn-secondary" style="font-weight: 700; font-size: 0.9rem;">
            ${getIconHtml('phone')} Call: 9 AM – 7 PM
          </button>
          <button type="button" onclick="openWhatsappModal('${escapeHtml(service.whatsappMessage)}')" class="btn-primary-wa" style="font-size: 0.9rem;">
            ${getIconHtml('whatsapp')} WhatsApp Us
          </button>
        </div>
      </div>
    `;
    return output;
  }

  // 6. Gazette Sections
  if (service.gazetteSections) {
    const { under18, above18 } = service.gazetteSections;
    output += `
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
    return output;
  }

  // 7. Hindi Heading List (Marriage Registration)
  if (service.hindiHeading) {
    output += `
      <div class="docs-alert-box">
        <div class="docs-hindi-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <span>${service.hindiHeading}</span>
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
    return output;
  }

  // 8. Standard Checklist
  if (service.documents && service.documents.length > 0) {
    output += `
      <div class="docs-alert-box">
        <div class="docs-alert-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Required Documents Checklist
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
    return output;
  }

  return output;
}

// Render Embedded AI Drafting Trigger Box inside Service View
function renderAiDraftingTrigger(service) {
  if (!service.hasAiDrafting) return '';

  return `
    <div class="embedded-draft-trigger-box">
      <h4>
        ${getIconHtml('sparkles')}
        <span>AI Drafting Assistant</span>
      </h4>
      <p>Fill in our interactive dynamic questionnaire to instantly generate a preliminary draft of your ${service.name}.</p>
      <button class="btn-ai-draft-launcher" onclick="launchAiDrafting('${service.aiDraftingType}')">
        ${getIconHtml('sparkles')}
        <span>${service.aiDraftingButtonText || 'अपना Document Draft करें'}</span>
      </button>
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

// Render Service Card for Catalog & Home
function renderServiceCard(service) {
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
        <button class="btn-card-docs" onclick="openServiceDetail('${service.slug}')" aria-label="View Details & Documents for ${service.name}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          ${service.hasAiDrafting ? 'View & AI Draft' : 'Required Documents'}
        </button>
        
        <div class="card-action-row">
          <button type="button" onclick="openCallModal()" class="btn-card-call" aria-label="Call for ${escapeHtml(service.name)}">
            ${getIconHtml('phone')}
            Call
          </button>
          <button type="button" onclick="openWhatsappModal('${escapeHtml(service.whatsappMessage)}')" class="btn-card-wa" aria-label="WhatsApp for ${escapeHtml(service.name)}">
            ${getIconHtml('whatsapp')}
            WhatsApp
          </button>
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
            <button type="button" onclick="openWhatsappModal()" class="btn-primary-wa">
              ${getIconHtml('whatsapp')}
              WHATSAPP US
            </button>
            <button type="button" onclick="openCallModal()" class="btn-secondary">
              ${getIconHtml('phone')}
              CALL US (9 AM – 7 PM)
            </button>
          </div>

          <div class="hero-highlights">
            <div class="highlight-pill">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25d366" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Instant Checklist Guidance</span>
            </div>
            <div class="highlight-pill">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25d366" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Gurugram Court Assistance</span>
            </div>
            <div class="highlight-pill">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25d366" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Embedded AI Drafting</span>
            </div>
          </div>
        </div>

        <div class="hero-card-side">
          <div class="hero-summary-card">
            <div class="summary-card-header">
              <div class="summary-badge">⚡ Quick Assistance</div>
              <span class="location-notice-badge" style="margin: 0; font-size: 0.78rem;">
                ${getIconHtml('map-pin')} Gurugram Only
              </span>
            </div>

            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--color-primary); margin-bottom: 0.5rem;">
              Need Paperwork Assistance?
            </h3>
            <p style="font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">
              Select your required service from our catalog or chat with <strong>Legal Mitra</strong> for general legal information.
            </p>

            <div class="quick-feature-list">
              <a href="#/services/rc-transfer" class="quick-feature-item">
                <span class="quick-feature-icon">${getIconHtml('car')}</span>
                <span>RC Transfer Assistance</span>
              </a>
              <a href="#/services/rto" class="quick-feature-item">
                <span class="quick-feature-icon">${getIconHtml('truck')}</span>
                <span>RTO Tax, Fitness & Challans</span>
              </a>
              <a href="#/services/affidavit" class="quick-feature-item">
                <span class="quick-feature-icon">${getIconHtml('file-text')}</span>
                <span>Affidavit & AI Drafting</span>
              </a>
              <a href="#/legal-mitra" class="quick-feature-item" style="border-color: #7dd3fc; background: #f0f9ff;">
                <span class="quick-feature-icon">⚖️</span>
                <span style="font-weight: 700; color: #0284c7;">Ask Legal Mitra AI</span>
              </a>
            </div>

            <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; color: var(--color-text-muted);">
              <span>Direct Support Desk:</span>
              <strong style="color: var(--color-primary);">Court Hall 8, Gurugram</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Catalog Section -->
    <section class="container" style="padding-top: 1rem; padding-bottom: 4rem;">
      <div class="section-header">
        <span class="section-tag">Explore Paperwork</span>
        <h2 class="section-title">Our Documentation Services</h2>
        <div>
          <span class="location-notice-badge">
            ${getIconHtml('map-pin')}
            ${BRAND_INFO.serviceLocationNotice}
          </span>
        </div>
        <p class="section-subtitle">Browse through our documentation assistance services or search for specific paperwork.</p>
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
            placeholder="Search services (e.g. RC Transfer, RTO, Challan, Marriage, Affidavit, Will, GPA)..." 
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
        ${filtered.map(renderServiceCard).join('')}
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Simple & Transparent</span>
          <h2 class="section-title">How DASTAVEZ MITRA Works</h2>
          <p class="section-subtitle">Get your paperwork sorted smoothly in 4 simple steps.</p>
        </div>

        <div class="steps-grid">
          <div class="step-card">
            <div class="step-badge">1</div>
            <h3 class="step-title">Choose Service / AI Draft</h3>
            <p class="step-desc">Select your required paperwork or use our embedded AI drafting assistant to generate a preliminary draft.</p>
          </div>

          <div class="step-card">
            <div class="step-badge">2</div>
            <h3 class="step-title">Check Required Documents</h3>
            <p class="step-desc">Click "Required Documents" to review the guidelines and document checklist before proceeding.</p>
          </div>

          <div class="step-card">
            <div class="step-badge">3</div>
            <h3 class="step-title">Call or WhatsApp</h3>
            <p class="step-desc">Connect on WhatsApp (24/7) or call Helpline (Calling Hours: 9 AM – 7 PM) for immediate consultation.</p>
          </div>

          <div class="step-card">
            <div class="step-badge">4</div>
            <h3 class="step-title">Get Assistance</h3>
            <p class="step-desc">Receive clear guidance, form preparation help, and step-by-step assistance until completion in Gurugram.</p>
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
          <button type="button" onclick="openCallModal()" class="btn-secondary" style="font-size: 1rem; padding: 0.85rem 1.5rem; font-weight: 700;">
            ${getIconHtml('phone')}
            CALL US (9 AM – 7 PM)
          </button>
          <button type="button" onclick="openWhatsappModal()" class="btn-primary-wa" style="font-size: 1rem; padding: 0.85rem 1.5rem;">
            ${getIconHtml('whatsapp')}
            WHATSAPP US
          </button>
        </div>
      </div>
    </section>
  `;
}

// Render Dedicated Legal Mitra Assistant Page View
function renderLegalAssistantView() {
  return `
    <div class="ai-assistant-wrapper">
      <div class="container">
        <div class="ai-assistant-card">
          <!-- Header -->
          <div class="ai-chat-header">
            <div class="ai-chat-header-info">
              <div class="ai-bot-avatar">⚖️</div>
              <div>
                <h2 class="ai-bot-title">Legal Mitra</h2>
                <p class="ai-bot-subtitle">Legal Information Assistant</p>
              </div>
            </div>

            <span class="ai-calling-status-badge">
              📞 Calling Hours: 9 AM – 7 PM
            </span>
          </div>

          <!-- Disclaimer Bar -->
          <div class="ai-chat-disclaimer-bar">
            <strong>Disclaimer:</strong> Legal Mitra provides general legal information for educational purposes only. It is not a substitute for individual legal advice or representation.
          </div>

          <!-- Messages Area -->
          <div class="ai-chat-messages" id="mainChatMessages">
            ${renderMessagesHtml(aiChatMessages)}
          </div>

          <!-- Quick Suggestions -->
          <div class="chat-quick-prompts">
            <button class="prompt-chip" onclick="sendMainQuery('My employer has not paid my salary. What can I do?')">💼 Unpaid Salary</button>
            <button class="prompt-chip" onclick="sendMainQuery('Cheque bounce Section 138 notice procedure and timeline')">💳 Cheque Bounce</button>
            <button class="prompt-chip" onclick="sendMainQuery('What is Bharatiya Nyaya Sanhita (BNS) vs IPC applicability?')">⚖️ BNS vs IPC</button>
            <button class="prompt-chip" onclick="sendMainQuery('Traffic challan received. How to resolve in Virtual Court?')">🚗 Traffic Challan</button>
            <button class="prompt-chip" onclick="sendMainQuery('What documents are required for marriage registration in Gurugram?')">💍 Marriage Registration</button>
            <button class="prompt-chip" onclick="sendMainQuery('What is the procedure for Legal Heir Certificate?')">📑 Legal Heir Certificate</button>
          </div>

          <!-- Input Area -->
          <form class="ai-chat-input-area" onsubmit="handleMainChatSubmit(event)">
            <input 
              type="text" 
              id="mainChatInput" 
              class="ai-chat-input" 
              placeholder="Ask a legal query in simple Hindi, Hinglish or English..." 
              maxlength="500" 
              autocomplete="off"
            />
            <button type="submit" class="btn-ai-send" id="mainChatSendBtn" aria-label="Send legal query">
              ${getIconHtml('send')}
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}

// Convert message text formatting (Markdown bold/lists to safe HTML)
function formatMessageText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n• /g, '<br/>• ')
    .replace(/\n---/g, '<hr/>');
}

// Render Chat Messages List HTML
function renderMessagesHtml(messages) {
  return messages.map(m => {
    if (m.role === 'user') {
      return `
        <div class="chat-bubble user">
          ${formatMessageText(m.text)}
        </div>
      `;
    }

    return `
      <div class="chat-bubble bot">
        <div>${formatMessageText(m.text)}</div>
        <div class="chat-cta-box">
          <div class="chat-cta-prompt">क्या आप अपनी समस्या या डॉक्यूमेंट के बारे में expert assistance चाहते हैं?</div>
          <div class="chat-cta-actions">
            <button type="button" onclick="openCallModal()" class="btn-card-call" style="padding: 0.45rem 0.8rem; font-size: 0.8rem;">
              ${getIconHtml('phone')} Call: 9 AM – 7 PM
            </button>
            <button type="button" onclick="openWhatsappModal('Hello DASTAVEZ MITRA, I was consulting Legal Mitra and want assistance with my paperwork.')" class="btn-card-wa" style="padding: 0.45rem 0.8rem; font-size: 0.8rem;">
              ${getIconHtml('whatsapp')} WhatsApp Us
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Execute Legal Mitra Chat Query
async function executeChatQuery(queryText) {
  if (!queryText || !queryText.trim() || isAiTyping) return;

  const cleanQuery = queryText.trim();
  aiChatMessages.push({ role: 'user', text: cleanQuery });

  isAiTyping = true;
  updateChatUIs();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: cleanQuery })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      aiChatMessages.push({ role: 'assistant', text: data.reply });
    } else {
      aiChatMessages.push({
        role: 'assistant',
        text: data.error || 'Aapke query ko process karne mein takleef hui. Kripya hamare helpline par WhatsApp (9871592002) ya call (9540403071) karein.'
      });
    }
  } catch (err) {
    aiChatMessages.push({
      role: 'assistant',
      text: 'Aapke prashn ke sambandh mein immediate assistance ke liye hamare helpline par sampark karein:\n\n• 💬 **WhatsApp (24/7):** 9871592002\n• 📞 **Call (9 AM–7 PM):** 9540403071\n\n*DASTAVEZ MITRA desk par direct consultation prapt karein.*'
    });
  } finally {
    isAiTyping = false;
    updateChatUIs();
  }
}

function updateChatUIs() {
  const mainMessages = document.getElementById('mainChatMessages');
  if (mainMessages) {
    mainMessages.innerHTML = renderMessagesHtml(aiChatMessages) + (isAiTyping ? '<div class="chat-bubble bot" style="opacity: 0.7;"><em>Legal Mitra is thinking...</em></div>' : '');
    mainMessages.scrollTop = mainMessages.scrollHeight;
  }

  const floatingMessages = document.getElementById('floatingChatMessages');
  if (floatingMessages) {
    floatingMessages.innerHTML = renderMessagesHtml(aiChatMessages) + (isAiTyping ? '<div class="chat-bubble bot" style="opacity: 0.7;"><em>Typing...</em></div>' : '');
    floatingMessages.scrollTop = floatingMessages.scrollHeight;
  }
}

window.handleMainChatSubmit = function(e) {
  e.preventDefault();
  const input = document.getElementById('mainChatInput');
  if (!input) return;
  const val = input.value;
  input.value = '';
  executeChatQuery(val);
};

window.sendMainQuery = function(promptText) {
  executeChatQuery(promptText);
};

window.handleFloatingChatSubmit = function(e) {
  e.preventDefault();
  const input = document.getElementById('floatingChatInput');
  if (!input) return;
  const val = input.value;
  input.value = '';
  executeChatQuery(val);
};

window.sendFloatingQuery = function(promptText) {
  executeChatQuery(promptText);
};

window.toggleFloatingAiWidget = function(forceState) {
  const drawer = document.getElementById('floatingAiDrawer');
  if (!drawer) return;

  const isOpen = forceState !== undefined ? forceState : !drawer.classList.contains('open');
  drawer.classList.toggle('open', isOpen);
  drawer.setAttribute('aria-hidden', (!isOpen).toString());

  if (isOpen) {
    updateChatUIs();
    const input = document.getElementById('floatingChatInput');
    if (input) setTimeout(() => input.focus(), 150);
  }
};

// ==========================================
// Embedded AI Drafting Feature Implementation
// ==========================================
window.launchAiDrafting = function(draftType) {
  const modalOverlay = document.getElementById('serviceModal');
  const modalBody = document.getElementById('modalDynamicContent');
  if (!modalOverlay || !modalBody) return;

  if (draftType === 'affidavit') {
    modalBody.innerHTML = renderAffidavitDraftingWizard();
  } else if (draftType === 'agreement') {
    modalBody.innerHTML = renderAgreementDraftingWizard();
  } else if (draftType === 'will') {
    modalBody.innerHTML = renderWillDraftingWizard();
  } else if (draftType === 'gpa-spa') {
    modalBody.innerHTML = renderGpaSpaDraftingWizard();
  }

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

// 1. Affidavit AI Drafting Wizard
function renderAffidavitDraftingWizard() {
  return `
    <div class="draft-wizard-container">
      <div class="draft-wizard-header">
        <h3 class="draft-wizard-title">
          ${getIconHtml('sparkles')}
          <span>अपना Affidavit Draft करें</span>
        </h3>
        <p class="draft-wizard-desc">Interactive AI Questionnaire for Affidavit Preparation</p>
      </div>

      <form id="affidavitDraftForm" onsubmit="handleAffidavitDraftSubmit(event)">
        <div class="draft-card-section">
          <div class="draft-card-section-title">1. Affidavit Purpose & Submitting Authority</div>
          <div class="draft-input-grid">
            <div>
              <label class="draft-label" for="affPurpose">Affidavit Purpose / Matter *</label>
              <select id="affPurpose" class="draft-select" required onchange="handleAffPurposeChange(this.value)">
                <option value="Name Discrepancy / Name Change">Name Discrepancy / Spelling Correction</option>
                <option value="Address Proof / Residence Declaration">Address Proof / Residence Declaration</option>
                <option value="Date of Birth (DOB) Declaration">Date of Birth (DOB) Declaration</option>
                <option value="Relationship / Family Member Declaration">Relationship / Family Declaration</option>
                <option value="Education / Gap Year / College Admission">Education / Gap Year / Admission</option>
                <option value="Vehicle NOC / Sale / Duplicate RC Declaration">Vehicle / RTO Declaration</option>
                <option value="Loss of Document / Certificate">Loss of Document / Certificate</option>
                <option value="Court / Police / Government Submission">Government / Court Submission</option>
                <option value="Other Custom Purpose">Other Custom Purpose</option>
              </select>
            </div>
            <div>
              <label class="draft-label" for="affAuthority">Submitting To (Authority / Dept) *</label>
              <input type="text" id="affAuthority" class="draft-input" placeholder="e.g. Passport Office / RTO / Bank / Court" required />
            </div>
          </div>
        </div>

        <div class="draft-card-section">
          <div class="draft-card-section-title">2. Deponent Particulars (व्यक्ति की Details)</div>
          <div class="draft-input-grid">
            <div>
              <label class="draft-label" for="affName">Deponent Full Name *</label>
              <input type="text" id="affName" class="draft-input" placeholder="Full name as per Aadhaar" required minlength="2" />
            </div>
            <div>
              <label class="draft-label" for="affRelative">Father's / Husband's Name *</label>
              <input type="text" id="affRelative" class="draft-input" placeholder="Father or Husband name" required />
            </div>
            <div>
              <label class="draft-label" for="affAge">Age (Years) *</label>
              <input type="number" id="affAge" class="draft-input" placeholder="e.g. 32" min="18" max="100" required />
            </div>
            <div>
              <label class="draft-label" for="affAadhaar">Aadhaar Number (Last 4 digits or Full) *</label>
              <input type="text" id="affAadhaar" class="draft-input" placeholder="e.g. 1234 XXXX 5678" required />
            </div>
          </div>
          <div style="margin-top: 0.75rem;">
            <label class="draft-label" for="affAddress">Complete Residential Address *</label>
            <input type="text" id="affAddress" class="draft-input" placeholder="House/Flat No., Street, Sector, Gurugram, Haryana" required />
          </div>
        </div>

        <div class="draft-card-section">
          <div class="draft-card-section-title">3. Relevant Facts & Statements (तथ्य)</div>
          <div id="affDynamicFacts">
            <label class="draft-label" for="affCustomFacts">Statement of Facts / Specific Reason *</label>
            <textarea id="affCustomFacts" class="draft-textarea" rows="3" placeholder="State your exact declaration (e.g. My name in 10th marksheet is Rahul Kumar and in Aadhaar it is Rahul Dhamija, both names belong to one and the same person...)" required></textarea>
          </div>
        </div>

        <div class="statutory-hindi-notice">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <strong>नोटरी के लिए आपकी व्यक्तिगत उपस्थिति अनिवार्य होगी।</strong><br/>
            <span>यह एक प्रारंभिक ड्राफ्ट तैयार करेगा। अंतिम सत्यापन और ई-स्टैंप पेपर प्रिंटिंग DASTAVEZ MITRA द्वारा की जाएगी।</span>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
          <button type="submit" class="btn-lead-submit" id="btnGenerateAffDraft" style="flex: 1; padding: 0.85rem;">
            ${getIconHtml('sparkles')}
            <span>Generate Preliminary Affidavit Draft</span>
          </button>
        </div>
      </form>

      <div id="affDraftResult" style="display: none; margin-top: 1.5rem;"></div>
    </div>
  `;
}

window.handleAffPurposeChange = function(val) {
  const textarea = document.getElementById('affCustomFacts');
  if (!textarea) return;

  if (val.includes('Name Discrepancy')) {
    textarea.placeholder = "State both name spellings (e.g. In marksheets my name is spelled 'Rahul Kumar' and in Aadhaar it is 'Rahul', both belong to one and the same person).";
  } else if (val.includes('Address Proof')) {
    textarea.placeholder = "State your residential stay period and that you are residing at the specified address.";
  } else if (val.includes('Date of Birth')) {
    textarea.placeholder = "State your correct date of birth and reference supporting records.";
  } else if (val.includes('Gap Year')) {
    textarea.placeholder = "State the academic gap period (e.g. 2023 to 2024) and that you did not engage in any unlawful activity.";
  } else {
    textarea.placeholder = "State the key factual declarations required for this affidavit.";
  }
};

window.handleAffidavitDraftSubmit = async function(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('btnGenerateAffDraft');
  const resultContainer = document.getElementById('affDraftResult');

  const data = {
    purpose: form.affPurpose.value,
    submittingAuthority: form.affAuthority.value,
    deponentName: form.affName.value,
    relativeName: form.affRelative.value,
    age: form.affAge.value,
    idNumber: form.affAadhaar.value,
    address: form.affAddress.value,
    customFacts: form.affCustomFacts.value
  };

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>Drafting Preliminary Affidavit...</span>';
  }

  try {
    const res = await fetch('/api/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draftType: 'affidavit', data })
    });

    const json = await res.json();
    if (res.ok && json.success && json.draft) {
      renderGeneratedDraftPreview(resultContainer, json.draft, 'Affidavit', data.deponentName);
    } else {
      alert(json.error || 'Failed to generate draft.');
    }
  } catch (err) {
    alert('Error generating preliminary draft. Please try again.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `${getIconHtml('sparkles')} <span>Generate Preliminary Affidavit Draft</span>`;
    }
  }
};

// 2. Agreement AI Drafting Wizard (Multi-party & Vehicle Rental support)
let agreementPartiesList = [
  { label: 'First Party (Owner / Lessor / Party 1)', name: '', address: '', id: '', role: 'Owner' },
  { label: 'Second Party (Tenant / Lessee / Party 2)', name: '', address: '', id: '', role: 'User' }
];

function renderAgreementDraftingWizard() {
  agreementPartiesList = [
    { label: 'First Party (Party 1)', name: '', address: '', id: '', role: 'First Party' },
    { label: 'Second Party (Party 2)', name: '', address: '', id: '', role: 'Second Party' }
  ];

  return `
    <div class="draft-wizard-container">
      <div class="draft-wizard-header">
        <h3 class="draft-wizard-title">
          ${getIconHtml('sparkles')}
          <span>अपना Agreement Draft करें</span>
        </h3>
        <p class="draft-wizard-desc">Interactive Detailed Questionnaire for Legal & Commercial Contracts</p>
      </div>

      <form id="agreementDraftForm" onsubmit="handleAgreementDraftSubmit(event)">
        <!-- Step 1: Agreement Type & Duration -->
        <div class="draft-card-section">
          <div class="draft-card-section-title">1. Agreement Type & Purpose</div>
          <div class="draft-input-grid">
            <div>
              <label class="draft-label" for="agType">Type of Agreement *</label>
              <select id="agType" class="draft-select" required onchange="handleAgTypeChange(this.value)">
                <option value="Residential Rent Agreement">Residential Rent Agreement</option>
                <option value="Commercial Lease Agreement">Commercial Lease Agreement</option>
                <option value="Vehicle Rental Agreement">Vehicle Rental Agreement</option>
                <option value="Vehicle Sale Agreement">Vehicle Sale Agreement</option>
                <option value="Partnership Deed / Business Agreement">Partnership Deed</option>
                <option value="Service & Freelance Contract">Service & Freelance Contract</option>
                <option value="Loan / Financial Agreement">Loan / Financial Agreement</option>
                <option value="Other Custom Agreement">Other Custom Agreement</option>
              </select>
            </div>
            <div>
              <label class="draft-label" for="agDuration">Agreement Duration / Tenure *</label>
              <input type="text" id="agDuration" class="draft-input" placeholder="e.g. 11 Months / 1 Year / 30 Days" required />
            </div>
          </div>
        </div>

        <!-- Step 2: Parties Identification (2, 3, 4+ Parties) -->
        <div class="draft-card-section">
          <div class="draft-card-section-title">
            <span>2. Parties Involved (All Contracting Parties)</span>
            <button type="button" class="btn-add-dynamic-item" onclick="addAgreementParty()">
              + Add Another Party (3rd / 4th Party)
            </button>
          </div>
          <div id="agPartiesContainer">
            ${renderAgPartiesFields()}
          </div>
        </div>

        <!-- Step 3: Specific Terms & Conditions (Dynamically Adapts) -->
        <div class="draft-card-section" id="agSpecificTermsSection">
          ${renderAgSpecificFields('Residential Rent Agreement')}
        </div>

        <!-- Step 4: Confirmation Notice -->
        <div class="statutory-hindi-notice" style="background: #eff6ff; border-color: #93c5fd; color: #1e40af;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <div>
            <strong>Preliminary Verification Notice:</strong><br/>
            <span>This generates a structured preliminary agreement. Final stamp duty payment, execution, and witness verification must be completed in accordance with applicable requirements.</span>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
          <button type="submit" class="btn-lead-submit" id="btnGenerateAgDraft" style="flex: 1; padding: 0.85rem;">
            ${getIconHtml('sparkles')}
            <span>Confirm & Generate Preliminary Agreement Draft</span>
          </button>
        </div>
      </form>

      <div id="agDraftResult" style="display: none; margin-top: 1.5rem;"></div>
    </div>
  `;
}

function renderAgPartiesFields() {
  return agreementPartiesList.map((p, idx) => `
    <div class="dynamic-item-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <strong style="font-size: 0.88rem; color: var(--color-primary);">Party #${idx + 1}: ${p.label}</strong>
        ${idx >= 2 ? `<button type="button" class="btn-remove-dynamic-item" onclick="removeAgreementParty(${idx})">Remove</button>` : ''}
      </div>
      <div class="draft-input-grid">
        <div>
          <label class="draft-label">Full Name *</label>
          <input type="text" class="draft-input" id="agPartyName_${idx}" placeholder="Full Name" required value="${p.name || ''}" />
        </div>
        <div>
          <label class="draft-label">Aadhaar / ID Details *</label>
          <input type="text" class="draft-input" id="agPartyId_${idx}" placeholder="Aadhaar / PAN" required value="${p.id || ''}" />
        </div>
      </div>
      <div style="margin-top: 0.5rem;">
        <label class="draft-label">Complete Address *</label>
        <input type="text" class="draft-input" id="agPartyAddr_${idx}" placeholder="Residential / Office Address" required value="${p.address || ''}" />
      </div>
    </div>
  `).join('');
}

window.addAgreementParty = function() {
  const nextNum = agreementPartiesList.length + 1;
  const labels = ['', '', 'Third Party', 'Fourth Party', 'Fifth Party'];
  agreementPartiesList.push({
    label: labels[nextNum - 1] || `Party #${nextNum}`,
    name: '',
    address: '',
    id: '',
    role: 'Partner / Participant'
  });
  const container = document.getElementById('agPartiesContainer');
  if (container) container.innerHTML = renderAgPartiesFields();
};

window.removeAgreementParty = function(idx) {
  if (agreementPartiesList.length > 2) {
    agreementPartiesList.splice(idx, 1);
    const container = document.getElementById('agPartiesContainer');
    if (container) container.innerHTML = renderAgPartiesFields();
  }
};

window.handleAgTypeChange = function(selectedType) {
  const termsSection = document.getElementById('agSpecificTermsSection');
  if (termsSection) {
    termsSection.innerHTML = renderAgSpecificFields(selectedType);
  }
};

function renderAgSpecificFields(type) {
  if (type.includes('Vehicle Rental')) {
    return `
      <div class="draft-card-section-title">3. Vehicle & Commercial Particulars (Vehicle Rental)</div>
      <div class="draft-input-grid">
        <div>
          <label class="draft-label">Vehicle Make & Model *</label>
          <input type="text" id="agVehicleModel" class="draft-input" placeholder="e.g. Maruti Swift / Hyundai Creta" required />
        </div>
        <div>
          <label class="draft-label">Vehicle Registration No. *</label>
          <input type="text" id="agVehicleReg" class="draft-input" placeholder="e.g. HR-26-XX-XXXX" required />
        </div>
        <div>
          <label class="draft-label">Chassis Number</label>
          <input type="text" id="agChassis" class="draft-input" placeholder="Chassis No. (as per RC)" />
        </div>
        <div>
          <label class="draft-label">Engine Number</label>
          <input type="text" id="agEngine" class="draft-input" placeholder="Engine No. (as per RC)" />
        </div>
        <div>
          <label class="draft-label">Rent Amount (Rs.) *</label>
          <input type="text" id="agRentAmount" class="draft-input" placeholder="e.g. 25,000 / month" required />
        </div>
        <div>
          <label class="draft-label">Security Deposit (Rs.) *</label>
          <input type="text" id="agDeposit" class="draft-input" placeholder="e.g. 15,000" required />
        </div>
        <div>
          <label class="draft-label">Fuel Responsibility *</label>
          <select id="agFuel" class="draft-select">
            <option value="Second Party (Renter / Hirer)">Second Party (Renter / Hirer)</option>
            <option value="First Party (Owner)">First Party (Owner)</option>
          </select>
        </div>
        <div>
          <label class="draft-label">Maintenance Responsibility *</label>
          <select id="agMaintenance" class="draft-select">
            <option value="First Party (Routine wear/tear by Owner)">First Party (Owner)</option>
            <option value="Second Party (Renter / Hirer)">Second Party (Renter)</option>
          </select>
        </div>
      </div>
    `;
  }

  if (type.includes('Rent') || type.includes('Lease')) {
    return `
      <div class="draft-card-section-title">3. Property & Tenancy Particulars</div>
      <div style="margin-bottom: 0.75rem;">
        <label class="draft-label">Rental Property Address *</label>
        <input type="text" id="agPropAddr" class="draft-input" placeholder="Complete address of the rented premises in Gurugram" required />
      </div>
      <div class="draft-input-grid">
        <div>
          <label class="draft-label">Monthly Rent Amount (Rs.) *</label>
          <input type="text" id="agRentAmount" class="draft-input" placeholder="e.g. 22,000" required />
        </div>
        <div>
          <label class="draft-label">Refundable Security Deposit (Rs.) *</label>
          <input type="text" id="agDeposit" class="draft-input" placeholder="e.g. 44,000" required />
        </div>
        <div>
          <label class="draft-label">Notice Period for Termination *</label>
          <input type="text" id="agNotice" class="draft-input" placeholder="e.g. 1 Month" value="1 Month" required />
        </div>
        <div>
          <label class="draft-label">Permitted Use *</label>
          <select id="agUse" class="draft-select">
            <option value="Residential Living">Residential Living</option>
            <option value="Commercial Office / Store">Commercial Office / Store</option>
          </select>
        </div>
      </div>
    `;
  }

  return `
    <div class="draft-card-section-title">3. Commercial Terms & Obligations</div>
    <div class="draft-input-grid">
      <div>
        <label class="draft-label">Consideration / Payment Amount *</label>
        <input type="text" id="agConsideration" class="draft-input" placeholder="e.g. Rs. 50,000 / As per milestones" required />
      </div>
      <div>
        <label class="draft-label">Notice Period *</label>
        <input type="text" id="agNotice" class="draft-input" placeholder="e.g. 30 Days" value="30 Days" required />
      </div>
    </div>
    <div style="margin-top: 0.75rem;">
      <label class="draft-label">Key Mutually Agreed Terms / Deliverables *</label>
      <textarea id="agCustomTerms" class="draft-textarea" rows="3" placeholder="Describe the main responsibilities, delivery schedule, and payment conditions..." required></textarea>
    </div>
  `;
}

window.handleAgreementDraftSubmit = async function(e) {
  e.preventDefault();
  const btn = document.getElementById('btnGenerateAgDraft');
  const resultContainer = document.getElementById('agDraftResult');

  const agType = document.getElementById('agType')?.value;
  const agDuration = document.getElementById('agDuration')?.value;

  // Collect Parties
  const parties = agreementPartiesList.map((p, idx) => ({
    label: p.label,
    name: document.getElementById(`agPartyName_${idx}`)?.value || `Party ${idx + 1}`,
    id: document.getElementById(`agPartyId_${idx}`)?.value || 'Aadhaar Verified',
    address: document.getElementById(`agPartyAddr_${idx}`)?.value || 'Gurugram'
  }));

  const data = {
    agreementType: agType,
    duration: agDuration,
    parties,
    isVehicleRental: agType.includes('Vehicle Rental'),
    vehicleModel: document.getElementById('agVehicleModel')?.value,
    vehicleRegNo: document.getElementById('agVehicleReg')?.value,
    chassisNo: document.getElementById('agChassis')?.value,
    engineNo: document.getElementById('agEngine')?.value,
    fuelResponsibility: document.getElementById('agFuel')?.value,
    maintenanceResponsibility: document.getElementById('agMaintenance')?.value,
    isRentAgreement: agType.includes('Rent') || agType.includes('Lease'),
    propertyAddress: document.getElementById('agPropAddr')?.value,
    rentAmount: document.getElementById('agRentAmount')?.value,
    securityDeposit: document.getElementById('agDeposit')?.value,
    noticePeriod: document.getElementById('agNotice')?.value,
    permittedUse: document.getElementById('agUse')?.value,
    consideration: document.getElementById('agConsideration')?.value,
    purpose: document.getElementById('agCustomTerms')?.value
  };

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>Generating Preliminary Agreement...</span>';
  }

  try {
    const res = await fetch('/api/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draftType: 'agreement', data })
    });

    const json = await res.json();
    if (res.ok && json.success && json.draft) {
      renderGeneratedDraftPreview(resultContainer, json.draft, agType, parties[0].name);
    } else {
      alert(json.error || 'Failed to generate agreement draft.');
    }
  } catch (err) {
    alert('Error generating agreement draft. Please try again.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `${getIconHtml('sparkles')} <span>Confirm & Generate Preliminary Agreement Draft</span>`;
    }
  }
};

// 3. Will / Testament AI Drafting Wizard (5-Step Structured Interview)
let willImmovableAssets = [];
let willMovableAssets = [];

function renderWillDraftingWizard() {
  willImmovableAssets = [
    { propertyType: 'Residential House / Flat', address: '', share: '100%', beneficiaryName: '', relation: '', conditions: '', alternateBeneficiary: '' }
  ];
  willMovableAssets = [
    { assetType: 'Bank Account & Fixed Deposits', details: '', share: '100%', beneficiaryName: '', relation: '', specialNotes: '' }
  ];

  return `
    <div class="draft-wizard-container">
      <div class="draft-wizard-header">
        <h3 class="draft-wizard-title">
          ${getIconHtml('sparkles')}
          <span>अपनी Will Draft करें</span>
        </h3>
        <p class="draft-wizard-desc">Step-by-Step Structured Will & Testament Drafting Interview</p>
      </div>

      <form id="willDraftForm" onsubmit="handleWillDraftSubmit(event)">
        <!-- Step 1: Testator Details -->
        <div class="draft-card-section">
          <div class="draft-card-section-title">STEP 1: Testator Details (वसीयतकर्ता)</div>
          <div class="draft-input-grid">
            <div>
              <label class="draft-label" for="willTestatorName">Testator Full Name *</label>
              <input type="text" id="willTestatorName" class="draft-input" placeholder="Full name of Testator" required />
            </div>
            <div>
              <label class="draft-label" for="willRelativeName">Father's / Husband's Name *</label>
              <input type="text" id="willRelativeName" class="draft-input" placeholder="Father or Husband name" required />
            </div>
            <div>
              <label class="draft-label" for="willAge">Age (Years) *</label>
              <input type="number" id="willAge" class="draft-input" placeholder="Age" min="18" max="110" required />
            </div>
            <div>
              <label class="draft-label" for="willAadhaar">Aadhaar Number *</label>
              <input type="text" id="willAadhaar" class="draft-input" placeholder="Aadhaar Card No." required />
            </div>
          </div>
          <div style="margin-top: 0.75rem;">
            <label class="draft-label" for="willAddress">Residential Address *</label>
            <input type="text" id="willAddress" class="draft-input" placeholder="Complete address in Gurugram" required />
          </div>
          <div style="margin-top: 0.75rem;">
            <label class="draft-label" for="willExecutor">Executor / Sole Admin Name *</label>
            <input type="text" id="willExecutor" class="draft-input" placeholder="Name of Executor to administer the Will" required />
          </div>
        </div>

        <!-- Step 2 & 3: Immovable Assets -->
        <div class="draft-card-section">
          <div class="draft-card-section-title">
            <span>STEP 2A: Immovable Properties (मकान, प्लॉट, जमीन)</span>
            <button type="button" class="btn-add-dynamic-item" onclick="addWillImmovableAsset()">
              + Add Another Property
            </button>
          </div>
          <div id="willImmovableContainer">
            ${renderWillImmovableFields()}
          </div>
        </div>

        <!-- Step 2 & 3: Movable Assets -->
        <div class="draft-card-section">
          <div class="draft-card-section-title">
            <span>STEP 2B: Movable Properties / Investments (बैंक खाते, FD, जेवर, गाड़ियां)</span>
            <button type="button" class="btn-add-dynamic-item" onclick="addWillMovableAsset()">
              + Add Another Financial Asset
            </button>
          </div>
          <div id="willMovableContainer">
            ${renderWillMovableFields()}
          </div>
        </div>

        <!-- Step 4: Special Conditions & Residuary -->
        <div class="draft-card-section">
          <div class="draft-card-section-title">STEP 4: Special Wishes & Residuary Clause</div>
          <div class="draft-input-grid">
            <div>
              <label class="draft-label" for="willResiduary">Residuary Beneficiary (for unmentioned assets) *</label>
              <input type="text" id="willResiduary" class="draft-input" placeholder="Name of primary heir / executor" required />
            </div>
            <div>
              <label class="draft-label" for="willSpecialWishes">Life Interest / Special Conditions (Optional)</label>
              <input type="text" id="willSpecialWishes" class="draft-input" placeholder="e.g. Spouse to have life interest in residence before distribution" />
            </div>
          </div>
        </div>

        <!-- Confirmation Notice -->
        <div class="statutory-hindi-notice">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <strong>वसीयत (Will) सत्यापन सूचना:</strong><br/>
            <span>This generates a structured preliminary Will based on your inputs. Final drafting, medical fitness certification, and Sub-Registrar registration guidance will be provided by DASTAVEZ MITRA.</span>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
          <button type="submit" class="btn-lead-submit" id="btnGenerateWillDraft" style="flex: 1; padding: 0.85rem;">
            ${getIconHtml('sparkles')}
            <span>Confirm Asset Schedules & Generate Will Draft</span>
          </button>
        </div>
      </form>

      <div id="willDraftResult" style="display: none; margin-top: 1.5rem;"></div>
    </div>
  `;
}

function renderWillImmovableFields() {
  return willImmovableAssets.map((prop, idx) => `
    <div class="dynamic-item-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <strong style="font-size: 0.88rem; color: var(--color-primary);">Immovable Property #${idx + 1}</strong>
        ${idx >= 1 ? `<button type="button" class="btn-remove-dynamic-item" onclick="removeWillImmovableAsset(${idx})">Remove</button>` : ''}
      </div>
      <div class="draft-input-grid">
        <div>
          <label class="draft-label">Property Type & Location *</label>
          <input type="text" class="draft-input" id="willPropAddr_${idx}" placeholder="e.g. Flat No. 402, Sector 56, Gurugram" required value="${prop.address || ''}" />
        </div>
        <div>
          <label class="draft-label">Beneficiary Name & Relation *</label>
          <input type="text" class="draft-input" id="willPropBen_${idx}" placeholder="e.g. Amit Kumar (Son)" required value="${prop.beneficiaryName || ''}" />
        </div>
        <div>
          <label class="draft-label">Share Allocated *</label>
          <input type="text" class="draft-input" id="willPropShare_${idx}" placeholder="e.g. 100% / 50%" required value="${prop.share || '100%'}" />
        </div>
        <div>
          <label class="draft-label">Alternate Beneficiary (If primary dies)</label>
          <input type="text" class="draft-input" id="willPropAlt_${idx}" placeholder="e.g. Grandchildren" value="${prop.alternateBeneficiary || ''}" />
        </div>
      </div>
    </div>
  `).join('');
}

window.addWillImmovableAsset = function() {
  willImmovableAssets.push({ propertyType: 'Property', address: '', share: '100%', beneficiaryName: '', relation: '', conditions: '', alternateBeneficiary: '' });
  const container = document.getElementById('willImmovableContainer');
  if (container) container.innerHTML = renderWillImmovableFields();
};

window.removeWillImmovableAsset = function(idx) {
  if (willImmovableAssets.length > 1) {
    willImmovableAssets.splice(idx, 1);
    const container = document.getElementById('willImmovableContainer');
    if (container) container.innerHTML = renderWillImmovableFields();
  }
};

function renderWillMovableFields() {
  return willMovableAssets.map((asset, idx) => `
    <div class="dynamic-item-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <strong style="font-size: 0.88rem; color: var(--color-primary);">Financial Asset #${idx + 1}</strong>
        ${idx >= 1 ? `<button type="button" class="btn-remove-dynamic-item" onclick="removeWillMovableAsset(${idx})">Remove</button>` : ''}
      </div>
      <div class="draft-input-grid">
        <div>
          <label class="draft-label">Asset Description & Account Details *</label>
          <input type="text" class="draft-input" id="willAssetDet_${idx}" placeholder="e.g. SBI Bank Savings A/c & FDs, Gurugram" required value="${asset.details || ''}" />
        </div>
        <div>
          <label class="draft-label">Beneficiary Name *</label>
          <input type="text" class="draft-input" id="willAssetBen_${idx}" placeholder="e.g. Suman (Wife)" required value="${asset.beneficiaryName || ''}" />
        </div>
      </div>
    </div>
  `).join('');
}

window.addWillMovableAsset = function() {
  willMovableAssets.push({ assetType: 'Investment / Bank', details: '', share: '100%', beneficiaryName: '', relation: '', specialNotes: '' });
  const container = document.getElementById('willMovableContainer');
  if (container) container.innerHTML = renderWillMovableFields();
};

window.removeWillMovableAsset = function(idx) {
  if (willMovableAssets.length > 1) {
    willMovableAssets.splice(idx, 1);
    const container = document.getElementById('willMovableContainer');
    if (container) container.innerHTML = renderWillMovableFields();
  }
};

window.handleWillDraftSubmit = async function(e) {
  e.preventDefault();
  const btn = document.getElementById('btnGenerateWillDraft');
  const resultContainer = document.getElementById('willDraftResult');

  const immovableAssets = willImmovableAssets.map((prop, idx) => ({
    propertyType: 'Immovable Property',
    address: document.getElementById(`willPropAddr_${idx}`)?.value || 'Gurugram',
    beneficiaryName: document.getElementById(`willPropBen_${idx}`)?.value || 'Beneficiary',
    share: document.getElementById(`willPropShare_${idx}`)?.value || '100%',
    alternateBeneficiary: document.getElementById(`willPropAlt_${idx}`)?.value || ''
  }));

  const movableAssets = willMovableAssets.map((asset, idx) => ({
    assetType: 'Movable / Financial Asset',
    details: document.getElementById(`willAssetDet_${idx}`)?.value || 'Bank & Investments',
    beneficiaryName: document.getElementById(`willAssetBen_${idx}`)?.value || 'Beneficiary',
    share: '100%'
  }));

  const data = {
    testatorName: document.getElementById('willTestatorName')?.value,
    relativeName: document.getElementById('willRelativeName')?.value,
    age: document.getElementById('willAge')?.value,
    aadhaar: document.getElementById('willAadhaar')?.value,
    address: document.getElementById('willAddress')?.value,
    executorName: document.getElementById('willExecutor')?.value,
    residuaryBeneficiary: document.getElementById('willResiduary')?.value,
    specialConditions: document.getElementById('willSpecialWishes')?.value,
    immovableAssets,
    movableAssets
  };

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>Compiling Will & Schedules...</span>';
  }

  try {
    const res = await fetch('/api/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draftType: 'will', data })
    });

    const json = await res.json();
    if (res.ok && json.success && json.draft) {
      renderGeneratedDraftPreview(resultContainer, json.draft, 'Will / Testament', data.testatorName);
    } else {
      alert(json.error || 'Failed to generate Will draft.');
    }
  } catch (err) {
    alert('Error generating Will draft. Please try again.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `${getIconHtml('sparkles')} <span>Confirm Asset Schedules & Generate Will Draft</span>`;
    }
  }
};

// 4. GPA / SPA AI Drafting Wizard
function renderGpaSpaDraftingWizard() {
  return `
    <div class="draft-wizard-container">
      <div class="draft-wizard-header">
        <h3 class="draft-wizard-title">
          ${getIconHtml('sparkles')}
          <span>अपना GPA / SPA Draft करें</span>
        </h3>
        <p class="draft-wizard-desc">Interactive Assistant for General & Special Power of Attorney</p>
      </div>

      <form id="gpaSpaDraftForm" onsubmit="handleGpaSpaDraftSubmit(event)">
        <!-- Step 1: Document Type & Purpose -->
        <div class="draft-card-section">
          <div class="draft-card-section-title">1. Authorization Type & Scope</div>
          <div class="draft-input-grid">
            <div>
              <label class="draft-label" for="gpaDocType">Document Required *</label>
              <select id="gpaDocType" class="draft-select" required>
                <option value="GPA">General Power of Attorney (GPA) - Broad Powers</option>
                <option value="SPA">Special Power of Attorney (SPA) - Specific Single Task</option>
              </select>
            </div>
            <div>
              <label class="draft-label" for="gpaPurpose">Specific Purpose *</label>
              <input type="text" id="gpaPurpose" class="draft-input" placeholder="e.g. Property management / Vehicle sale / Court case" required />
            </div>
          </div>
          <div style="margin-top: 0.75rem;">
            <label class="draft-label" for="gpaMatterDetails">Matter / Property / Authority Particulars *</label>
            <input type="text" id="gpaMatterDetails" class="draft-input" placeholder="Complete details of property, vehicle reg no., or department" required />
          </div>
        </div>

        <!-- Step 2: Principal Particulars -->
        <div class="draft-card-section">
          <div class="draft-card-section-title">2. Principal / Executant Details (पावर देने वाला)</div>
          <div class="draft-input-grid">
            <div>
              <label class="draft-label" for="gpaPrincipalName">Principal Full Name *</label>
              <input type="text" id="gpaPrincipalName" class="draft-input" placeholder="Full name as per Aadhaar" required />
            </div>
            <div>
              <label class="draft-label" for="gpaPrincipalRel">Father's / Husband's Name *</label>
              <input type="text" id="gpaPrincipalRel" class="draft-input" placeholder="Father or Husband name" required />
            </div>
            <div>
              <label class="draft-label" for="gpaPrincipalAadhaar">Principal Aadhaar Number *</label>
              <input type="text" id="gpaPrincipalAadhaar" class="draft-input" placeholder="Aadhaar Card No." required />
            </div>
            <div>
              <label class="draft-label" for="gpaPrincipalAddr">Complete Residential Address *</label>
              <input type="text" id="gpaPrincipalAddr" class="draft-input" placeholder="Residential address" required />
            </div>
          </div>
        </div>

        <!-- Step 3: Attorney Particulars -->
        <div class="draft-card-section">
          <div class="draft-card-section-title">3. Attorney Holder Details (जिसके नाम पावर बन रही है)</div>
          <div class="draft-input-grid">
            <div>
              <label class="draft-label" for="gpaAttorneyName">Attorney Full Name *</label>
              <input type="text" id="gpaAttorneyName" class="draft-input" placeholder="Full name of representative" required />
            </div>
            <div>
              <label class="draft-label" for="gpaAttorneyRel">Father's / Husband's Name *</label>
              <input type="text" id="gpaAttorneyRel" class="draft-input" placeholder="Father or Husband name" required />
            </div>
            <div>
              <label class="draft-label" for="gpaAttorneyAadhaar">Attorney Aadhaar Number *</label>
              <input type="text" id="gpaAttorneyAadhaar" class="draft-input" placeholder="Aadhaar Card No." required />
            </div>
            <div>
              <label class="draft-label" for="gpaAttorneyAddr">Complete Residential Address *</label>
              <input type="text" id="gpaAttorneyAddr" class="draft-input" placeholder="Residential address" required />
            </div>
          </div>
        </div>

        <!-- Notary & Registration Notice -->
        <div class="statutory-hindi-notice">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <strong>Notary & Registration Notice:</strong><br/>
            <span>• "Notary GPA/SPA can be provided."<br/>
            • "Notary के लिए आपकी व्यक्तिगत उपस्थिति आवश्यक होगी।"<br/>
            • If GPA/SPA registration is open/available in the applicable Tehsil, registration assistance can be provided. Registration remains subject to the competent authority.</span>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
          <button type="submit" class="btn-lead-submit" id="btnGenerateGpaDraft" style="flex: 1; padding: 0.85rem;">
            ${getIconHtml('sparkles')}
            <span>Generate Preliminary GPA / SPA Draft</span>
          </button>
        </div>
      </form>

      <div id="gpaDraftResult" style="display: none; margin-top: 1.5rem;"></div>
    </div>
  `;
}

window.handleGpaSpaDraftSubmit = async function(e) {
  e.preventDefault();
  const btn = document.getElementById('btnGenerateGpaDraft');
  const resultContainer = document.getElementById('gpaDraftResult');

  const data = {
    docType: document.getElementById('gpaDocType')?.value,
    purpose: document.getElementById('gpaPurpose')?.value,
    matterDetails: document.getElementById('gpaMatterDetails')?.value,
    principalName: document.getElementById('gpaPrincipalName')?.value,
    principalRelative: document.getElementById('gpaPrincipalRel')?.value,
    principalAadhaar: document.getElementById('gpaPrincipalAadhaar')?.value,
    principalAddress: document.getElementById('gpaPrincipalAddr')?.value,
    attorneyName: document.getElementById('gpaAttorneyName')?.value,
    attorneyRelative: document.getElementById('gpaAttorneyRel')?.value,
    attorneyAadhaar: document.getElementById('gpaAttorneyAadhaar')?.value,
    attorneyAddress: document.getElementById('gpaAttorneyAddr')?.value
  };

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>Drafting Power of Attorney...</span>';
  }

  try {
    const res = await fetch('/api/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draftType: 'gpa-spa', data })
    });

    const json = await res.json();
    if (res.ok && json.success && json.draft) {
      renderGeneratedDraftPreview(resultContainer, json.draft, data.docType, data.principalName);
    } else {
      alert(json.error || 'Failed to generate draft.');
    }
  } catch (err) {
    alert('Error generating draft. Please try again.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `${getIconHtml('sparkles')} <span>Generate Preliminary GPA / SPA Draft</span>`;
    }
  }
};

// Toast Notification System
export function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('dm-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'dm-toast-container';
    container.className = 'dm-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `dm-toast-item dm-toast-${type}`;

  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '⚠️',
    info: 'ℹ️'
  };

  toast.innerHTML = `
    <span class="dm-toast-icon">${iconMap[type] || 'ℹ️'}</span>
    <span class="dm-toast-text">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('dm-toast-show');
  });

  setTimeout(() => {
    toast.classList.remove('dm-toast-show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, duration);
}
window.showToast = showToast;

// Render Draft Preview Container with Copy, Print & WhatsApp CTAs
function renderGeneratedDraftPreview(container, draftText, docType, personName) {
  if (!container) return;

  container.style.display = 'block';
  container.innerHTML = `
    <div class="draft-preview-card">
      <div class="draft-preview-header">
        <span class="draft-preview-header-tag">Preliminary Generated Draft: ${docType}</span>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn-secondary" onclick="printDraftText('${escapeHtml(docType)}')" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">
            🖨️ Print / Save PDF
          </button>
          <button class="btn-secondary" onclick="copyDraftText()" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">
            📋 Copy Text
          </button>
        </div>
      </div>

      <div class="draft-text-box" id="generatedDraftTextBox">${escapeHtml(draftText)}</div>

      <div class="draft-actions-grid">
        <button type="button" onclick="openCallModal()" class="btn-secondary" style="font-weight: 700; justify-content: center; padding: 0.85rem;">
          ${getIconHtml('phone')} Call: 9 AM – 7 PM
        </button>
        <button type="button" onclick="openWhatsappModal('Hello DASTAVEZ MITRA, I have prepared a preliminary draft for ${escapeHtml(docType)} on your website (Name: ${escapeHtml(personName || '')}) and want to get it finalized, printed on e-stamp paper and notarized.')" class="btn-primary-wa" style="justify-content: center; padding: 0.85rem;">
          ${getIconHtml('whatsapp')} WhatsApp to Finalize
        </button>
      </div>
    </div>
  `;

  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.copyDraftText = function() {
  const textBox = document.getElementById('generatedDraftTextBox');
  if (!textBox) return;

  navigator.clipboard.writeText(textBox.innerText).then(() => {
    showToast('Draft text copied to clipboard successfully!', 'success');
  }).catch(() => {
    showToast('Please select and copy the text manually.', 'warning');
  });
};

window.printDraftText = function(docType = 'Legal Draft') {
  const textBox = document.getElementById('generatedDraftTextBox');
  if (!textBox) return;
  const content = textBox.innerText;

  const printWindow = window.open('', '_blank', 'width=850,height=950');
  if (!printWindow) {
    showToast('Please allow popups to print/save document as PDF.', 'warning');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(docType)} - DASTAVEZ MITRA</title>
      <style>
        @page { size: A4; margin: 25mm 20mm; }
        body { font-family: 'Times New Roman', Times, serif; font-size: 12.5pt; line-height: 1.6; color: #111; margin: 0; padding: 25px; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 24px; }
        .header h1 { font-size: 16pt; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px; }
        .header p { font-size: 9.5pt; margin: 0; color: #555; }
        pre { white-space: pre-wrap; font-family: inherit; font-size: inherit; line-height: 1.6; margin: 0; }
        .footer { margin-top: 35px; border-top: 1px dashed #777; padding-top: 10px; font-size: 9pt; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>DASTAVEZ MITRA • GURUGRAM</h1>
        <p>Documentation & Assistance Services | WhatsApp: 9871592002 | Call: 9540403071</p>
      </div>
      <pre>${escapeHtml(content)}</pre>
      <div class="footer">
        <p>Generated via DASTAVEZ MITRA • Preliminary Draft subject to verification & appropriate e-Stamp Paper execution.</p>
      </div>
      <script>
        window.onload = function() { window.print(); }
      <\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
  showToast('Opening print / PDF dialog...', 'success');
};

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
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
        <p class="section-subtitle">Explore our documentation categories, view required documents, or use our embedded AI drafting assistants.</p>
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
            placeholder="Search services (e.g. RC Transfer, RTO, Quick Marriage, Affidavit, Will, GPA)..."
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
    <div class="container" style="padding-top: 2.5rem; padding-bottom: 4rem; max-width: 850px;">
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

        <!-- Embedded AI Drafting Trigger Button (inside service) -->
        ${renderAiDraftingTrigger(service)}

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
            ${service.processTitle || 'Step-by-Step Basic Process'}
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
          <button type="button" onclick="openCallModal()" class="btn-secondary" style="font-weight: 700; justify-content: center; padding: 0.9rem;">
            ${getIconHtml('phone')}
            CALL: 9 AM – 7 PM
          </button>
          <button type="button" onclick="openWhatsappModal('${escapeHtml(service.whatsappMessage)}')" class="btn-primary-wa" style="justify-content: center; padding: 0.9rem;">
            ${getIconHtml('whatsapp')}
            WHATSAPP US
          </button>
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
                <button type="button" onclick="openCallModal()" class="btn-card-call" style="padding: 0.5rem 0.75rem;">
                  ${getIconHtml('phone')} Call
                </button>
                <button type="button" onclick="openWhatsappModal('${escapeHtml(s.whatsappMessage)}')" class="btn-card-wa" style="padding: 0.5rem 0.75rem;">
                  ${getIconHtml('whatsapp')} WhatsApp
                </button>
              </div>
            </div>
            <p style="font-size: 0.92rem; color: var(--color-text-muted); margin-bottom: 0.75rem;">
              ${s.shortDescription}
            </p>
            ${renderServiceDocuments(s)}
            ${s.hasAiDrafting ? `
              <div style="margin-top: 0.75rem; text-align: right;">
                <button class="btn-secondary" onclick="launchAiDrafting('${s.aiDraftingType}')" style="padding: 0.45rem 0.85rem; font-size: 0.82rem; font-weight: 700;">
                  ${getIconHtml('sparkles')} ${s.aiDraftingButtonText || 'Draft with AI'}
                </button>
              </div>
            ` : ''}
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
          <h3 class="step-title">Choose Service / AI Draft</h3>
          <p class="step-desc">Identify the paperwork you need or use our embedded AI drafting tool for Affidavit, Agreement, Will, or GPA/SPA.</p>
        </div>

        <div class="step-card">
          <div class="step-badge">2</div>
          <h3 class="step-title">Check Required Documents</h3>
          <p class="step-desc">Review the basic guidelines and document readiness for your specific procedure.</p>
        </div>

        <div class="step-card">
          <div class="step-badge">3</div>
          <h3 class="step-title">Call or WhatsApp</h3>
          <p class="step-desc">Reach out via WhatsApp (24/7) or Call Helpline (Calling Hours: 9 AM – 7 PM) for immediate consultation.</p>
        </div>

        <div class="step-card">
          <div class="step-badge">4</div>
          <h3 class="step-title">Get Assistance</h3>
          <p class="step-desc">Get guided preparation, form assistance, and completion support for your documentation in Gurugram.</p>
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
          <strong>DASTAVEZ MITRA</strong> is an independent documentation and paperwork assistance service operating in Gurugram. Navigating paperwork for RC transfers, RTO road tax & fitness, Form 28 NOC, duplicate RC, driving licences, affidavits, marriage registrations, power of attorney, agreements, wills, and official name changes can often feel confusing and time-consuming. We provide structured guidance to help you understand requirements, prepare forms accurately, and complete documentation smoothly.
        </p>

        <div style="border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
          <h4 style="font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem;">Office Location & Direct Helplines</h4>
          <p style="font-size: 0.95rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">
            📍 <strong>Office Address:</strong> ${BRAND_INFO.officeAddress}
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.25rem;">
            <button type="button" onclick="openCallModal()" class="btn-secondary" style="font-weight: 700;">
              ${getIconHtml('phone')} Call: 9 AM – 7 PM
            </button>
            <button type="button" onclick="openWhatsappModal()" class="btn-primary-wa">
              ${getIconHtml('whatsapp')} WhatsApp Us
            </button>
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
          <button type="button" onclick="openCallModal()" class="btn-secondary" style="font-size: 1.05rem; padding: 0.9rem 1.8rem; font-weight: 700;">
            ${getIconHtml('phone')}
            CALL US (9 AM – 7 PM)
          </button>
          <button type="button" onclick="openWhatsappModal()" class="btn-primary-wa" style="font-size: 1.05rem; padding: 0.9rem 1.8rem;">
            ${getIconHtml('whatsapp')}
            WHATSAPP US
          </button>
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
            <p class="channel-handle">9871592002 / 9540403071</p>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">Direct chat for quick document checks & checklist queries (24/7).</p>
          </div>
          <button type="button" onclick="openWhatsappModal()" class="btn-channel btn-channel-wa" style="border: none; cursor: pointer; font-family: inherit;">
            ${getIconHtml('whatsapp')}
            Chat on WhatsApp
          </button>
        </div>

        <!-- Phone / Calling Helpline Card -->
        <div class="channel-card">
          <div class="channel-icon-circle" style="background: #e0f2fe; color: #0077b6;">
            ${getIconHtml('phone')}
          </div>
          <div>
            <h3 class="channel-title">Calling Helpline</h3>
            <p class="channel-handle">Calling Hours: 9 AM – 7 PM</p>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">Direct voice call (Line 1: 9871592002 | Line 2: 9540403071).</p>
          </div>
          <button type="button" onclick="openCallModal()" class="btn-secondary" style="justify-content: center; font-weight: 700;">
            ${getIconHtml('phone')}
            Call Helpline
          </button>
        </div>

        <!-- Instagram Social Channel Card -->
        <div class="channel-card">
          <div class="channel-icon-circle" style="background: var(--color-instagram-bg); color: var(--color-instagram);">
            ${getIconHtml('instagram')}
          </div>
          <div>
            <h3 class="channel-title">Instagram</h3>
            <p class="channel-handle">${BRAND_INFO.instagramHandle}</p>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">Follow for documentation updates, legal facts, and tips in Gurugram.</p>
          </div>
          <a href="${BRAND_INFO.instagramUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="justify-content: center; font-weight: 700; color: var(--color-instagram); border-color: rgba(225, 48, 108, 0.3);">
            ${getIconHtml('instagram')}
            Follow on Instagram
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
          When you submit an enquiry through our lead form, Legal Mitra, or connect with us via WhatsApp/Phone, we collect basic contact information: Full Name, Mobile Number, requested documentation service, optional email address, and message details. We do not collect sensitive numbers (such as Aadhaar OTPs, bank accounts, or UPI PINs) on the initial enquiry form.
        </p>

        <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">2. How Enquiry Information is Used</h3>
        <p style="margin-bottom: 1.25rem;">
          The information you provide is used exclusively by DASTAVEZ MITRA to contact you regarding your service enquiry, clarify document requirements, and provide procedural assistance. We do not sell or rent your contact details.
        </p>

        <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">3. Confidentiality & Storage</h3>
        <p style="margin-bottom: 1.25rem;">
          Enquiries are stored securely on our protected servers and are accessible only to authorized staff. Lead data is NEVER published or exposed publicly.
        </p>

        <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">4. Contact Details</h3>
        <p>
          For any privacy queries, please contact DASTAVEZ MITRA at:<br/>
          • WhatsApp: <strong>9871592002</strong><br/>
          • Helpline Call: <strong>9540403071</strong> (9 AM–7 PM)<br/>
          • Office: ${BRAND_INFO.officeAddress}
        </p>
      </div>
    </div>
  `;
}

// Render Terms & Conditions View
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
          <p>DASTAVEZ MITRA provides documentation drafting, paperwork compilation, procedural guidance, application assistance, and facilitation services. DASTAVEZ MITRA is an independent assistance service and does not represent a government authority or court.</p>
        </div>

        <div class="terms-clause-card">
          <h3>2. No Guarantee of Government Decision</h3>
          <p>Submission or drafting assistance provided by DASTAVEZ MITRA does not guarantee approval, registration, or issuance of certificate/licence. All statutory approvals rest solely within the legal discretion of the respective competent authorities.</p>
        </div>

        <div class="terms-clause-card">
          <h3>3. Accuracy of User Information</h3>
          <p>The customer is solely responsible for providing genuine, valid, complete, and accurate documents, personal details, and identity proofs. Forged or fraudulent documents are strictly prohibited.</p>
        </div>

        <div class="terms-clause-card">
          <h3>4. Contact & Support Hours</h3>
          <p>Call helpline <strong>9540403071</strong> is available from 9:00 AM to 7:00 PM IST. WhatsApp support <strong>9871592002</strong> is available for messaging 24/7.</p>
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

  const stats = adminStatsData || { total: 0, today: 0, new: 0, contacted: 0, followup: 0, converted: 0, closed: 0 };
  const filteredLeads = getFilteredAdminLeads();

  return `
    <div class="admin-view-wrapper">
      <div class="container" style="max-width: 1100px;">
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

// Lead Submission Handler
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
              <button type="button" onclick="openCallModal()" class="btn-card-call" style="padding: 0.85rem; justify-content: center; font-size: 0.95rem;">
                ${getIconHtml('phone')} Call: 9 AM – 7 PM
              </button>
              <button type="button" onclick="openWhatsappModal('Hello DASTAVEZ MITRA, I have submitted an enquiry for ${escapeHtml(service)} (Name: ${escapeHtml(name)}).')" class="btn-card-wa" style="padding: 0.85rem; justify-content: center; font-size: 0.95rem;">
                ${getIconHtml('whatsapp')} WhatsApp Us
              </button>
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

// Admin Authentication & CRM Handlers
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

// Lead Detail Modal
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

    <!-- Embedded AI Drafting Trigger inside modal -->
    ${renderAiDraftingTrigger(service)}

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
        ${service.processTitle || 'Step-by-Step Basic Process'}
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
      <button type="button" onclick="openCallModal()" class="btn-secondary" style="font-weight: 700; justify-content: center; padding: 0.85rem;">
        ${getIconHtml('phone')} Call: 9 AM – 7 PM
      </button>
      <button type="button" onclick="openWhatsappModal('${escapeHtml(service.whatsappMessage)}')" class="btn-primary-wa" style="justify-content: center; padding: 0.85rem;">
        ${getIconHtml('whatsapp')} WhatsApp Us
      </button>
    </div>
  `;

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeServiceModal = function() {
  const modalOverlay = document.getElementById('serviceModal');
  if (modalOverlay) {
    modalOverlay.classList.remove('open');
    if (!document.querySelector('.modal-overlay.open')) {
      document.body.style.overflow = '';
    }
  }
};

window.closeLeadModal = function() {
  const modalOverlay = document.getElementById('leadModal');
  if (modalOverlay) {
    modalOverlay.classList.remove('open');
    if (!document.querySelector('.modal-overlay.open')) {
      document.body.style.overflow = '';
    }
  }
};

// Router Dispatcher
function router() {
  const hash = window.location.hash.slice(1) || '/';
  const appContainer = document.getElementById('app-root');
  if (!appContainer) return;

  window.toggleMobileMenu(false);
  window.closeServiceModal();
  window.closeLeadModal();
  window.closeCallModal();
  window.closeWhatsappModal();

  document.querySelectorAll('.nav-link, .drawer-links a').forEach(link => {
    const href = link.getAttribute('href');
    const isCurrent = (hash === '/' && href === '#/') || (hash !== '/' && href === `#${hash}`);
    link.classList.toggle('active', isCurrent);
  });

  window.scrollTo({ top: 0, behavior: 'instant' });

  if (hash === '/' || hash === '') {
    appContainer.innerHTML = renderHomeView();
  } else if (hash === '/services') {
    appContainer.innerHTML = renderServicesView();
  } else if (hash.startsWith('/services/')) {
    const slug = hash.replace('/services/', '');
    appContainer.innerHTML = renderServiceDetailView(slug);
  } else if (hash === '/legal-mitra' || hash === '/legal-assistant') {
    appContainer.innerHTML = renderLegalAssistantView();
    updateChatUIs();
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

  ['serviceModal', 'leadModal', 'callModal', 'whatsappModal'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          window.closeServiceModal();
          window.closeLeadModal();
          window.closeCallModal();
          window.closeWhatsappModal();
        }
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeServiceModal();
      window.closeLeadModal();
      window.closeCallModal();
      window.closeWhatsappModal();
      window.toggleMobileMenu(false);
      window.toggleFloatingAiWidget(false);
    }
  });

  if (adminToken) {
    fetchAdminData();
  }
});
