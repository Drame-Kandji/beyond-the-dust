# Space Apps submission texts (English — ready to paste)

> Fill in the bracketed items (links) before submitting. Submit before **Sunday 15 November 2026, 23:59 GMT**,
> and click **Submit for Judging** after every edit.

## Project Name
Beyond the Dust

## High-Level Summary
Beyond the Dust is a free, mobile-first 3D web experience that lets school-age space fans *teleport* to three machines
NASA left behind — the Lunar Roving Vehicle on the Moon, the Opportunity rover on Mars and the Pioneer 10 probe drifting
toward Aldebaran. Instead of reading a fact sheet, visitors walk around each machine in a 360° scene and touch its
parts: every part explains itself in simple, first-person words ("I'm the antenna, the rover's phone to Earth"), with a
"Go deeper" level that links the engineering to the science it made possible. Each machine then tells its own life story
in seven short chapters, from launch to its last day. Interactive moments make the science felt: the 2018 dust storm
darkens Opportunity's sky, and a "Send a signal" button shows a light-speed message taking 11 hours 20 minutes to reach
Pioneer 10 — with no answer. All content is sourced from NASA archives, bilingual (English/French), narrated, and works
on low-end phones.

## Project Demo
[Link to the 30-second video — YouTube / Google Drive, public, no sign-in]

## Final Project
[Public website URL] · Source code: [GitHub repository URL]

## Project Details
**What it does.** Beyond the Dust turns NASA's archive records about discarded hardware into an explorable story.
The visitor picks a destination on a solar-system map, chooses a machine and is teleported in front of it.

**How it works.**
- *Touchable parts*: 31 clickable parts across the three machines (wheels, batteries, solar panels, robotic arm, rock
  abrasion tool, RTG nuclear generators, the Pioneer plaque…). Clicking flies the camera to the part, highlights it and
  opens an explanation with two reading levels (age 8–10 and 11–15), a "why it mattered" link to the science,
  sourced numbers, and links to the parts it works with. Exploded view, X-ray mode and a narrated guided tour help
  children understand how the machine is assembled.
- *Storytelling*: each machine narrates seven chapters (who I am, why I was sent, how I worked, my hardest moment, what
  I discovered, my last day, where I am today), plus a timeline, key numbers and its twin (Spirit, Pioneer 11, the
  Apollo 16/17 rovers).
- *Interactive science*: the 2018 planet-wide dust storm, the Purgatory Dune episode, the Pioneer plaque explorer and
  a light-delay signal simulator (Moon 1.3 s, Mars 3–22 min, Pioneer 10 at last contact 11 h 20 min).
- *Learning loop*: a three-question quiz per machine with explanations, an Explorer passport, an offline "Ask me" chat
  that only answers from validated data, and a printable page for teachers.
- *Accessibility*: English and French, narration with synchronised captions (MP3 or browser voice), keyboard
  navigation, reduced-motion and large-text modes, a 2D story mode when 3D is unavailable, and a light initial
  download (~160 kB of JavaScript) for slow connections.

**Benefits.** Children usually hear only about active missions. Beyond the Dust gives a voice to the silent machines
and shows *how* they worked, turning a list of facts into an emotional, memorable story — in a format that runs in any
browser, in class or at home, without installing anything.

**Goals.** Inspire the next generation, especially in French-speaking Africa, by connecting engineering choices
(wire-mesh wheels, solar vs. nuclear power, radio antennas) to the discoveries they enabled. The data-driven design
makes it easy to add the other artifacts (Surveyor, Sojourner, Viking, InSight, Ingenuity, Dawn, NEAR, Kepler).

**Tools.** TypeScript, React, Vite, three.js with React Three Fiber and drei (3D), Zustand, Motion, Tailwind CSS,
Web Audio API, Web Speech API; Blender/CAD for team models (glTF/.glb with Draco compression); ElevenLabs for voice-over.

## Use of AI
- Code: written with the help of an AI coding assistant, reviewed and tested by the team.
- Text: first drafts of the explanations and stories generated with AI from NASA sources, then edited and fact-checked
  by the team (fact-check log in the repository: FACT_CHECK.md).
- Voice-over: AI neural text-to-speech (Microsoft Edge neural voices via the open-source edge-tts tool), adult voices only, in English and French.
- 3D models and environments are procedural code; any AI-generated image or video carries a visible "AI-generated"
  watermark. No NASA logos, flags or mission insignia are used.

## Space Agency Data
We used the NASA resources listed for this challenge as the core of every screen:
- **NASA NSSDCA** — The Apollo Lunar Roving Vehicle page and the Apollo 15 record (1971-063C): mass, payload, wheels, batteries, navigation,
  Apollo 15 traverse distance and samples.
- **Apollo Lunar Surface Journal** — Apollo 15–17 rover anecdotes (front steering on Apollo 15, the Apollo 17 fender
  repair, liftoff filmed by the rover's camera).
- **NASA Science / JPL — Mars Exploration Rovers Spirit and Opportunity**: launch and landing dates, 90-sol plan vs.
  14 years, 45.16 km, hematite "blueberries" and water evidence, Purgatory Dune, the June 10, 2018 last signal and the
  February 13, 2019 end of mission; Spirit's landing in Gusev crater.
- **NASA Science — Pioneer 10 and Pioneer 11**: launch, first asteroid-belt crossing, first Jupiter flyby, RTG power,
  2.74 m dish, the plaque, last signal on January 23, 2003 and the heading toward Aldebaran; Pioneer 11 and Saturn.
These data shaped the story structure itself: each machine's "last day" is the real end-of-mission cause recorded by NASA.
Every number in the app shows its NASA source.

## References
- NASA NSSDCA — https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html and https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C
- NASA Apollo Lunar Surface Journal — https://www.nasa.gov/history/alsj/
- NASA Science, Mars Exploration Rovers — https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/
- NASA Science, Pioneer 10 — https://science.nasa.gov/mission/pioneer-10/ · Pioneer 11 — https://science.nasa.gov/mission/pioneer-11/
- Software: React, three.js, React Three Fiber, drei, camera-controls, Zustand, Motion, Tailwind CSS, Vite, esbuild,
  Lucide, Draco (all open source, MIT/ISC/Apache-2.0)
- Fonts: Fraunces, DM Sans, JetBrains Mono (SIL OFL, via Fontsource)
- AI tools: an AI coding assistant, Microsoft neural text-to-speech (edge-tts)

NASA does not endorse any non-U.S. Government entity and is not responsible for information contained on non-U.S. Government websites.
