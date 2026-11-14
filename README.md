# Beyond the Dust

**They are silent now. Let them tell you their story.**

An immersive, mobile-first 3D web experience for the **NASA Space Apps Challenge 2026** challenge
*“Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars”*
(Dakar local event).

Visitors don't read a fact sheet: they **teleport** in front of a machine NASA left behind, walk around it in a
360° scene, and **touch each part — the part explains itself**, in words an 8-year-old understands, with a
"Go deeper" level for teenagers. Then the machine tells its own life story, in the first person.

| Machine | Where | Story hook |
|---|---|---|
| Lunar Roving Vehicle (+ Apollo 16 & 17 rovers) | The Moon, Hadley-Apennine | *They came by rocket. They left by rocket. The car stayed behind.* |
| Opportunity (+ twin Spirit) | Mars, Perseverance Valley | *Built for 90 days. It worked for more than 5,000.* |
| Pioneer 10 (+ sister Pioneer 11) | Deep space, toward Aldebaran | *It left for 21 months and spoke for 31 years.* |

## Experience

1. Cinematic intro → **Begin the journey**
2. Solar-system map: choose **Moon / Mars / Deep Space**, then a machine (other NASA artifacts shown as *Coming soon*)
3. Teleport (light tunnel) → arrive in a procedural 360° environment
4. Explore: orbit / pinch-zoom, **numbered hotspots** or tap the model → camera flies to the part, highlight, explanation panel
   (**Simple** / **Go deeper**, *Why it mattered*, sourced *Real numbers*, *Works with* links, *Listen*)
5. Tools: **Exploded view**, **X-ray**, **Guided tour** (camera + voice), reset, fullscreen
6. **Story** (7 chapters: who · why · how · hardest moment · discovery · last day · today), timeline, key numbers, twin, sources
7. Interactive moments: Opportunity's **2018 dust storm** darkens the sky; **Purgatory Dune** wheel spin; Pioneer **plaque** explorer
8. **Send a signal**: a light-speed "Hello" — 1.3 s to the Moon, minutes to Mars, 11 h 20 min to Pioneer 10… and silence
9. **Quiz** (3 questions) → stamp in the **Explorer passport**
10. **Ask me**: offline, kid-safe Q&A that only answers from validated data
11. **For teachers** (printable lesson ideas) and **Sources & credits** pages

Accessibility & reach: English by default + full French (EN/FR switch), captions on all narration, browser-voice fallback
when no MP3 exists, keyboard navigation (parts are also a button list), reduced motion, large text, AA contrast,
44 px touch targets, a **2D story mode** when WebGL is unavailable (`?no3d=1` to test), works offline after load
(fonts and Draco decoder are self-hosted).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
npm run preview
```

Deploy `dist/` to any static host — Vercel (`vercel.json`), Netlify (`netlify.toml`) or GitHub Pages (relative `base`,
hash routing, no server needed).

Useful URLs: `#/hub`, `#/machine/opportunity`, `#/machine/pioneer10`, `#/machine/lrv`, `#/teachers`, `#/sources`,
`?lang=fr`, `?no3d=1`, **`?demo=1`** (scripted 30-second sequence for the video, press `R` to replay).

## Architecture

```
src/
  data/            single source of truth (typed, bilingual): vehicles/lrv.ts, opportunity.ts, pioneer10.ts, sources.ts
  i18n/            UI strings EN/FR (content strings live in data/)
  store/           Zustand app state (screen, machine, selected part, modes, settings, passport)
  three/           React Three Fiber scene
    parts.tsx        part effects engine: registration, explode, highlight, focus dimming, X-ray
    VehicleModel.tsx team .glb (mapped by node name) with procedural fallback
    procedural/      LRV, Opportunity, Pioneer 10 built from primitives (real-world scale, 1 unit = 1 m)
    environments/    Moon, Mars (storm shader), Deep Space (Milky Way shader) — no heavy assets
    CameraRig.tsx    fly-in, fly-to on part selection, idle auto-rotate, limits
  components/      intro, hub (solar map), machine (panels), events (storm, plaque), pages
  hooks/           narrator (MP3 → speechSynthesis fallback + captions), Web Audio ambience
scripts/           inspect-glb.mjs, gen-docs.mjs, audio-scripts.md
```

