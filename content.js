/* ============================================================================
   AUTO HEALTH CHECKER — PRESENTATION CONTENT
   ----------------------------------------------------------------------------
   Everything editable lives in this one file. Nothing here is invented:
   · Student / college details   -> from the issued certificate + supplied brief
   · Cyber Wolf company details  -> from https://www.cyberwolf360.in/ only
   · Certificate details         -> transcribed from the issued certificate
   Anything not supplied is a [PLACEHOLDER] — replace the value, keep the keys.
   ========================================================================== */

window.CONTENT = {

  /* ── 1. STUDENT ───────────────────────────────────────────────────────── */
  student: {
    name:       'Mathan Kumar. S',
    degree:     'B.Tech Artificial Intelligence and Data Science',
    department: 'Department of Artificial Intelligence and Data Science',
    college:    'S.K.P Engineering College',
    university: 'Anna University',
    registerNo: '2194945281505',
  },

  /* ── 2. INTERNSHIP ────────────────────────────────────────────────────── */
  internship: {
    organization: 'Cyber Wolf',
    organizationAlt: 'Cyber Wolf 360',
    website:      'https://www.cyberwolf360.in/',
    // Certified on the issued certificate — do not change unless reissued.
    certifiedTitle:  'Ethical Hacking (Offline)',
    certifiedStart:  '01/09/2026',
    certifiedEnd:    '01/10/2026',
    certifiedPeriod: '01/09/2026 – 01/10/2026',
    certificateNo:   'CW20267990067144',
    issuedAt:        'Tiruvannamalai',
    signatory:       'Tamilselvan S',
    signatoryRole:   'Founder & CEO, Cyber Wolf',
    // Not supplied anywhere in the repo — fill these in.
    role:     '[INTERNSHIP ROLE]',
    duration: '[INTERNSHIP DURATION]',
    mentor:   '[MENTOR NAME]',
    startDate:'[INTERNSHIP START DATE]',
    endDate:  '[INTERNSHIP END DATE]',
  },

  /* ── 3. PROJECT ───────────────────────────────────────────────────────── */
  project: {
    name:     'Auto Health Checker',
    subtitle: 'Automated Website Health, Security & Quality Analysis',
    domain:   'Cybersecurity · Web Security · Automated QA · AI',
    healthScore: 87,
    // Demo dashboard values (illustrative product UI, not a claim about any site).
    subscores: [
      { key: 'SECURITY',      value: 91 },
      { key: 'PERFORMANCE',   value: 78 },
      { key: 'RELIABILITY',   value: 89 },
      { key: 'ACCESSIBILITY', value: 94 },
      { key: 'UX',            value: 83 },
    ],
    severity: [
      { key: 'CRITICAL', value: '01', tone: 'crit' },
      { key: 'HIGH',     value: '03', tone: 'high' },
      { key: 'MEDIUM',   value: '08', tone: 'med'  },
      { key: 'LOW',      value: '14', tone: 'low'  },
    ],
    scan: {
      target:  'https://example.com',
      percent: 87,
      counters: [
        { label: 'Pages scanned', value: 42 },
        { label: 'Links checked', value: 186 },
        { label: 'API requests',  value: 94 },
        { label: 'Forms tested',  value: 8 },
        { label: 'Console errors', value: 6, warn: true },
        { label: 'Broken links',   value: 4, warn: true },
      ],
    },
  },

  /* ── 4. COMPANY FACTS — official website only ─────────────────────────── */
  // Source: https://www.cyberwolf360.in/  (published figures)
  companyStats: [
    { value: 12400, suffix: '+', label: 'Vulnerabilities Found' },
    { value: 180,   suffix: '+', label: 'Enterprises Secured' },
    { value: 120,   suffix: '+', label: 'Happy Clients' },
    { text: '24×7',              label: 'Managed SOC Operations' },
  ],
  company: {
    tagline: 'Building a culture of security',
    positioning: 'Practitioner-led cybersecurity — VAPT, compliance, managed SOC, training, and security programs for startups, enterprises, and institutions.',
    capabilities: [
      { name: 'VAPT',          info: 'Vulnerability Assessment & Penetration Testing — manual and automated testing across web, mobile, API and network surfaces.' },
      { name: 'CLOUD',         info: 'Cloud Security — posture reviews for AWS, Azure and GCP covering identity, data, network and workloads.' },
      { name: 'SOC',           info: 'Managed SOC — 24×7 detection and response powered by modern SIEM/XDR.' },
      { name: 'API',           info: 'API Security — REST, GraphQL and gRPC testing against the OWASP API Security Top 10.' },
      { name: 'AI/LLM',        info: 'AI / LLM Security — prompt injection, model abuse and OWASP LLM Top 10 testing.' },
      { name: 'COMPLIANCE',    info: 'Compliance — gap assessments and audit support across ISO 27001, SOC 2, PCI-DSS, HIPAA, GDPR and DPDP.' },
      { name: 'WEB',           info: 'Web Application Security — OWASP ASVS-aligned testing to find exploitable flaws in web apps.' },
      { name: 'IoT',           info: 'IoT Security — hardware, firmware and cloud-side testing for connected products.' },
      { name: 'TRAINING',      info: 'Cybersecurity Training — practitioner-led courses, internships and enterprise upskilling.' },
    ],
    frameworks: ['ISO 27001', 'SOC 2', 'PCI-DSS', 'HIPAA', 'GDPR', 'NIST CSF', 'DPDP', 'EU AI Act'],
  },

  /* ── 5. TECHNOLOGY STACK — only what the project actually uses ─────────── */
  // Edit this block if the implementation differs.
  TECH_STACK: [
    { group: 'FRONTEND',  items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'] },
    { group: 'AUTOMATION',items: ['Playwright'] },
    { group: 'BACKEND',   items: ['Node.js', 'Express'] },
    { group: 'SECURITY',  items: ['OWASP methodology', 'Security headers', 'API security checks', 'Vulnerability detection'] },
    { group: 'ANALYSIS',  items: ['AI-assisted finding analysis', 'Risk classification', 'Evidence correlation'] },
    { group: 'REPORTING', items: ['JSON', 'PDF reports', 'Dashboard analytics'] },
  ],

  /* ── 6. ARCHITECTURE COMPONENT DETAIL ─────────────────────────────────── */
  arch: {
    user:       { title: 'USER',              purpose: 'The operator who supplies a target and reviews results.', input: 'Target URL, scan options', output: 'Scan request', tech: 'Web UI' },
    url:        { title: 'WEBSITE URL',       purpose: 'Normalised, validated entry point for the scan.', input: 'Raw URL string', output: 'Validated target', tech: 'Node.js / Express' },
    controller: { title: 'SCAN CONTROLLER',   purpose: 'Orchestrates the whole scan: queues work, enforces limits, tracks progress.', input: 'Validated target', output: 'Scan jobs + status stream', tech: 'Node.js' },
    playwright: { title: 'PLAYWRIGHT ENGINE', purpose: 'Drives a real browser so the analysis observes real rendering and real network behaviour.', input: 'Scan jobs', output: 'Rendered pages + events', tech: 'Playwright' },
    crawler:    { title: 'CRAWLER',           purpose: 'Discovers reachable pages and resources to define scan coverage.', input: 'Seed URL', output: 'Page & asset inventory', tech: 'Playwright' },
    network:    { title: 'NETWORK MONITOR',   purpose: 'Records every request: status, timing, size and failures.', input: 'Browser network events', output: 'Request log', tech: 'Playwright network API' },
    browser:    { title: 'BROWSER EVENTS',    purpose: 'Captures console output, page errors and unhandled rejections.', input: 'Browser console stream', output: 'Console evidence', tech: 'Playwright / CDP' },
    analysis:   { title: 'ANALYSIS ENGINE',   purpose: 'Applies rules and heuristics to the collected evidence.', input: 'Evidence bundles', output: 'Raw findings', tech: 'TypeScript rule engine' },
    security:   { title: 'SECURITY CHECKS',   purpose: 'Header, cookie, CORS, transport and client-side exposure review.', input: 'Response metadata', output: 'Security findings', tech: 'OWASP methodology' },
    bugs:       { title: 'BUG DETECTION',     purpose: 'Finds JS errors, failed requests, 404/500 responses and broken assets.', input: 'Console + request log', output: 'Quality findings', tech: 'Rule engine' },
    flows:      { title: 'FLOW TESTING',      purpose: 'Exercises registration, login, logout, forms and API workflows end to end.', input: 'Journey definitions', output: 'Flow findings', tech: 'Playwright' },
    ai:         { title: 'AI ANALYSIS',       purpose: 'Correlates findings, explains likely cause and suppresses weak signals.', input: 'Raw findings', output: 'Explained, ranked findings', tech: 'AI-assisted analysis' },
    risk:       { title: 'RISK CORRELATION',  purpose: 'Combines evidence, confidence and context into severity classes.', input: 'Explained findings', output: 'Prioritised risk list', tech: 'Scoring model' },
    score:      { title: 'HEALTH SCORE',      purpose: 'Reduces the scan to one comparable 0–100 measure across five dimensions.', input: 'Prioritised risk list', output: 'Health score', tech: 'Weighted scoring' },
    dashboard:  { title: 'DASHBOARD',         purpose: 'Interactive results: scores, severities, findings and recommendations.', input: 'Health score + findings', output: 'Operator view', tech: 'React / Next.js' },
    pdf:        { title: 'PDF REPORT',        purpose: 'Shareable, archivable record of the scan and its findings.', input: 'Health score + findings', output: 'PDF / JSON export', tech: 'Reporting module' },
  },

  /* ── 7. BOOT + TERMINAL TEXT ──────────────────────────────────────────── */
  boot: [
    'initialising auto health checker…',
    'loading scan controller',
    'mounting playwright engine',
    'calibrating risk model',
    'presentation ready',
  ],

  // Safe, illustrative demo output. Nothing here touches a real target.
  demoScan: [
    '$ health-check scan example.com',
    '',
    '[✓] Target reachable',
    '[✓] HTTPS enabled',
    '[✓] Security headers analyzed',
    '[✓] 42 pages discovered',
    '[!] 4 broken links detected',
    '[!] 6 JS errors detected',
    '[!] 3 API failures detected',
    '',
    '[AI] Correlating findings…',
    '[AI] Generating recommendations…',
    '',
    'Health Score: 87/100',
  ],
  demoStages: [
    'Initializing scanner…',
    'Connecting to target…',
    'Discovering pages…',
    'Analyzing JavaScript…',
    'Checking security headers…',
    'Testing API responses…',
    'Testing user flows…',
    'Analyzing performance…',
    'Generating health score…',
  ],

  /* ── 8. SOUND ─────────────────────────────────────────────────────────── */
  /* Two modes, per section transition:
       · mode 'synth' -> generated in the browser (default, zero files needed)
       · mode 'file'  -> plays the asset at `src`, e.g. 'assets/sfx/transition-01.mp3'
     To use your own sounds: drop files into assets/sfx/ and switch a section
     entry to { mode:'file', src:'assets/sfx/<name>.mp3' }. */
  sound: {
    enabled: true,
    volume: 0.5,
    transitionMode: 'synth',
    // Per-section override map, keyed by section id.
    perSection: {
      // hero:  { mode: 'file', src: 'assets/sfx/transition-hero.mp3' },
      // s10:   { mode: 'file', src: 'assets/sfx/transition-certificate.mp3' },
    },
    ui: { click: true, hover: false, complete: true },
  },
};
