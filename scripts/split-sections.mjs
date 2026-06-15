import { mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const indexPath = join(root, 'index.html');
const sectionsDir = join(root, 'sections');

const screens = [
  ['screen-01', '01-hero-and-features.html', ['../styles/base.css', '../styles/screen-01-hero.css']],
  ['screen-02', '02-scenarios.html', ['../styles/base.css', '../styles/screen-02-scenarios.css']],
  ['screen-03', '03-dashboard.html', ['../styles/base.css', '../styles/screen-03-dashboard.css']],
  ['screen-04', '04-how-it-works.html', ['../styles/base.css', '../styles/screen-04-how.css']],
  ['screen-05', '05-legal-armor.html', ['../styles/base.css', '../styles/screen-05-armor.css']],
  ['screen-06', '06-team.html', ['../styles/base.css', '../styles/screen-06-team.css']],
  ['screen-07', '07-before-after.html', ['../styles/base.css', '../styles/screen-07-compare.css']],
  ['screen-08', '08-project-cases.html', ['../styles/base.css', '../styles/screen-08-cases.css']],
  ['screen-09', '09-trust.html', ['../styles/base.css', '../styles/screen-09-trust.css']],
  ['screen-10', '10-pricing.html', ['../styles/base.css', '../styles/screen-10-pricing.css']],
  ['screen-11', '11-faq.html', ['../styles/base.css', '../styles/screen-11-faq.css']],
  ['screen-12', '12-readiness-check.html', ['../styles/base.css', '../styles/screen-12-readiness.css']],
  ['screen-13', '13-contact.html', ['../styles/base.css', '../styles/screen-13-contact.css']],
];

const html = readFileSync(indexPath, 'utf8');
mkdirSync(sectionsDir, { recursive: true });

for (const fileName of readdirSync(sectionsDir)) {
  if (/^\d{2}-.+\.html$/.test(fileName)) {
    unlinkSync(join(sectionsDir, fileName));
  }
}

for (const [marker, fileName, styles] of screens) {
  const pattern = new RegExp(`<!-- ${marker}:start -->([\\s\\S]*?)<!-- ${marker}:end -->`);
  const match = html.match(pattern);

  if (!match) {
    throw new Error(`Marker ${marker} not found in index.html`);
  }

  const styleList = styles.map((style) => `- ${style}`).join('\n');
  const section = [
    `<!--`,
    `  Source: index.html (${marker})`,
    `  Tailwind CDN is configured in the shared index.html.`,
    `  Screen styles:`,
    styleList,
    `-->`,
    match[1].trim(),
    '',
  ].join('\n');

  writeFileSync(join(sectionsDir, fileName), section);
}

console.log(`Split ${screens.length} screens into sections/`);
