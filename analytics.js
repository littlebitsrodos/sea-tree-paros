// The SeaTree — GA4 with Consent Mode v2
// Loaded BEFORE googletagmanager's gtag.js (defer-ordered) so the consent
// default is in place before the first pageview fires.
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
window.gtag = gtag;

gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});

try {
  if (localStorage.getItem('seatree-consent') === 'granted') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }
} catch (_) { /* localStorage may be unavailable in private mode */ }

gtag('js', new Date());
gtag('config', 'G-GB2FXF8X5K', { anonymize_ip: true });
