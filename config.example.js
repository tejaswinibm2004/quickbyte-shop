// Copy to config.js and fill in. config.js is gitignored (per-repo secret).
// On Render, config.js is generated at build time from env vars — see scripts/build-config.mjs.
window.BUGSHIELD_CONFIG = {
  host: 'https://YOUR-BUGSHIELD.onrender.com', // BugShield platform origin, no trailing slash
  appId: 'APP-XXX',                             // application id from the BugShield dashboard
  ingestionKey: 'bsk_...'                       // scoped ingestion key for this site
};
