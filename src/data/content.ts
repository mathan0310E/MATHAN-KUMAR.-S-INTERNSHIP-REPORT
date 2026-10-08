/**
 * Every editable value in the presentation lives here.
 *
 * Nothing in this file invents facts. Values typed as `Placeholder` have not
 * been supplied and render as amber [BRACKETS] so they are impossible to miss.
 * Replace the text inside the brackets when you have the real details.
 */

/** A string that is still awaiting real information. */
export type Placeholder = `[${string}]`

export interface Student {
  name: string
  degree: string
  department: string
  college: string
  university: string
  registerNo: string
}

export interface Internship {
  /** Supplied by the certificate. */
  programme: string
  certificateNo: string
  signatory: string
  /** Not supplied — placeholders, do not invent. */
  role: Placeholder
  duration: Placeholder
  mentor: Placeholder
  startDate: Placeholder
  endDate: Placeholder
}

export interface Organization {
  name: string
  site: string
  logo: string
  logoSmall: string
  logoMark: string
  foundedBy: string
  summary: string
}

export interface ScoreBreakdown {
  security: number
  performance: number
  reliability: number
  accessibility: number
  ux: number
}

export interface SeverityCounts {
  critical: number
  high: number
  medium: number
  low: number
}

export interface DemoScan {
  url: string
  score: number
  metrics: ScoreBreakdown
  severity: SeverityCounts
}

export interface ScanSummary {
  percent: number
  pages: number
  links: number
  apis: number
  forms: number
  consoleErrors: number
  brokenLinks: number
}

export interface TerminalStep {
  kind: 'ok' | 'warn' | 'ai' | 'cmd'
  text: string
}

export interface TerminalScript {
  command: string
  steps: TerminalStep[]
}

export interface SoundConfig {
  enabledByDefault: boolean
  volume: number
  /** Section id → override. Anything unmapped keeps its generated tone. */
  perSection: Record<string, { mode: 'file' | 'none'; src?: string }>
  ui: { click: boolean; hover: boolean }
}

export interface SectionMeta {
  id: string
  label: string
  nav: string
}

export const student: Student = {
  name: 'Mathan Kumar. S',
  degree: 'B.Tech Artificial Intelligence & Data Science',
  department: 'Department of Artificial Intelligence and Data Science',
  college: 'S.K.P Engineering College',
  university: 'Anna University',
  registerNo: '2194945281505',
}

export const project = {
  name: 'Auto Health Checker',
  tagline: 'Automated Website Health, Security & Quality Analysis',
  domain: 'Cybersecurity · Web Security · Automated QA · AI',
} as const

export const organization: Organization = {
  name: 'Cyber Wolf',
  site: 'https://www.cyberwolf360.in/',
  logo: 'assets/brand/cyberwolf-192.png',
  logoSmall: 'assets/brand/cyberwolf-96.png',
  logoMark: 'assets/brand/cyberwolf-48.png',
  foundedBy: 'Tamilselvan S',
  summary:
    'A cybersecurity organisation working across offensive security, compliance, managed detection and secure product development — with a practitioner-led training arm.',
}

export const internship: Internship = {
  programme: 'Ethical Hacking (Offline)',
  certificateNo: 'CW20267990067144',
  signatory: 'Tamilselvan S',
  role: '[INTERNSHIP ROLE]',
  duration: '[INTERNSHIP DURATION]',
  mentor: '[MENTOR NAME]',
  startDate: '[INTERNSHIP START DATE]',
  endDate: '[INTERNSHIP END DATE]',
}

export const demoScan: DemoScan = {
  url: 'https://example.com',
  score: 87,
  metrics: { security: 91, performance: 78, reliability: 89, accessibility: 94, ux: 83 },
  severity: { critical: 1, high: 3, medium: 8, low: 14 },
}

export const scanSummary: ScanSummary = {
  percent: 87,
  pages: 42,
  links: 186,
  apis: 94,
  forms: 8,
  consoleErrors: 6,
  brokenLinks: 4,
}

