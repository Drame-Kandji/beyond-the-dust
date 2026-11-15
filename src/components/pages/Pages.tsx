import { ArrowLeft, ExternalLink, Printer, Rocket } from 'lucide-react';
import { TEAM } from '../../data/team';
import { VEHICLE_LIST } from '../../data';
import { SOURCES } from '../../data/sources';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';
import { LanguageSwitch } from '../layout/Settings';
import { VehicleArt } from '../ui/VehicleArt';
import type { VehicleId } from '../../data/types';

const t2 = (en: string, fr: string) => ({ en, fr });

function PageShell({ title, children, print = false }: { title: string; children: React.ReactNode; print?: boolean }) {
  const { t } = useT();
  return (
    <main className="min-h-dvh bg-space-950 px-4 pt-[calc(var(--sat)+16px)] pb-16 print-light">
      <div className="mx-auto max-w-4xl">
        <div className="no-print mb-8 flex flex-wrap items-center gap-2">
          <button className="btn glass" onClick={() => useAppStore.getState().setScreen('hub')}>
            <ArrowLeft size={18} /> {t('backToMap')}
          </button>
          <div className="ml-auto flex flex-wrap gap-2">
            {print && (
              <button className="btn glass" onClick={() => window.print()}>
                <Printer size={18} aria-hidden /> {t('print')}
              </button>
            )}
            <LanguageSwitch />
          </div>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
        {children}
      </div>
    </main>
  );
}

const LESSONS: Partial<Record<VehicleId, { ideas: readonly { en: string; fr: string }[]; activity: { en: string; fr: string } }>> = {
  lrv: {
    ideas: [
      t2('Gravity on the Moon is about 1/6 of Earth’s: mass vs. weight.', 'La gravité lunaire vaut environ 1/6 de celle de la Terre : masse et poids.'),
      t2('Why air-filled tyres fail in a vacuum; engineering for extreme places.', 'Pourquoi les pneus à air échouent dans le vide ; concevoir pour des lieux extrêmes.'),
      t2('Navigation without GPS or a magnetic compass.', 'Se repérer sans GPS ni boussole magnétique.'),
    ],
    activity: t2(
      '15 min: "Pack the lunar module": give groups a weight budget and a list of items (rover, rocks, tools, food). They must choose what comes home. Discuss why the rover stayed.',
      '15 min : « Remplis le module lunaire » : donnez aux groupes un budget de masse et une liste d’objets (rover, roches, outils, nourriture). Ils choisissent ce qui revient. Discutez de la raison pour laquelle le rover est resté.',
    ),
  },
  opportunity: {
    ideas: [
      t2('Solar energy: how light becomes electricity, and why dust is a problem.', 'L’énergie solaire : comment la lumière devient électricité, et pourquoi la poussière pose problème.'),
      t2('Rocks as history books: minerals that form in water.', 'Les roches comme livres d’histoire : les minéraux qui se forment dans l’eau.'),
      t2('Time delay: why a rover must be partly autonomous.', 'Le délai de communication : pourquoi un rover doit être en partie autonome.'),
    ],
    activity: t2(
      '15 min: "Remote rover": one student is the rover (eyes closed), another is "Earth" and can only send one instruction every 30 seconds. Experience why Mars rovers need hazard cameras.',
      '15 min : « Rover télécommandé » : un élève joue le rover (yeux fermés), un autre la « Terre », qui ne peut envoyer qu’une instruction toutes les 30 secondes. On comprend pourquoi les rovers ont besoin de caméras anti-obstacles.',
    ),
  },
  pioneer10: {
    ideas: [
      t2('Light gets weaker with distance: solar vs. nuclear (RTG) power.', 'La lumière faiblit avec la distance : énergie solaire ou nucléaire (RTG).'),
      t2('The speed of light: a signal took about 11 h 20 min in 2003.', 'La vitesse de la lumière : un signal mettait environ 11 h 20 en 2003.'),
      t2('Communicating with science: the plaque as a universal message.', 'Communiquer grâce à la science : la plaque comme message universel.'),
    ],
    activity: t2(
      '15 min: "Design your plaque": with no words, draw a message that tells strangers who we are and where Earth is. Compare with the Pioneer plaque.',
      '15 min : « Dessine ta plaque » : sans aucun mot, dessinez un message qui dit à des inconnus qui nous sommes et où est la Terre. Comparez avec la plaque de Pioneer.',
    ),
  },
};

