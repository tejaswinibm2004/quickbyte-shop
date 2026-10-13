/**
 * Build-time widget config for separate-repo deploys.
 *
 * Reads BUGSHIELD_HOST / BUGSHIELD_APP_ID / BUGSHIELD_INGESTION_KEY from the
 * environment (Render static-site env vars are available at build time) and
 * writes config.js next to the site files. Fails loudly when anything is
 * missing so a misconfigured deploy breaks at build, not silently at runtime.
 *
 * Paths resolve from this file, so it works whether test-web-1 is the repo
 * root (own repository) or a subfolder (monorepo).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '..');

const host = (process.env.BUGSHIELD_HOST || '').replace(/\/+$/, '');
const appId = (process.env.BUGSHIELD_APP_ID || '').trim();
const key = (process.env.BUGSHIELD_INGESTION_KEY || '').trim();

const missing = [
  !host && 'BUGSHIELD_HOST (e.g. https://bugshield.onrender.com)',
  !appId && 'BUGSHIELD_APP_ID (e.g. APP-TEST-WEB-1)',
  !key && 'BUGSHIELD_INGESTION_KEY (bsk_... from the BugShield dashboard)'
].filter(Boolean);
if (missing.length) {
  console.error('[build-config] Missing required env vars:\n  - ' + missing.join('\n  - '));
  process.exit(1);
}

fs.writeFileSync(path.join(root, 'config.js'),
  `// Generated at build time from env vars — do not edit by hand.\n` +
  `window.BUGSHIELD_CONFIG = {\n` +
  `  host: ${JSON.stringify(host)},\n` +
  `  appId: ${JSON.stringify(appId)},\n` +
  `  ingestionKey: ${JSON.stringify(key)}\n` +
  `};\n`);
console.log(`[build-config] Wrote config.js for ${appId} @ ${host}`);