export const terminalScript: TerminalScript = {
  command: '$ health-check scan example.com',
  steps: [
    { kind: 'ok', text: '[✓] Target reachable' },
    { kind: 'ok', text: '[✓] HTTPS enabled' },
    { kind: 'ok', text: '[✓] Security headers analyzed' },
    { kind: 'ok', text: '[✓] 42 pages discovered' },
    { kind: 'warn', text: '[!] 4 broken links detected' },
    { kind: 'warn', text: '[!] 6 JS errors detected' },
    { kind: 'warn', text: '[!] 3 API failures detected' },
    { kind: 'ai', text: '[AI] Correlating findings...' },
    { kind: 'ai', text: '[AI] Generating recommendations...' },
    { kind: 'cmd', text: 'Health Score: 87/100' },
  ],
}

/**
 * Sound effects. Every section already has a synthesised transition tone, so
 * the deck works with no audio files at all. Drop your own files into
 * `public/assets/sfx/` and map them here to use them instead — unmapped
 * sections keep the generated tone, so you can swap them one at a time.
 */
export const sound: SoundConfig = {
  enabledByDefault: true,
  volume: 0.22,
  perSection: {
    // hero: { mode: 'file', src: 'assets/sfx/transition-hero.mp3' },
    // s10: { mode: 'file', src: 'assets/sfx/transition-certificate.mp3' },
  },
  ui: { click: true, hover: false },
}

/**
 * Figures Cyber Wolf publishes on cyberwolf360.in. The site states exactly three
 * headline numbers — 12,400+ vulnerabilities found, 180+ enterprises secured and
 * 99.99% SOC uptime. Nothing else is added here: an unsourced statistic on a
 * company slide is worse than no statistic.
 */
export const orgStats = [
  { value: 12400, suffix: '+', label: 'Vulnerabilities found' },
  { value: 180, suffix: '+', label: 'Enterprises secured' },
  { value: 99.99, suffix: '%', label: 'SOC uptime', decimals: 2 },
] as const

export const capabilities = [
  { name: 'VAPT', detail: 'Web application penetration testing — finding and proving exploitable flaws in web apps.' },
  { name: 'Cloud', detail: 'Cloud posture reviews across AWS, Azure and GCP — identity, storage and network exposure.' },
  { name: 'SOC', detail: 'Managed SOC — detection engineering, alert triage and incident response.' },
  { name: 'API', detail: 'API penetration testing — authentication, authorisation and business-logic abuse.' },
  { name: 'AI / LLM', detail: 'AI and LLM security — prompt injection, model abuse cases, OWASP LLM Top 10.' },
  { name: 'Compliance', detail: 'Compliance support — ISO 27001, SOC 2 and audit readiness.' },
  { name: 'Web', detail: 'Web application and secure code review, aligned to OWASP methodology.' },
  { name: 'IoT', detail: 'IoT and hardware security assessment — firmware, wireless and platform review.' },
  { name: 'Training', detail: 'Practitioner-led cybersecurity training and college internship programs.' },
] as const

export const objectives = [
  { title: 'Understand real-world cybersecurity workflows', detail: 'See how findings move from discovery to a report a client can act on.' },
  { title: 'Learn automated website security testing', detail: 'Move beyond manual clicking into repeatable, scripted assessment.' },
  { title: 'Understand web application architecture', detail: 'Learn how pages, APIs and state actually fit together.' },
  { title: 'Identify bugs and security weaknesses', detail: 'Tell a real defect apart from noise, and prove which is which.' },
  { title: 'Automate repetitive website health checks', detail: 'Replace the slow manual pass with something that runs on its own.' },
  { title: 'Build a practical security-focused project', detail: 'Deliver a working tool, not a slide deck about a tool.' },
  { title: 'Improve problem-solving and reporting skills', detail: 'Write findings clearly enough that someone else can fix them.' },
] as const

export const pillars = [
  {
    key: 'Security',
    icon: 'shield',
    summary: 'Detect security weaknesses and suspicious configurations.',
    points: ['Security headers', 'TLS & cookie flags', 'CORS configuration'],
  },
  {
    key: 'Quality',
    icon: 'clipboard',
    summary: 'Identify bugs, errors, broken resources and UI problems.',
    points: ['Console errors', 'Failed requests', 'Broken assets'],
  },
  {
    key: 'Reliability',
    icon: 'activity',
    summary: 'Test APIs, workflows, forms and important user journeys.',
    points: ['End-to-end flows', 'API contracts', 'Form submissions'],
  },
] as const

export const disciplines = [
  'Web Security',
  'Automated Testing',
  'Browser Automation',
  'API Testing',
  'Performance Testing',
  'Accessibility',
  'AI Analysis',
  'Vulnerability Detection',
  'Reporting',
] as const

