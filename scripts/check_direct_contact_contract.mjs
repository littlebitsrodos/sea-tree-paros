import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), 'utf8');
}

export function assertDirectContactContract() {
  const indexHtml = readProjectFile('index.html');
  const script = readProjectFile('script.js');
  const styles = readProjectFile('styles.css');
  const translations = readProjectFile('translations.js');

  for (const [filePath, content] of Object.entries({
    'index.html': indexHtml,
    'script.js': script,
    'styles.css': styles,
    'translations.js': translations,
  })) {
    assert.doesNotMatch(content, /formspree/i, `${filePath} must not reference stale Formspree flow`);
    assert.doesNotMatch(content, /Payment links coming soon/i, `${filePath} must not expose placeholder payment copy`);
    assert.doesNotMatch(content, /book-now-btn/, `${filePath} must not expose stale Book Now button class`);
  }

  assert.doesNotMatch(script, /STRIPE_LINKS|getPaymentLink/, 'script.js must not keep Stripe placeholder payment logic');
  assert.doesNotMatch(script, /initContactForm|contact-form|form-feedback|syncDatesToForm/, 'script.js must not keep stale form wiring');

  assert.match(indexHtml, /https:\/\/wa\.me\/306973286811/, 'contact section must keep WhatsApp direct contact');
  assert.match(indexHtml, /mailto:antocosto@gmail\.com/, 'contact section must keep host email contact');

  assert.match(script, /buildInquiryLinks/, 'calendar selection must build direct inquiry links');
  assert.match(script, /https:\/\/wa\.me\/\$\{HOST_PHONE_E164\}\?text=/, 'calendar selection must include WhatsApp inquiry link');
  assert.match(script, /mailto:\$\{HOST_EMAIL\}\?subject=/, 'calendar selection must include email inquiry link');
  assert.match(script, /class="inquiry-action inquiry-action-primary"/, 'calendar selection must expose primary inquiry CTA');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  assertDirectContactContract();
}
