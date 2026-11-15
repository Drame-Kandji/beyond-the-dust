/**
 * Beyond the Dust: data model.
 * Content was drafted with AI assistance from NASA sources listed in sources.ts
 * and reviewed by the team. Items flagged `verify: true` are listed in FACT_CHECK.md.
 */
export type Lang = 'en' | 'fr';
export type L10n = { en: string; fr: string };
export type Vec3 = [number, number, number];
export type DestinationId = 'moon' | 'mars' | 'deep-space';
export type VehicleId = 'lrv' | 'opportunity' | 'pioneer10' | 'apollo11lm' | 'sojourner' | 'curiosity' | 'perseverance';
export type ChapterId = 'who' | 'why' | 'how' | 'hardest' | 'discovered' | 'last-day' | 'today';

export interface Fact {
  value: string;
  label: L10n;
  sourceId: string;
  verify?: boolean;
}

export interface KeyDate {
  date: string; // ISO date (UTC unless noted in label)
  label: L10n;
  kind: 'launch' | 'feat' | 'trouble' | 'end' | 'today';
  sourceId: string;
  verify?: boolean;
}

export interface Chapter {
  id: ChapterId;
  title: L10n;
  lead: L10n;
  body: L10n;
  /** Optional 3D action triggered when the chapter is shown. */
  sceneAction?: 'storm' | 'spin' | 'plaque' | 'focus-part';
  focusPart?: string;
}

export interface Part {
  id: string;
  icon: string; // lucide icon name (see components/ui/PartIcon)
  name: L10n;
  /** Regex sources used to map a team .glb node name to this part. */
  meshNames: string[];
  anchor: Vec3;
  camera: { position: Vec3; target: Vec3 };
  explode: Vec3;
  simple: L10n;
  deeper: L10n;
  whyItMattered: L10n;
  funFact?: L10n;
  numbers?: Fact[];
  worksWith?: string[];
  verify?: boolean;
  /** Special interactive event opened from the part panel. */
  event?: 'storm' | 'plaque';
}

export interface QuizQuestion {
  q: L10n;
  options: L10n[];
  answer: number;
  explain: L10n;
}

export interface Faq {
  q: L10n;
  a: L10n;
  keywords: string[];
}

export interface Twin {
  name: L10n;
  summary: L10n;
  facts: Fact[];
}

export interface Telemetry {
  band: L10n;
  power?: Fact;
  delay: L10n;
  /** One-way light time used by the "Send a signal" animation, in seconds. */
  delaySeconds: number;
  delayLabel: L10n;
  lastContact: L10n;
  link: L10n;
  replies: boolean;
  replyText: L10n;
}

export interface Vehicle {
  id: VehicleId;
  destination: DestinationId;
  name: L10n;
  category: L10n;
  status: L10n;
  hook: L10n;
  location: L10n;
  teleportText: L10n;
  intro: L10n; // first-person greeting
  twin?: Twin;
  keyDates: KeyDate[];
  stats: Fact[];
  chapters: Chapter[];
  parts: Part[];
  telemetry: Telemetry;
  quiz: QuizQuestion[];
  faq: Faq[];
  audio: { story: Partial<Record<Lang, string>>; transcript: L10n };
  model: {
    glb: string;
    scale: number;
    defaultCamera: { position: Vec3; target: Vec3 };
    /** Procedural parts still drawn when the .glb is shown (scene items that are not in the CAD file). */
    overlay?: string[];
    /** Environment tuning (all optional). */
    env?: { clearRadius?: number; tracks?: boolean; blueberries?: boolean; landerSilhouette?: boolean; rockiness?: number };
  };
  /** Teacher page content (optional; falls back to built-in lessons). */
  lesson?: { ideas: L10n[]; activity: L10n };
  sources: string[];
  loadingText: L10n;
}

export interface ComingSoon {
  id: string;
  destination: DestinationId;
  name: string;
  line: L10n;
}

export interface Destination {
  id: DestinationId;
  name: L10n;
  tagline: L10n;
  fact: L10n;
}

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
}
