#!/usr/bin/env node
/**
 * Generates the narration MP3s with neural text-to-speech (Microsoft Edge voices via `edge-tts`).
 * Adult voices only (contest rule). Requires Python + `pip install edge-tts`.
 * Usage: npm run audio            (skips files that already exist)
 *        npm run audio -- --force (regenerate everything)
 * Replace any file with an ElevenLabs export of the same name if you prefer.
 */
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const force = process.argv.includes('--force');
const EDGE = process.env.EDGE_TTS || 'edge-tts';
const VOICES = {
  story: { en: 'en-US-AndrewMultilingualNeural', fr: 'fr-FR-RemyMultilingualNeural' }, // warm adult narrator
  part: { en: 'en-US-AvaMultilingualNeural', fr: 'fr-FR-VivienneMultilingualNeural' }, // the machine's own voice
};
const out = join(tmpdir(), `btd-audio-${Date.now()}.mjs`);
await build({ entryPoints: ['src/data/index.ts'], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent' });
const { VEHICLE_LIST } = await import(pathToFileURL(out).href);
mkdirSync('public/audio/parts', { recursive: true });

const jobs = [];
for (const v of VEHICLE_LIST)
  for (const lang of ['en', 'fr']) {
    jobs.push({ file: `public/audio/${v.id}_${lang}.mp3`, text: v.audio.transcript[lang], voice: VOICES.story[lang], rate: '-6%' });
    for (const p of v.parts) jobs.push({ file: `public/audio/parts/${v.id}_${p.id}_${lang}.mp3`, text: p.simple[lang], voice: VOICES.part[lang], rate: '-4%' });
  }

let done = 0;
for (const j of jobs) {
  if (!force && existsSync(j.file)) continue;
  const txt = join(tmpdir(), 'btd-tts.txt');
  writeFileSync(txt, j.text);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      execFileSync(EDGE, ['--voice', j.voice, `--rate=${j.rate}`, '-f', txt, '--write-media', j.file], { stdio: 'pipe' });
      break;
    } catch (e) {
      if (attempt === 3) console.error(`✗ ${j.file}: ${String(e.stderr || e).slice(0, 200)}`);
    }
  }
  done++;
  process.stdout.write(`\r${done} file(s) generated`);
}
rmSync(out, { force: true });
console.log(`\n✓ ${jobs.length} narration files in public/audio`);
