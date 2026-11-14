#!/usr/bin/env node
/**
 * Regenerates FACT_CHECK.md and scripts/audio-scripts.md from src/data (single source of truth).
 * Usage: npm run docs
 */
import { build } from 'esbuild';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const out = join(tmpdir(), `btd-data-${Date.now()}.mjs`);
await build({ entryPoints: ['src/data/index.ts'], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent' });
const { VEHICLE_LIST } = await import(pathToFileURL(out).href);
const { SOURCES } = await import(pathToFileURL(out).href).then(async () => {
  const o2 = out.replace('.mjs', '-s.mjs');
  await build({ entryPoints: ['src/data/sources.ts'], bundle: true, format: 'esm', platform: 'node', outfile: o2, logLevel: 'silent' });
  return import(pathToFileURL(o2).href);
});

const OWNER = { lrv: 'Siga', opportunity: 'Cheikhouna', pioneer10: 'Cheikhouna' };
const rows = [];
for (const v of VEHICLE_LIST) {
  const add = (what, value, sourceId, owner = OWNER[v.id]) => rows.push({ v: v.name.en, what, value, src: SOURCES[sourceId] || SOURCES[v.sources[0]], owner });
  v.stats.filter((f) => f.verify).forEach((f) => add(`Stat — ${f.label.en}`, f.value, f.sourceId));
  v.keyDates.filter((d) => d.verify).forEach((d) => add(`Date — ${d.label.en}`, d.date, d.sourceId));
  v.twin?.facts.filter((f) => f.verify).forEach((f) => add(`Twin — ${f.label.en}`, f.value, f.sourceId));
  v.parts.forEach((p) => {
    if (p.verify) add(`Part text — ${p.name.en}`, '(whole explanation)', v.sources[0]);
    p.numbers?.filter((f) => f.verify).forEach((f) => add(`Part number — ${p.name.en}: ${f.label.en}`, f.value, f.sourceId));
  });
  if (v.telemetry.power?.verify) add(`Telemetry — ${v.telemetry.power.label.en}`, v.telemetry.power.value, v.telemetry.power.sourceId, 'Ibrahima');
}

let md = `# FACT CHECK — Beyond the Dust

> Généré automatiquement depuis \`src/data\` (\`npm run docs\`). **Ne pas éditer à la main** : corrigez la donnée dans \`src/data/vehicles/*.ts\`, puis passez \`verify: true\` à \`false\` (ou supprimez-le) une fois validé.
> Sur le site, chaque valeur encore à vérifier porte un **point ambre**.

Règle : chaque valeur doit être confirmée sur la page NASA indiquée (ou NSSDCA / ALSJ). En cas de doute, préférer « environ » ou retirer le chiffre.

| ✓ | Engin | Élément | Valeur affichée | Source à consulter | Responsable |
|---|---|---|---|---|---|
`;
for (const r of rows) md += `| ☐ | ${r.v} | ${r.what} | ${r.value} | [${r.src.publisher}](${r.src.url}) | ${r.owner} |\n`;
md += `
## Points éditoriaux à confirmer (hors données chiffrées)

| ✓ | Sujet | Ce qu'il faut vérifier | Responsable |
|---|---|---|---|
| ☐ | Opportunity — record de distance | Le plan d'équipe indique que Perseverance aurait dépassé le record d'Opportunity le 11 oct. 2026. **Non affiché sur le site** tant qu'une page NASA ne le confirme pas. | Siga |
| ☐ | Opportunity — « My battery is low… » | Présenté sur le site comme une paraphrase journalistique (pas un vrai message). Garder cette formulation. | Siga |
| ☐ | Opportunity — énergie pendant la tempête | La jauge de l'événement « Last day » illustre une tendance, ce n'est pas de la télémétrie réelle (indiqué dans le code). | Ibrahima |
| ☐ | Pioneer 10 — dates UTC/locales | Lancement 2 mars 1972 (Floride) = 3 mars UTC ; Jupiter 3 déc. 1973 (US) = 4 déc. UTC. | Cheikhouna |
| ☐ | Modèles 3D procéduraux | Proportions approximatives (non affichées comme données). | Mouhamed |
| ☐ | Délai Mars–Terre « 3 à 22 min » | Fourchette usuelle ; l'animation utilise ≈ 12,5 min comme valeur typique, avec mention « accéléré ». | Ibrahima |

Total d'éléments chiffrés à vérifier : **${rows.length}**.
`;
writeFileSync('FACT_CHECK.md', md);

let audio = `# Audio scripts — ready for ElevenLabs

> Generated from \`src/data\` (\`npm run docs\`). Use an **adult** voice (contest rule: no voices of people under 18).
> Export as MP3, ~30–60 s, and save to \`public/audio/{id}_{lang}.mp3\`. The site falls back to the browser voice when a file is missing.
> Optional per-part clips: \`public/audio/parts/{vehicle}_{part}_{lang}.mp3\` (text = the "Simple" explanation).

`;
for (const v of VEHICLE_LIST) {
  for (const lang of ['en', 'fr']) {
    const text = v.audio.transcript[lang];
    audio += `## ${v.name.en} — ${lang.toUpperCase()}  →  \`public/audio/${v.id}_${lang}.mp3\`\n\n_${text.split(/\s+/).length} words_\n\n${text}\n\n`;
  }
}
writeFileSync('scripts/audio-scripts.md', audio);
console.log(`FACT_CHECK.md: ${rows.length} items · scripts/audio-scripts.md written`);