Stack: React 19, TypeScript, Vite, three.js, @react-three/fiber + drei, Zustand, Motion, Tailwind CSS v4, Lucide, Fontsource.
The 3D bundle is lazy-loaded only when a machine is opened (initial JS ≈ 160 kB gzip).

## Add a machine

1. Create `src/data/vehicles/<id>.ts` following the `Vehicle` type in `src/data/types.ts`
   (parts, chapters, key dates, stats, telemetry, quiz, FAQ, sources). Mark uncertain values with `verify: true`.
2. Register it in `src/data/index.ts`, add its id to `VehicleId`.
3. Provide a model: either a procedural component in `src/three/procedural/` (wrap each part in `<Part id="...">`)
   or just drop a `.glb` in `public/models/<id>.glb`.
4. `npm run docs` to refresh `FACT_CHECK.md` and the audio scripts.

## Plug in a team .glb model

- Save as `public/models/lrv.glb`, `opportunity.glb` or `pioneer10.glb` (< 5 MB, Draco recommended:
  `npx @gltf-transform/cli optimize in.glb out.glb --compress draco`).
- **Name objects after the part id** (`wheels`, `solar-panels`, `robotic-arm`, `rtg`, `plaque`…). Any name containing
  one of the part's `meshNames` patterns also works; children inherit their parent's part.
- Check the mapping: `npm run inspect-glb -- public/models/opportunity.glb`
- The app detects the file automatically. If it is missing or fails to load, the procedural model is used — nothing breaks.
- Keep 1 unit = 1 m and the same orientation (+x front, +y up; Pioneer dish facing +z) so hotspots line up,
  or adjust `anchor` / `camera` in the data file.

## Audio

Narration MP3s are pre-generated with AI text-to-speech: `pip install edge-tts && npm run audio` (add `-- --force` to regenerate after editing texts). Texts are in `scripts/audio-scripts.md`. Files are `public/audio/<id>_<lang>.mp3` (and optional
`public/audio/parts/<id>_<part>_<lang>.mp3`). Missing files fall back to the browser voice with synced captions.

## NASA data used

- NASA NSSDCA — The Apollo Lunar Roving Vehicle: https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html · Apollo 15 (1971-063C): https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C
- NASA Apollo Lunar Surface Journal: https://www.nasa.gov/history/alsj/
- NASA Science / JPL — Mars Exploration Rovers Spirit and Opportunity: https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/
- NASA Science — Pioneer 10: https://science.nasa.gov/mission/pioneer-10/ and Pioneer 11: https://science.nasa.gov/mission/pioneer-11/
- NASA Space Science Data Coordinated Archive: https://nssdc.gsfc.nasa.gov/

Every displayed number carries its source in the UI. Values still being double-checked show an amber dot and are
listed in [`FACT_CHECK.md`](FACT_CHECK.md).

## Use of AI

- **Code**: written with AI assistance (an AI coding assistant) and reviewed by the team. Data files carry a header noting this.
- **Texts**: first drafts by AI from the NASA sources above, reviewed and fact-checked by the team.
- **3D models & environments**: procedural, generated in code (no AI images).
- **Voice-over**: AI neural text-to-speech, adult voices only — Microsoft Edge neural voices generated with `edge-tts` (`npm run audio`; EN: Andrew / Ava, FR: Rémy / Vivienne). Any file can be replaced by an ElevenLabs export with the same name.
- Any AI-generated image or video carries a visible **"AI-generated"** watermark.
- No NASA logos, flags, insignia or mission patches are used anywhere.