export function TeachersPage() {
  const { t, l } = useT();
  return (
    <PageShell title={t('teachers')} print>
      <p className="mt-3 max-w-2xl text-lg text-ink-300">
        {l(t2('Three machines, three science lessons, ages 8-15. Every fact links to a NASA source; the in-app quizzes reuse these questions.', 'Trois machines, trois leçons de sciences, de 8 à 15 ans. Chaque fait renvoie à une source NASA ; les quiz de l’application reprennent ces questions.'))}
      </p>
      <div className="mt-8 grid gap-6">
        {VEHICLE_LIST.map((v) => {
          const lesson = v.lesson ?? LESSONS[v.id];
          if (!lesson) return null;
          return (
            <section key={v.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 print-light">
              <div className="flex items-center gap-4">
                <VehicleArt id={v.id} className="h-12 w-16 text-amber-400" />
                <div>
                  <h2 className="font-display text-2xl">{l(v.name)}</h2>
                  <p className="text-sm text-ink-300 italic">“{l(v.hook)}”</p>
                </div>
              </div>
              <h3 className="eyebrow mt-5 mb-2">{l(t2('Science ideas', 'Notions scientifiques'))}</h3>
              <ul className="list-disc space-y-1 pl-5">
                {lesson.ideas.map((i) => (
                  <li key={i.en}>{l(i)}</li>
                ))}
              </ul>
              <h3 className="eyebrow mt-5 mb-2">{l(t2('Class activity', 'Activité en classe'))}</h3>
              <p>{l(lesson.activity)}</p>
              <h3 className="eyebrow mt-5 mb-2">{t('quiz')}</h3>
              <ol className="list-decimal space-y-1 pl-5">
                {v.quiz.map((q) => (
                  <li key={q.q.en}>
                    {l(q.q)} <span className="text-ink-500">: {l(q.options[q.answer])}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-ink-500">
                {t('sources')}: {v.sources.map((s) => SOURCES[s].publisher).join(' · ')}
              </p>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}

export function SourcesPage() {
  const { t, l } = useT();
  return (
    <PageShell title={t('sourcesCredits')}>
      <section className="mt-8">
        <h2 className="eyebrow mb-3">NASA data</h2>
        <ul>
          {Object.values(SOURCES).map((s) => (
            <li key={s.id}>
              <a className="inline-flex min-h-[44px] items-start gap-2 py-2.5 text-ink-100 underline decoration-white/20 hover:decoration-amber-400" href={s.url} target="_blank" rel="noreferrer">
                <ExternalLink size={15} className="mt-1 shrink-0" aria-hidden /> <span>{s.publisher} · {s.title}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-ink-300">
          {l(t2('Facts marked with an amber dot are being double-checked by our team against the NASA pages above (see FACT_CHECK.md in the repository).', 'Les faits marqués d’un point ambre sont en cours de vérification par l’équipe sur les pages NASA ci-dessus (voir FACT_CHECK.md dans le dépôt).'))}
        </p>
      </section>
      <section className="mt-10">
        <h2 className="eyebrow mb-3">{l(t2('Use of AI', 'Utilisation de l’IA'))}</h2>
        <p className="text-ink-300">
          {l(t2('The code, the procedural 3D models and first drafts of the texts were produced with AI assistance (an AI coding assistant), then reviewed by the team. The narration uses AI neural text-to-speech with adult voices (Microsoft Edge neural voices). Any AI-generated image carries a visible "AI-generated" watermark. No NASA logos, insignia or mission patches are used.', 'Le code, les modèles 3D procéduraux et les premiers jets des textes ont été produits avec l’aide de l’IA (un assistant de code IA), puis relus par l’équipe. La narration utilise une synthèse vocale neuronale par IA, avec des voix adultes (voix neuronales Microsoft Edge). Toute image générée par IA porte un filigrane visible « AI-generated ». Aucun logo, insigne ou écusson de mission NASA n’est utilisé.'))}
        </p>
      </section>
      <section className="mt-10">
        <h2 className="eyebrow mb-3">Credits</h2>
        <ul className="list-disc space-y-1 pl-5 text-ink-300">
          <li>Fonts: Fraunces, DM Sans, JetBrains Mono, SIL Open Font License (via Fontsource).</li>
          <li>3D: three.js, React Three Fiber, drei (MIT). Apollo 11 LM, Pioneer 10 and Perseverance: models from NASA 3D Resources (science.nasa.gov/3d-resources), split into clickable parts by the team, NASA/JPL logos removed. Curiosity and Sojourner: the team’s own Blender / SolidWorks models. The other machines and all environments are procedural, built for this project.</li>
          <li>Icons: Lucide (ISC). Animation: Motion (MIT). State: Zustand (MIT).</li>
          <li>Sounds: generated in the browser with the Web Audio API.</li>
          <li>Challenge: NASA Space Apps Challenge 2026: “Abandoned but not Forgotten”.</li>
        </ul>
      </section>
      <TeamSection />
    </PageShell>
  );
}

const AVATAR_HUES = [32, 190, 280, 12, 150, 220];

function TeamSection() {
  const { t, l } = useT();
  return (
    <section className="mt-12" aria-labelledby="team-title">
      <div className="team-hero relative overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-8">
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2 flex items-center gap-2">
              <Rocket size={15} aria-hidden className="text-amber-400" /> NASA Space Apps Challenge 2026
            </p>
            <h2 id="team-title" className="font-display text-3xl sm:text-4xl">
              {t('team')}
            </h2>
          </div>
          <p className="mono rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs tracking-widest text-amber-300 uppercase">
            {l(t2('Challenge: Abandoned but not Forgotten', 'Défi : Abandoned but not Forgotten'))}
          </p>
        </div>
      </div>

      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((m, i) => {
          const hue = AVATAR_HUES[i % AVATAR_HUES.length];
          const initials = m.fullName
            .replace(/…/g, '')
            .split(/\s+/)
            .filter(Boolean)
            .map((w) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
          const card = (
            <>
              <div className="flex items-center gap-4">
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl font-display text-xl font-semibold text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, hsl(${hue} 80% 58%), hsl(${(hue + 40) % 360} 70% 38%))` }}
                  aria-hidden
                >
                  {initials || m.firstName[0]}
                </div>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-display text-lg leading-tight font-semibold text-ink-100">
                    {m.fullName.replace(/\s*…\s*$/, '')}
                    {m.lead && (
                      <span className="mono rounded-full bg-amber-400/15 px-2 py-0.5 font-sans text-[0.68rem] font-normal tracking-wider text-amber-300 uppercase">
                        Lead
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm font-medium" style={{ color: `hsl(${hue} 85% 70%)` }}>
                    {l(m.role)}
                  </p>
                </div>
              </div>
              <p className="mt-4 border-t border-white/10 pt-3 text-[0.95rem] leading-relaxed text-ink-300">{l(m.focus)}</p>
            </>
          );
          return (
            <li key={m.firstName} className="team-card rounded-2xl border border-white/10 p-5 transition hover:-translate-y-0.5 hover:border-white/20">
              {m.link ? (
                <a href={m.link} target="_blank" rel="noreferrer" className="block">
                  {card}
                </a>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