/**
 * Tools and technologies shown on the stack slide.
 *
 * Confirm every entry here against what Auto Health Checker actually uses before
 * presenting. The project brief listed these as a suggested stack, not a
 * verified one, and this presentation site itself is React + Vite rather than
 * Next.js — so treat Next.js, Node.js and Express as unconfirmed until checked.
 * Delete anything the project does not use; an inaccurate stack is easy for an
 * examiner to catch.
 */
export const techStack = [
  { group: 'Frontend', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'] },
  { group: 'Automation', items: ['Playwright'] },
  { group: 'Backend', items: ['Node.js', 'Express'] },
  { group: 'Security', items: ['OWASP methodology', 'Security headers', 'API checks', 'Vulnerability detection'] },
  { group: 'Analysis', items: ['AI-assisted finding analysis', 'Risk classification', 'Evidence correlation'] },
  { group: 'Reporting', items: ['JSON', 'PDF reports', 'Dashboard analytics'] },
] as const

export const scanModules = [
  { title: 'Security scan', icon: 'shield', points: ['Security headers', 'Authentication checks', 'Authorisation indicators', 'CORS configuration', 'Cookie security', 'HTTPS / TLS', 'Suspicious client-side exposure'] },
  { title: 'Bug detection', icon: 'alert', points: ['JavaScript errors', 'Console errors', 'Failed requests', '404 pages', '500 errors', 'Broken assets'] },
  { title: 'Flow testing', icon: 'route', points: ['Registration', 'Login', 'Logout', 'Forms', 'Navigation', 'API workflows'] },
  { title: 'Performance', icon: 'gauge', points: ['Page load', 'Core Web Vitals', 'Large assets', 'JavaScript payload', 'Network requests'] },
  { title: 'Accessibility', icon: 'accessibility', points: ['Missing labels', 'Contrast', 'Keyboard navigation', 'Form accessibility', 'Image alt text'] },
  { title: 'UI / UX', icon: 'layout', points: ['Broken layouts', 'Overflow', 'Mobile responsiveness', 'Missing elements', 'Interaction failures'] },
] as const

export interface ArchNode {
  id: string
  title: string
  purpose: string
  input: string
  output: string
  tech: string
  kind?: 'io' | 'engine' | 'ai' | 'score' | 'output'
}

export const architecture: ArchNode[] = [
  { id: 'user', title: 'USER', purpose: 'Who or what starts a scan.', input: 'A website URL.', output: 'A scan request.', tech: 'Dashboard / CLI', kind: 'io' },
  { id: 'url', title: 'WEBSITE URL', purpose: 'The target under test.', input: 'A reachable HTTPS address.', output: 'A validated target record.', tech: 'URL parsing', kind: 'io' },
  { id: 'controller', title: 'SCAN CONTROLLER', purpose: 'Owns the scan: queues jobs, tracks progress, applies limits.', input: 'Target plus scan profile.', output: 'Per-module job results.', tech: 'Node.js · Express' },
  { id: 'playwright', title: 'PLAYWRIGHT ENGINE', purpose: 'Drives a real browser so the scan sees what a user sees.', input: 'A page or flow to exercise.', output: 'Rendered pages plus captured events.', tech: 'Playwright', kind: 'engine' },
  { id: 'crawler', title: 'CRAWLER', purpose: 'Discovers pages and follows internal links.', input: 'A starting URL.', output: 'A discovered page list.', tech: 'Playwright · BFS' },
  { id: 'network', title: 'NETWORK MONITOR', purpose: 'Records every request, response and failure.', input: 'Browser network activity.', output: 'Request and status records.', tech: 'CDP events' },
  { id: 'events', title: 'BROWSER EVENTS', purpose: 'Captures console errors and runtime exceptions.', input: 'Page runtime activity.', output: 'Error and event log.', tech: 'CDP · console API' },
  { id: 'analysis', title: 'ANALYSIS ENGINE', purpose: 'Turns raw events into structured findings.', input: 'Crawler, network and event data.', output: 'Normalised findings.', tech: 'Node.js' },
  { id: 'security', title: 'SECURITY', purpose: 'Evaluates headers, cookies, TLS and exposure.', input: 'Response headers and cookies.', output: 'Security findings.', tech: 'OWASP checks' },
  { id: 'bugs', title: 'BUGS', purpose: 'Groups console errors and failed requests.', input: 'Console and network logs.', output: 'Bug findings.', tech: 'Heuristics' },
  { id: 'flows', title: 'FLOWS', purpose: 'Exercises user journeys end to end.', input: 'Flow definitions.', output: 'Flow pass or fail.', tech: 'Playwright' },
  { id: 'ai', title: 'AI ANALYSIS', purpose: 'Reads findings together and explains likely cause.', input: 'All normalised findings.', output: 'Explanations and recommendations.', tech: 'LLM analysis', kind: 'ai' },
  { id: 'risk', title: 'RISK CORRELATION', purpose: 'Weighs evidence and confidence, then de-duplicates.', input: 'Findings plus AI explanations.', output: 'Ranked, de-duplicated risks.', tech: 'Scoring model' },
  { id: 'score', title: 'HEALTH SCORE', purpose: 'Reduces everything to one number and a severity split.', input: 'Ranked risks.', output: 'A score from 0 to 100.', tech: 'Weighted scoring', kind: 'score' },
  { id: 'dashboard', title: 'DASHBOARD', purpose: 'Interactive results, filterable by severity.', input: 'Score plus findings.', output: 'A browsable report.', tech: 'Next.js · React', kind: 'output' },
  { id: 'pdf', title: 'PDF REPORT', purpose: 'A shareable executive summary.', input: 'Score plus findings.', output: 'A PDF document.', tech: 'Report generator', kind: 'output' },
]

export const challenges = [
  { challenge: 'Websites have many pages and resources.', solution: 'Automated crawling and page discovery.' },
  { challenge: 'Browser errors are difficult to identify manually.', solution: 'Capture console and network events automatically.' },
  { challenge: 'Security scanners can generate false positives.', solution: 'Combine evidence, confidence scoring and contextual analysis.' },
  { challenge: 'User flows can fail even when individual pages work.', solution: 'Automated end-to-end workflow testing.' },
  { challenge: 'Large scan results are difficult to understand.', solution: 'Health score, severity classification and prioritised recommendations.' },
] as const

export const skills = [
  { category: 'CYBERSECURITY', items: ['Web security', 'OWASP', 'Vulnerability assessment', 'Security testing'] },
  { category: 'DEVELOPMENT', items: ['React', 'Next.js', 'TypeScript', 'APIs'] },
  { category: 'AUTOMATION', items: ['Playwright', 'Browser automation', 'Workflow testing'] },
  { category: 'ANALYSIS', items: ['Debugging', 'Log analysis', 'Risk classification', 'AI-assisted analysis'] },
  { category: 'PROFESSIONAL', items: ['Documentation', 'Problem solving', 'Technical presentation', 'Project planning'] },
] as const

export const roadmap = [
  { stage: 'CURRENT', text: 'Website health scanner' },
  { stage: 'NEXT', text: 'AI-powered root cause analysis' },
  { stage: 'FUTURE', text: 'Continuous website monitoring' },
  { stage: 'ADVANCED', text: 'Security + QA + performance intelligence' },
  { stage: 'VISION', text: 'Autonomous website health platform' },
] as const

export const plannedFeatures = [
  'Continuous monitoring',
  'Scheduled scans',
  'AI root-cause analysis',
  'Automatic regression testing',
  'Visual regression detection',
  'API contract testing',
  'Threat intelligence integration',
  'Security trend tracking',
  'Team collaboration',
  'Historical health scores',
  'CI/CD integration',
  'Slack & email alerts',
  'PDF executive reports',
] as const

/** The deck order. `nav` is what the rail shows; `—` marks the cover slides. */
export const sections: SectionMeta[] = [
  { id: 'hero', label: 'OVERVIEW', nav: '—' },
  { id: 's1', label: 'INTRODUCTION', nav: '01' },
  { id: 's2', label: 'ORGANIZATION', nav: '02' },
  { id: 's3', label: 'OBJECTIVES', nav: '03' },
  { id: 's4', label: 'DOMAIN', nav: '04' },
  { id: 's5', label: 'PROJECT', nav: '05' },
  { id: 's6', label: 'ARCHITECTURE', nav: '06' },
  { id: 's7', label: 'CHALLENGES', nav: '07' },
  { id: 's8', label: 'LEARNING', nav: '08' },
  { id: 's9', label: 'FUTURE', nav: '09' },
  { id: 's10', label: 'COMPLETION', nav: '10' },
  { id: 'thanks', label: 'THANK YOU', nav: '—' },
]
