/**
 * Apollo 11 Lunar Module "Eagle" — descent stage. Content drafted with AI assistance
 * from NASA NSSDCA (1969-059C), the Apollo Lunar Surface Journal and NASA/JPL pages.
 * `verify: true` = to be checked by the team (FACT_CHECK.md).
 * Coordinates: metres, +x = front of the lander (ladder leg, facing west), +y = up, -z = south.
 * The surface experiments are placed closer than in reality (EASEP was ~17 m south) to fit the scene.
 */
import type { Vehicle } from '../types';

const t = (en: string, fr: string) => ({ en, fr });

export const apollo11lm: Vehicle = {
  id: 'apollo11lm',
  destination: 'moon',
  name: t('Apollo 11 Lunar Module "Eagle"', 'Module lunaire « Eagle » d’Apollo 11'),
  category: t('Crewed Moon lander (descent stage)', 'Atterrisseur lunaire habité (étage de descente)'),
  status: t('Standing at Tranquility Base since July 20, 1969', 'Debout à la base de la Tranquillité depuis le 20 juillet 1969'),
  hook: t('The first footprints on the Moon start at my ladder.', 'Les premiers pas sur la Lune commencent au pied de mon échelle.'),
  location: t('Tranquility Base, Sea of Tranquility, the Moon', 'Base de la Tranquillité, mer de la Tranquillité, la Lune'),
  teleportText: t('Teleporting to Tranquility Base, the Moon…', 'Téléportation vers la base de la Tranquillité, sur la Lune…'),
  loadingText: t('Unfolding the landing legs…', 'Dépliage des jambes d’atterrissage…'),
  intro: t(
    "Hello, explorer. I'm the bottom half of Eagle, the spacecraft that carried the first two people down to the Moon. My top half flew them back up. I stayed right here. Touch my parts and I'll tell you how we did it.",
    'Bonjour, explorateur. Je suis la moitié inférieure d’Eagle, le vaisseau qui a déposé les deux premiers humains sur la Lune. Ma moitié du haut les a ramenés en orbite. Moi, je suis resté ici. Touche mes pièces et je te raconterai comment on a fait.',
  ),
  twin: {
    name: t('My five siblings, and my lost top half', 'Mes cinq frères, et ma moitié perdue'),
    summary: t(
      'Five more lunar modules landed after me, with Apollo 12, 14, 15, 16 and 17. Each time, the descent stage stayed on the Moon as a launch pad, just like me. So six of us stand there today. My own top half, the ascent stage, was let go in lunar orbit after the crew moved back to the command module. Nobody knows exactly where it ended up: it probably crashed on the Moon within a few months.',
      'Cinq autres modules lunaires se sont posés après moi, avec Apollo 12, 14, 15, 16 et 17. À chaque fois, l’étage de descente est resté sur la Lune comme rampe de lancement, comme moi. Nous sommes donc six là-bas aujourd’hui. Ma propre moitié du haut, l’étage de remontée, a été larguée en orbite lunaire une fois l’équipage revenu dans le module de commande. Personne ne sait exactement où elle a fini : elle s’est sans doute écrasée sur la Lune en quelques mois.',
    ),
    facts: [
      { value: '6', label: t('descent stages left on the Moon (Apollo 11 to 17, except 13)', 'étages de descente laissés sur la Lune (Apollo 11 à 17, sauf 13)'), sourceId: 'alsj' },
      { value: '1972-12-14', label: t('last lift-off from the Moon (Apollo 17)', 'dernier décollage depuis la Lune (Apollo 17)'), sourceId: 'alsj' },
      { value: '?', label: t('fate of Eagle’s ascent stage (likely crashed within 1–4 months)', 'sort de l’étage de remontée d’Eagle (sans doute écrasé en 1 à 4 mois)'), sourceId: 'nssdca-a11lm' },
    ],
  },
  keyDates: [
    { date: '1969-07-16', kind: 'launch', label: t('Apollo 11 launches on a Saturn V rocket', 'Lancement d’Apollo 11 sur une fusée Saturn V'), sourceId: 'nssdca-a11lm' },
    { date: '1969-07-20', kind: 'trouble', label: t('Computer alarms and a boulder field during the final descent', 'Alarmes de l’ordinateur et champ de rochers pendant la descente finale'), sourceId: 'alsj' },
    { date: '1969-07-20', kind: 'feat', label: t('20:17:40 UT: "The Eagle has landed"', '20 h 17 min 40 s UT : « The Eagle has landed »'), sourceId: 'nssdca-a11lm' },
    { date: '1969-07-21', kind: 'feat', label: t('02:56:15 UT: Neil Armstrong steps onto the Moon (July 20 in the USA)', '02 h 56 min 15 s UT : Neil Armstrong pose le pied sur la Lune (20 juillet aux États-Unis)'), sourceId: 'nssdca-a11lm' },
    { date: '1969-07-21', kind: 'end', label: t('17:54:01 UT: the ascent stage lifts off, using me as its launch pad', '17 h 54 min 01 s UT : l’étage de remontée décolle, en se servant de moi comme rampe'), sourceId: 'nssdca-a11lm' },
    { date: '1969-08-27', kind: 'end', label: t('The seismometer left nearby is switched off', 'Le sismomètre laissé à côté est arrêté'), sourceId: 'nssdca-a11lm' },
    { date: '1972-12-14', kind: 'feat', label: t('Apollo 17 leaves the sixth and last descent stage on the Moon', 'Apollo 17 laisse le sixième et dernier étage de descente sur la Lune'), sourceId: 'alsj' },
    { date: '2026-11-15', kind: 'today', label: t('Still standing; the laser reflector beside me is still used', 'Toujours debout ; le réflecteur laser à côté de moi sert encore'), sourceId: 'nssdca-a11lm' },
  ],
  stats: [
    { value: '15,103 kg', label: t('whole lunar module at launch, with propellant', 'module lunaire complet au départ, avec ergols'), sourceId: 'nssdca-a11lm' },
    { value: '2,034 kg', label: t('my mass without propellant', 'ma masse sans ergols'), sourceId: 'nssdca-a11lm' },
    { value: '9.4 m', label: t('between opposite footpads', 'entre deux pieds opposés'), sourceId: 'nssdca-a11lm' },
    { value: '21 h 36 min', label: t('spent on the Moon by the crew’s lander', 'passées sur la Lune par l’atterrisseur'), sourceId: 'nssdca-a11lm' },
    { value: '21.55 kg', label: t('of Moon rocks and soil brought home', 'de roches et de sol lunaires rapportés'), sourceId: 'nssdca-a11lm' },
    { value: '≈ 45,000 N', label: t('maximum push of my engine', 'poussée maximale de mon moteur'), sourceId: 'nssdca-a11lm' },
  ],
  chapters: [
    {
      id: 'who',
      title: t('Who am I?', 'Qui suis-je ?'),
      lead: t('Half of a spacecraft, wrapped in gold.', 'La moitié d’un vaisseau, emballée dans de l’or.'),
      body: t(
        'I am the descent stage of the lunar module Eagle: an eight-sided box 4.2 metres across, standing on four spider legs. The shiny gold is a thin foil blanket that protected me from heat and cold. On top of me sat the ascent stage, the small cabin where Neil Armstrong and Buzz Aldrin lived for almost a day.',
        'Je suis l’étage de descente du module lunaire Eagle : une boîte à huit côtés de 4,2 mètres de large, posée sur quatre pattes d’araignée. L’or brillant est une fine couverture isolante qui me protégeait du chaud et du froid. Sur moi était posé l’étage de remontée, la petite cabine où Neil Armstrong et Buzz Aldrin ont vécu presque une journée.',
      ),
      sceneAction: 'focus-part',
      focusPart: 'descent-stage-body',
    },
    {
      id: 'why',
      title: t('Why was I sent?', 'Pourquoi m’a-t-on envoyé ?'),
      lead: t('To land people on the Moon, for the very first time.', 'Pour poser des humains sur la Lune, pour la toute première fois.'),
      body: t(
        'The goal of Apollo 11 was simple to say and very hard to do: land two astronauts on the Moon, let them explore, and bring them safely home. My job was the landing. The big command module stayed in orbit with Michael Collins, waiting for Eagle to come back up.',
        'Le but d’Apollo 11 était simple à dire et très difficile à faire : poser deux astronautes sur la Lune, les laisser explorer, puis les ramener sains et saufs. Mon travail, c’était l’atterrissage. Le grand module de commande restait en orbite avec Michael Collins, en attendant le retour d’Eagle.',
      ),
    },
    {
      id: 'how',
      title: t('How I worked', 'Comment je fonctionnais'),
      lead: t('A rocket engine with a gas pedal.', 'Un moteur-fusée avec une pédale d’accélérateur.'),
      body: t(
        'Most rocket engines are either on or off. Mine could be throttled up and down, like a car’s gas pedal. Pointing downward, it slowed Eagle from orbit to a gentle hover above the ground. My legs, footpads and long contact probes did the rest: when a probe touched the dust, a light came on and the crew shut the engine down.',
        'La plupart des moteurs-fusées sont soit allumés, soit éteints. Le mien pouvait monter et baisser sa puissance, comme la pédale d’une voiture. Pointé vers le bas, il a freiné Eagle depuis l’orbite jusqu’à un vol stationnaire au-dessus du sol. Mes jambes, mes pieds et mes longues sondes de contact ont fait le reste : quand une sonde a touché la poussière, un voyant s’est allumé et l’équipage a coupé le moteur.',
      ),
      sceneAction: 'focus-part',
      focusPart: 'descent-engine',
    },
    {
      id: 'hardest',
      title: t('My hardest moment', 'Mon moment le plus difficile'),
      lead: t('Alarms, boulders… and very little fuel.', 'Des alarmes, des rochers… et très peu de carburant.'),
      body: t(
        'During the last minutes of the landing, the computer flashed "1202" and "1201" alarms: it had too much data to handle. Mission Control said GO. Then Neil Armstrong saw that we were heading for a field of boulders next to a crater. He took over by hand and flew me about 340 metres farther. We touched down with only about 45 seconds of fuel left.',
        'Pendant les dernières minutes de l’atterrissage, l’ordinateur a affiché les alarmes « 1202 » et « 1201 » : il avait trop de données à traiter. Le centre de contrôle a dit GO. Puis Neil Armstrong a vu qu’on fonçait vers un champ de rochers près d’un cratère. Il a pris les commandes à la main et m’a fait voler environ 340 mètres plus loin. On s’est posés avec seulement 45 secondes de carburant environ.',
      ),
      sceneAction: 'focus-part',
      focusPart: 'contact-probes',
    },
    {
      id: 'discovered',
      title: t('What we discovered', 'Ce que nous avons découvert'),
      lead: t('Two explorers, two and a half hours, a treasure of rocks.', 'Deux explorateurs, deux heures et demie, un trésor de roches.'),
      body: t(
        'Neil and Buzz walked about 250 metres around me in about two and a half hours outside. They collected 21.55 kg of rocks and soil, the first Moon samples ever brought to Earth. They also set up a seismometer to feel "moonquakes" and a laser mirror, a few steps south of me.',
        'Neil et Buzz ont parcouru environ 250 mètres autour de moi, en à peu près deux heures et demie dehors. Ils ont ramassé 21,55 kg de roches et de sol, les premiers échantillons lunaires jamais rapportés sur Terre. Ils ont aussi installé un sismomètre pour sentir les « séismes lunaires » et un miroir laser, à quelques pas au sud de moi.',
      ),
      sceneAction: 'focus-part',
      focusPart: 'easep-seismometer',
    },
    {
      id: 'last-day',
      title: t('My last day', 'Mon dernier jour'),
      lead: t('I became a launch pad.', 'Je suis devenu une rampe de lancement.'),
      body: t(
        'On July 21, 1969, at 17:54 UT, after 21 hours and 36 minutes on the Moon, the ascent stage fired its own engine and lifted off from my roof. I was left behind on purpose: leaving my heavy legs and empty tanks made the trip home much lighter. The two astronauts flew back to Michael Collins, and I stayed alone in the silence.',
        'Le 21 juillet 1969, à 17 h 54 UT, après 21 heures et 36 minutes sur la Lune, l’étage de remontée a allumé son propre moteur et a décollé de mon toit. J’ai été laissé sur place exprès : abandonner mes lourdes jambes et mes réservoirs vides rendait le retour bien plus léger. Les deux astronautes ont rejoint Michael Collins, et je suis resté seul dans le silence.',
      ),
      sceneAction: 'focus-part',
      focusPart: 'ascent-stage-launchpad',
    },
    {
      id: 'today',
      title: t('Where I am today', 'Où je suis aujourd’hui'),
      lead: t('Still here, still useful.', 'Toujours là, toujours utile.'),
      body: t(
        'I am still standing at Tranquility Base, with my plaque on the leg behind the ladder: "We came in peace for all mankind." A few metres away, the laser mirror the astronauts left is still working. Observatories on Earth fire laser pulses at it and time the echo. That is how we know the Moon drifts away from Earth by about 3.8 cm every year.',
        'Je suis toujours debout à la base de la Tranquillité, avec ma plaque sur la jambe derrière l’échelle : « Nous sommes venus en paix au nom de toute l’humanité. » À quelques mètres, le miroir laser laissé par les astronautes fonctionne toujours. Des observatoires sur Terre lui envoient des impulsions laser et chronomètrent l’écho. C’est ainsi qu’on sait que la Lune s’éloigne de la Terre d’environ 3,8 cm par an.',
      ),
      sceneAction: 'focus-part',
      focusPart: 'laser-retroreflector',
    },
  ],
  parts: [
    {
      id: 'descent-engine',
      icon: 'Flame',
      name: t('Descent engine', 'Moteur de descente'),
      meshNames: ['engine', 'nozzle', 'bell', 'skirt', 'dps', 'moteur'],
      anchor: [0.45, 0.7, 0.45],
      camera: { position: [4.2, 0.6, 3.2], target: [0, 1.0, 0] },
      explode: [0, -0.6, 0],
      simple: t(
        "I'm a rocket engine that points down. I could push softly or strongly, like a gas pedal, so Eagle could slow down and float gently above the ground.",
        'Je suis un moteur-fusée tourné vers le bas. Je pouvais pousser doucement ou fort, comme une pédale d’accélérateur, pour qu’Eagle ralentisse et flotte doucement au-dessus du sol.',
      ),
      deeper: t(
        'The descent engine was "deep-throttling": the crew and computer could change its thrust over a wide range, up to about 45,000 newtons. It braked the lunar module out of orbit, then let Neil Armstrong hover while he searched for a safe spot. Its bell-shaped skirt is about a metre long.',
        'Le moteur de descente était « à forte variation de poussée » : l’équipage et l’ordinateur pouvaient régler sa force sur une large plage, jusqu’à environ 45 000 newtons. Il a freiné le module lunaire pour quitter l’orbite, puis a permis à Neil Armstrong de faire du vol stationnaire en cherchant un endroit sûr. Sa jupe en forme de cloche mesure environ un mètre.',
      ),
      whyItMattered: t('An engine that only had "on" and "off" could never have landed people gently on the Moon.', 'Un moteur qui n’aurait eu que « marche » et « arrêt » n’aurait jamais pu poser des humains en douceur sur la Lune.'),
      funFact: t('Eagle touched down with only about 45 seconds of fuel to spare, the smallest margin of all the Apollo landings.', 'Eagle s’est posé avec environ 45 secondes de carburant en réserve, la plus petite marge de tous les alunissages Apollo.'),
      numbers: [
        { value: '≈ 45,000 N', label: t('maximum thrust', 'poussée maximale'), sourceId: 'nssdca-a11lm' },
        { value: '≈ 45 s', label: t('of fuel left at touchdown', 'de carburant restant à l’atterrissage'), sourceId: 'alsj' },
      ],
      worksWith: ['propellant-tanks', 'contact-probes'],
    },
    {
      id: 'landing-legs',
      icon: 'Anchor',
      name: t('Landing legs and footpads', 'Jambes et pieds d’atterrissage'),
      meshNames: ['leg', 'gear', 'strut', 'footpad', 'pad', 'jambe'],
      anchor: [0.05, 1.5, 3.5],
      camera: { position: [3.8, 1.9, 7.0], target: [0, 1.0, 3.4] },
      explode: [0, -0.25, 0],
      simple: t(
        "We are four spider legs with round feet, like big dinner plates. We spread out wide, like your arms when you balance, so Eagle wouldn't tip over.",
        'Nous sommes quatre pattes d’araignée avec des pieds ronds, comme de grandes assiettes. Nous nous écartons très largement, comme tes bras quand tu te tiens en équilibre, pour qu’Eagle ne bascule pas.',
      ),
      deeper: t(
        'The legs were folded during the trip and swung out before landing. Opposite footpads are 9.4 m apart, and the bottom of the stage sits about 1.5 m above the ground. Crushable material inside the main struts could absorb a hard landing, like the crumple zone of a car.',
        'Les jambes étaient repliées pendant le voyage et se dépliaient avant l’atterrissage. Deux pieds opposés sont à 9,4 m l’un de l’autre, et le dessous de l’étage se trouve à environ 1,5 m du sol. Un matériau écrasable dans les jambes principales pouvait amortir un atterrissage brutal, comme la zone de déformation d’une voiture.',
      ),
      whyItMattered: t('Nobody knew exactly how hard or soft the lunar ground would be. Wide legs and big feet made a safe landing much more likely.', 'Personne ne savait vraiment si le sol lunaire serait dur ou mou. Des jambes écartées et de grands pieds rendaient un atterrissage sûr bien plus probable.'),
      numbers: [
        { value: '9.4 m', label: t('between opposite footpads', 'entre deux pieds opposés'), sourceId: 'nssdca-a11lm' },
        { value: '1.5 m', label: t('from the ground to the bottom of the stage', 'du sol au dessous de l’étage'), sourceId: 'nssdca-a11lm' },
      ],
      worksWith: ['contact-probes', 'ladder-porch', 'descent-stage-body'],
      verify: true,
    },
    {
      id: 'contact-probes',
      icon: 'Ruler',
      name: t('Contact probes', 'Sondes de contact'),
      meshNames: ['probe', 'sonde', 'contact'],
      anchor: [-4.7, 0.1, 0.05],
      camera: { position: [-7.5, 1.4, 2.0], target: [-4.8, 0.1, 0.2] },
      explode: [0, 0, 0],
      simple: t(
        "I'm a long thin feeler hanging under a footpad, like a cat's whisker. When I touched the Moon, a light switched on inside: \"Contact light!\"",
        'Je suis une longue antenne fine sous un pied, comme la moustache d’un chat. Quand j’ai touché la Lune, un voyant s’est allumé à l’intérieur : « Contact light ! »',
      ),
      deeper: t(
        'Probes about 1.7 m long hung below three of the four footpads (not under the ladder leg, where they could have tripped the astronauts). When one touched the surface, the "lunar contact" light came on, telling the crew to shut down the engine just before the feet settled.',
        'Des sondes d’environ 1,7 m pendaient sous trois des quatre pieds (pas sous la jambe de l’échelle, où elles auraient pu faire trébucher les astronautes). Quand l’une d’elles touchait le sol, le voyant « contact lunaire » s’allumait et l’équipage coupait le moteur juste avant que les pieds se posent.',
      ),
      whyItMattered: t('In the dust kicked up by the engine, it was hard to see the ground. The probes "felt" it for the crew.', 'Dans la poussière soulevée par le moteur, on voyait mal le sol. Les sondes le « sentaient » pour l’équipage.'),
      funFact: t('Buzz Aldrin called out "Contact light" at 3:17:40 p.m. Houston time, the moment Eagle reached the Moon.', 'Buzz Aldrin a annoncé « Contact light » à 15 h 17 min 40 s, heure de Houston : le moment où Eagle a atteint la Lune.'),
      numbers: [
        { value: '≈ 1.7 m', label: t('length of each probe (67–68 inches)', 'longueur de chaque sonde (67 à 68 pouces)'), sourceId: 'alsj' },
        { value: '3', label: t('probes, one on each leg except the ladder leg', 'sondes, une par jambe sauf celle de l’échelle'), sourceId: 'alsj', verify: true },
      ],
      worksWith: ['landing-legs', 'descent-engine'],
      verify: true,
    },
    {
      id: 'ladder-porch',
      icon: 'Footprints',
      name: t('Ladder and porch', 'Échelle et plateforme'),
      meshNames: ['ladder', 'porch', 'rung', 'echelle'],
      anchor: [3.35, 2.2, 0.2],
      camera: { position: [7.4, 2.8, 2.8], target: [3.2, 1.9, 0] },
      explode: [0.35, 0, 0],
      simple: t(
        "I'm the little porch and ladder on the front leg. Neil Armstrong climbed down me, jumped onto the footpad, and took the first human step on the Moon.",
        'Je suis la petite plateforme et l’échelle de la jambe avant. Neil Armstrong est descendu par moi, a sauté sur le pied, et a fait le premier pas humain sur la Lune.',
      ),
      deeper: t(
        'Armstrong crawled out of the hatch onto the porch on his hands and knees, then climbed down. From the bottom rung he made a jump of about 0.9 m (3 feet) to the footpad. At 02:56:15 UT on July 21, 1969, he stepped off: "That\'s one small step for (a) man, one giant leap for mankind."',
        'Armstrong est sorti par l’écoutille à quatre pattes sur la plateforme, puis il est descendu. Depuis le dernier barreau, il a sauté environ 0,9 m (3 pieds) jusqu’au pied. Le 21 juillet 1969 à 02 h 56 min 15 s UT, il a posé le pied sur le sol : « C’est un petit pas pour l’homme, un bond de géant pour l’humanité. »',
      ),
      whyItMattered: t('Every human footprint on the Moon began here, at the bottom of a ladder.', 'Chaque empreinte humaine sur la Lune a commencé ici, au pied d’une échelle.'),
      funFact: t('Before stepping off, Armstrong checked he could jump back up to the first rung. In low gravity, it was easy.', 'Avant de descendre, Armstrong a vérifié qu’il pouvait remonter d’un saut jusqu’au premier barreau. Avec la faible gravité, c’était facile.'),
      numbers: [
        { value: '02:56:15 UT', label: t('first step, July 21, 1969', 'premier pas, 21 juillet 1969'), sourceId: 'nssdca-a11lm' },
        { value: '≈ 0.9 m', label: t('jump from the bottom rung to the footpad', 'saut du dernier barreau jusqu’au pied'), sourceId: 'alsj' },
      ],
      worksWith: ['plaque', 'landing-legs', 'equipment-bay'],
    },
    {
      id: 'plaque',
      icon: 'Frame',
      name: t('The plaque', 'La plaque'),
      meshNames: ['plaque', 'plate'],
      anchor: [3.47, 1.75, 0],
      camera: { position: [5.2, 2.4, 1.0], target: [3.43, 1.75, 0] },
      explode: [0.25, 0.1, 0],
      simple: t(
        "I'm a small metal sign on the leg behind the ladder. I'm a message for whoever visits one day: humans came here in peace.",
        'Je suis un petit panneau de métal sur la jambe derrière l’échelle. Je suis un message pour celui qui viendra un jour : des humains sont venus ici en paix.',
      ),
      deeper: t(
        'The plaque reads: "Here men from the planet Earth first set foot upon the Moon, July 1969 A.D. We came in peace for all mankind." It also shows the two halves of the Earth and the signatures of the three astronauts and the US president. The crew read it aloud on live television.',
        'La plaque dit : « Ici, des hommes de la planète Terre ont posé le pied sur la Lune pour la première fois, juillet 1969 après J.-C. Nous sommes venus en paix au nom de toute l’humanité. » Elle montre aussi les deux hémisphères de la Terre et les signatures des trois astronautes et du président des États-Unis. L’équipage l’a lue en direct à la télévision.',
      ),
      whyItMattered: t('Because I stayed on the Moon, the plaque stayed too: a message that will last for a very long time in the airless calm.', 'Comme je suis resté sur la Lune, la plaque aussi : un message qui durera très longtemps dans ce calme sans air.'),
      worksWith: ['ladder-porch', 'landing-legs'],
    },
    {
      id: 'descent-stage-body',
      icon: 'Hexagon',
      name: t('Descent stage body', 'Corps de l’étage de descente'),
      meshNames: ['descent', 'body', 'stage', 'octagon', 'foil', 'corps'],
      anchor: [1.58, 2.5, 1.58],
      camera: { position: [6.8, 4.2, 5.8], target: [0, 2.2, 0] },
      explode: [0, 0, 0],
      simple: t(
        "I'm an eight-sided box, wider than a car is long. My gold coat is not real gold bars: it's a thin foil blanket, like a space survival blanket.",
        'Je suis une boîte à huit côtés, plus large qu’une voiture n’est longue. Mon manteau doré n’est pas en lingots : c’est une fine couverture, comme une couverture de survie.',
      ),
      deeper: t(
        'The descent stage is an octagonal prism 4.2 m across and 1.7 m thick. It holds the engine in the middle, the propellant tanks around it, and storage bays in the corners. Its mass without propellant is 2,034 kg. Layers of foil insulation protected it from the harsh sunlight and the cold of space.',
        'L’étage de descente est un prisme octogonal de 4,2 m de large et 1,7 m d’épaisseur. Il porte le moteur au centre, les réservoirs autour, et des compartiments de rangement dans les coins. Sa masse sans ergols est de 2 034 kg. Des couches d’isolant en feuille le protégeaient du Soleil brûlant et du froid de l’espace.',
      ),
      whyItMattered: t('Everything needed to land, plus all the surface equipment, fitted inside this one compact box.', 'Tout ce qu’il fallait pour se poser, plus tout le matériel de surface, tenait dans cette seule boîte compacte.'),
      numbers: [
        { value: '4.2 m', label: t('across', 'de large'), sourceId: 'nssdca-a11lm' },
        { value: '1.7 m', label: t('thick', 'd’épaisseur'), sourceId: 'nssdca-a11lm' },
        { value: '2,034 kg', label: t('dry mass', 'masse à vide'), sourceId: 'nssdca-a11lm' },
      ],
      worksWith: ['propellant-tanks', 'equipment-bay', 'ascent-stage-launchpad'],
    },
    {
      id: 'propellant-tanks',
      icon: 'Fuel',
      name: t('Propellant tanks', 'Réservoirs d’ergols'),
      meshNames: ['tank', 'propellant', 'fuel', 'oxidizer', 'reservoir'],
      anchor: [-1.2, 3.42, -1.2],
      camera: { position: [-5.6, 4.6, -4.8], target: [0, 2.4, 0] },
      explode: [0, 0.3, 0],
      simple: t(
        "We are big tanks hidden inside, like a car's fuel tank. Switch on X-ray to see us! Two of us held fuel and two held the oxidizer that makes it burn.",
        'Nous sommes de grands réservoirs cachés à l’intérieur, comme le réservoir d’une voiture. Active la vue rayons X pour nous voir ! Deux d’entre nous contenaient le carburant, et deux l’oxydant qui le fait brûler.',
      ),
      deeper: t(
        'At launch the descent stage carried 8,248 kg of propellant, four times its own dry mass. The fuel and oxidizer ignite on contact, so the engine needed no spark plug. By touchdown, almost all of it had been burned.',
        'Au départ, l’étage de descente emportait 8 248 kg d’ergols, quatre fois sa propre masse à vide. Le carburant et l’oxydant s’enflamment dès qu’ils se touchent : le moteur n’avait pas besoin de bougie d’allumage. À l’atterrissage, presque tout avait été brûlé.',
      ),
      whyItMattered: t('Slowing down from orbit takes a lot of propellant. Most of my weight at launch was fuel.', 'Freiner depuis l’orbite demande beaucoup d’ergols. La plus grande partie de mon poids au départ, c’était du carburant.'),
      numbers: [
        { value: '8,248 kg', label: t('propellant at launch', 'ergols au départ'), sourceId: 'nssdca-a11lm' },
        { value: '4', label: t('main tanks (2 fuel, 2 oxidizer)', 'réservoirs principaux (2 carburant, 2 oxydant)'), sourceId: 'nssdca-a11lm', verify: true },
      ],
      worksWith: ['descent-engine', 'descent-stage-body'],
      verify: true,
    },
    {
      id: 'equipment-bay',
      icon: 'Package',
      name: t('Equipment bay (MESA)', 'Compartiment à matériel (MESA)'),
      meshNames: ['mesa', 'bay', 'stowage', 'equipment', 'quad'],
      anchor: [1.62, 2.4, -1.62],
      camera: { position: [5.6, 2.8, -4.8], target: [1.5, 2.3, -1.5] },
      explode: [0.3, 0, -0.3],
      simple: t(
        "I'm a storage cupboard folded into the side of the stage, like the trunk of a car. I held the tools, the sample boxes and the TV camera.",
        'Je suis un placard de rangement replié dans le flanc de l’étage, comme le coffre d’une voiture. Je contenais les outils, les boîtes à échantillons et la caméra de télévision.',
      ),
      deeper: t(
        'The Modular Equipment Stowage Assembly (MESA) was lowered by pulling a lanyard from the porch. Its TV camera filmed Armstrong’s first step for the world. The tools and boxes inside were used to collect 21.55 kg of lunar samples.',
        'Le MESA (« Modular Equipment Stowage Assembly ») s’ouvrait quand on tirait un cordon depuis la plateforme. Sa caméra de télévision a filmé le premier pas d’Armstrong pour le monde entier. Les outils et les boîtes rangés dedans ont servi à récolter 21,55 kg d’échantillons lunaires.',
      ),
      whyItMattered: t('Without it, there would be no live pictures of the first step, and no Moon rocks to study on Earth.', 'Sans lui, pas d’images en direct du premier pas, et pas de roches lunaires à étudier sur Terre.'),
      numbers: [{ value: '21.55 kg', label: t('of samples collected', 'd’échantillons récoltés'), sourceId: 'nssdca-a11lm' }],
      worksWith: ['ladder-porch', 'easep-seismometer', 'laser-retroreflector'],
    },
    {
      id: 'ascent-stage-launchpad',
      icon: 'Rocket',
      name: t('Launch pad for the ascent stage', 'Rampe de lancement de l’étage de remontée'),
      meshNames: ['deck', 'top', 'interstage', 'launch', 'ascent'],
      anchor: [0, 3.42, 0],
      camera: { position: [4.8, 6.8, 3.8], target: [0, 3.1, 0] },
      explode: [0, 0.5, 0],
      simple: t(
        "My roof was a launch pad. The astronauts' cabin sat here, then blasted off from me to go home. I stayed, like a booster seat left behind.",
        'Mon toit était une rampe de lancement. La cabine des astronautes était posée ici, puis elle a décollé de moi pour rentrer. Moi, je suis resté, comme un rehausseur qu’on laisse derrière soi.',
      ),
      deeper: t(
        'The ascent stage was bolted to my top deck. At 17:54:01 UT on July 21, 1969, the links were cut and its engine fired, pushing it up from my roof. Leaving the descent stage behind meant the small ascent engine only had to lift the cabin, the crew and the samples.',
        'L’étage de remontée était fixé sur mon pont supérieur. Le 21 juillet 1969 à 17 h 54 min 01 s UT, les attaches ont été coupées et son moteur s’est allumé, le poussant hors de mon toit. Laisser l’étage de descente permettait au petit moteur de remontée de ne soulever que la cabine, l’équipage et les échantillons.',
      ),
      whyItMattered: t('Splitting the lander in two was a clever trick: leave the heavy part, fly home light.', 'Couper l’atterrisseur en deux était une astuce géniale : laisser la partie lourde, rentrer léger.'),
      funFact: t('Eagle’s ascent stage was later let go in lunar orbit. Nobody knows exactly where it is today.', 'L’étage de remontée d’Eagle a ensuite été largué en orbite lunaire. Personne ne sait exactement où il se trouve aujourd’hui.'),
      numbers: [
        { value: '17:54:01 UT', label: t('lift-off, July 21, 1969', 'décollage, 21 juillet 1969'), sourceId: 'nssdca-a11lm' },
        { value: '21 h 36 min', label: t('on the Moon before lift-off', 'sur la Lune avant le décollage'), sourceId: 'nssdca-a11lm' },
      ],
      worksWith: ['descent-stage-body', 'ladder-porch'],
    },
    {
      id: 'easep-seismometer',
      icon: 'Waves',
      name: t('Seismometer (EASEP)', 'Sismomètre (EASEP)'),
      meshNames: ['easep', 'pse', 'seismometer', 'seismo'],
      anchor: [-2.6, 0.75, -4.9],
      camera: { position: [-0.6, 1.9, -8.2], target: [-2.4, 0.35, -4.6] },
      explode: [0, 0.3, 0],
      simple: t(
        "I'm a Moon ear. I listened for tiny shakes in the ground, like moonquakes or meteorites hitting the Moon. My two solar panels were my lunch.",
        'Je suis une oreille lunaire. J’écoutais les petites secousses du sol, comme les séismes lunaires ou les météorites qui frappent la Lune. Mes deux panneaux solaires étaient mon repas.',
      ),
      deeper: t(
        'The Early Apollo Scientific Experiments Package (EASEP) had a passive seismometer and a dust detector, powered by two solar panels. It weighed 48 kg and was set up about 17 m south of the lander. It sent data to Earth until it was switched off on August 27, 1969.',
        'L’EASEP (« Early Apollo Scientific Experiments Package ») comprenait un sismomètre passif et un détecteur de poussière, alimentés par deux panneaux solaires. Il pesait 48 kg et a été installé à environ 17 m au sud de l’atterrisseur. Il a envoyé des données vers la Terre jusqu’à son arrêt, le 27 août 1969.',
      ),
      whyItMattered: t('Listening to how the Moon shakes is a way to learn what is inside it, like tapping a melon to know if it is ripe.', 'Écouter comment la Lune tremble permet de savoir ce qu’il y a à l’intérieur, comme quand on tapote un melon pour savoir s’il est mûr.'),
      numbers: [
        { value: '48 kg', label: t('total mass', 'masse totale'), sourceId: 'nssdca-a11lm' },
        { value: '≈ 17 m', label: t('south of the lander', 'au sud de l’atterrisseur'), sourceId: 'nssdca-a11lm' },
        { value: '1969-08-27', label: t('switched off', 'arrêté'), sourceId: 'nssdca-a11lm' },
      ],
      worksWith: ['equipment-bay', 'laser-retroreflector'],
    },
    {
      id: 'laser-retroreflector',
      icon: 'Target',
      name: t('Laser retroreflector (LRRR)', 'Rétroréflecteur laser (LRRR)'),
      meshNames: ['lrrr', 'retro', 'reflector', 'laser', 'mirror'],
      anchor: [-2.0, 0.6, -3.4],
      camera: { position: [0.4, 1.6, -6.0], target: [-1.9, 0.3, -3.4] },
      explode: [0, 0.3, 0],
      simple: t(
        "I'm a mirror with no batteries. Shine a laser at me from Earth and I send the light straight back, like a bike reflector. I still work today!",
        'Je suis un miroir sans piles. Envoie-moi un laser depuis la Terre et je renvoie la lumière tout droit, comme un catadioptre de vélo. Je fonctionne encore aujourd’hui !',
      ),
      deeper: t(
        'The Laser Ranging Retroreflector is a panel of 100 small glass corner prisms, set up about 5 m north-northwest of the seismometer. It needs no power. Observatories time how long a laser pulse takes to come back, about 2.5 seconds, and measure the Earth–Moon distance to within a few millimetres.',
        'Le rétroréflecteur laser est un panneau de 100 petits prismes de verre en coin, installé à environ 5 m au nord-nord-ouest du sismomètre. Il n’a besoin d’aucune énergie. Des observatoires chronomètrent le temps que met une impulsion laser pour revenir, environ 2,5 secondes, et mesurent la distance Terre–Lune à quelques millimètres près.',
      ),
      whyItMattered: t('Decades of laser measurements showed that the Moon slowly moves away from Earth, that it has a fluid core, and that Einstein’s theory of gravity holds up.', 'Des décennies de mesures laser ont montré que la Lune s’éloigne lentement de la Terre, qu’elle a un noyau fluide, et que la théorie de la gravité d’Einstein tient bon.'),
      funFact: t('It is the only Apollo 11 experiment still in use today.', 'C’est la seule expérience d’Apollo 11 encore utilisée aujourd’hui.'),
      numbers: [
        { value: '≈ 5 m', label: t('north-northwest of the seismometer', 'au nord-nord-ouest du sismomètre'), sourceId: 'nssdca-a11lm' },
        { value: '100', label: t('glass corner prisms', 'prismes de verre en coin'), sourceId: 'jpl-llr', verify: true },
        { value: '≈ 3.8 cm', label: t('the Moon moves away from Earth each year', 'dont la Lune s’éloigne de la Terre chaque année'), sourceId: 'alsj', verify: true },
      ],
      worksWith: ['easep-seismometer', 'equipment-bay'],
    },
  ],
  telemetry: {
    band: t('S-band radio to NASA’s tracking stations (silent since 1969)', 'Radio en bande S vers les stations de suivi de la NASA (muette depuis 1969)'),
    power: { value: '6', label: t('silver-zinc batteries, no solar panels', 'batteries argent-zinc, sans panneaux solaires'), sourceId: 'nssdca-a11lm' },
    delay: t('About 1.3 seconds one way', 'Environ 1,3 seconde aller simple'),
    delaySeconds: 1.3,
    delayLabel: t('real time ≈ 1.3 s', 'temps réel ≈ 1,3 s'),
    lastContact: t('July 21, 1969 (lift-off of the ascent stage)', '21 juillet 1969 (décollage de l’étage de remontée)'),
    link: t('Eagle → S-band antenna → NASA tracking stations on Earth', 'Eagle → antenne bande S → stations de suivi de la NASA sur Terre'),
    replies: false,
    replyText: t(
      'Your signal reached Tranquility Base in 1.3 seconds… Eagle’s descent stage is silent: its batteries ran out long ago. But a few metres away, the laser reflector the astronauts left still bounces light back to observatories on Earth!',
      'Ton signal a atteint la base de la Tranquillité en 1,3 seconde… L’étage de descente d’Eagle est muet : ses batteries sont vides depuis longtemps. Mais à quelques mètres, le réflecteur laser laissé par les astronautes renvoie toujours la lumière vers des observatoires sur Terre !',
    ),
  },
  quiz: [
    {
      q: t('Why was the descent stage left on the Moon?', 'Pourquoi l’étage de descente a-t-il été laissé sur la Lune ?'),
      options: [
        t('It was broken', 'Il était cassé'),
        t('It served as a launch pad, and leaving it made the trip home lighter', 'Il servait de rampe de lancement, et le laisser allégeait le retour'),
        t('To make room for the rover', 'Pour faire de la place au rover'),
      ],
      answer: 1,
      explain: t('The ascent stage lifted off from its roof. Leaving the heavy legs, engine and tanks meant less weight to carry home.', 'L’étage de remontée a décollé de son toit. Laisser les jambes, le moteur et les réservoirs, c’était moins de poids à ramener.'),
    },
    {
      q: t('What told the crew that Eagle had touched the Moon?', 'Qu’est-ce qui a prévenu l’équipage qu’Eagle avait touché la Lune ?'),
      options: [
        t('A probe under a footpad switched on a "contact light"', 'Une sonde sous un pied a allumé un voyant « contact »'),
        t('A loud bang', 'Un grand bruit'),
        t('A call from Mission Control', 'Un appel du centre de contrôle'),
      ],
      answer: 0,
      explain: t('Long probes hung below three footpads. When one touched the ground, the contact light came on.', 'De longues sondes pendaient sous trois pieds. Quand l’une a touché le sol, le voyant contact s’est allumé.'),
    },
    {
      q: t('Which Apollo 11 experiment is still used today?', 'Quelle expérience d’Apollo 11 sert encore aujourd’hui ?'),
      options: [
        t('The seismometer', 'Le sismomètre'),
        t('The TV camera', 'La caméra de télévision'),
        t('The laser retroreflector', 'Le rétroréflecteur laser'),
      ],
      answer: 2,
      explain: t('It needs no power: observatories bounce lasers off it to measure the Earth–Moon distance very precisely.', 'Il n’a besoin d’aucune énergie : des observatoires y font rebondir des lasers pour mesurer très précisément la distance Terre–Lune.'),
    },
  ],
  faq: [
    {
      q: t('Why did they leave you behind?', 'Pourquoi t’ont-ils laissé là ?'),
      a: t('On purpose! My roof was the launch pad for the ascent stage. Leaving me, with my heavy legs and empty tanks, made the trip back to orbit much lighter.', 'Exprès ! Mon toit était la rampe de lancement de l’étage de remontée. Me laisser, avec mes lourdes jambes et mes réservoirs vides, rendait le retour en orbite bien plus léger.'),
      keywords: ['why', 'left', 'leave', 'behind', 'pourquoi', 'laisse', 'abandon', 'reste', 'launch', 'decollage'],
    },
    {
      q: t('Does anything still work at Tranquility Base?', 'Est-ce que quelque chose fonctionne encore à la base de la Tranquillité ?'),
      a: t('Yes: the laser retroreflector. It has no batteries. Observatories on Earth fire lasers at it and time the echo to measure how far away the Moon is.', 'Oui : le rétroréflecteur laser. Il n’a pas de piles. Des observatoires sur Terre lui envoient des lasers et chronomètrent l’écho pour mesurer la distance de la Lune.'),
      keywords: ['work', 'still', 'laser', 'mirror', 'reflector', 'marche', 'fonctionne', 'encore', 'miroir', 'reflecteur'],
    },
    {
      q: t('What does your plaque say?', 'Que dit ta plaque ?'),
      a: t('"Here men from the planet Earth first set foot upon the Moon, July 1969 A.D. We came in peace for all mankind." It is on the leg behind my ladder.', '« Ici, des hommes de la planète Terre ont posé le pied sur la Lune pour la première fois, juillet 1969 après J.-C. Nous sommes venus en paix au nom de toute l’humanité. » Elle est sur la jambe derrière mon échelle.'),
      keywords: ['plaque', 'sign', 'message', 'peace', 'panneau', 'paix', 'inscription', 'say', 'dit'],
    },
  ],
  audio: {
    story: { en: 'audio/apollo11lm_en.mp3', fr: 'audio/apollo11lm_fr.mp3' },
    transcript: t(
      'Once upon a time, a golden spacecraft with spider legs flew down toward the Moon. Its name was Eagle. Inside, two astronauts held their breath. Alarms blinked, boulders appeared, and the fuel was running low. Neil steered past the rocks, and a long probe touched the dust. Contact light! The Eagle had landed. Neil climbed down the ladder and took one small step. The two explorers gathered rocks, set up a seismometer and a little laser mirror. The next day, the top of Eagle blasted off and flew them home. The bottom half stayed behind, standing guard with its plaque: we came in peace. And every night, laser light from Earth still visits the mirror beside it.',
      'Il était une fois un vaisseau doré aux pattes d’araignée qui descendait vers la Lune. Il s’appelait Eagle. À l’intérieur, deux astronautes retenaient leur souffle. Des alarmes clignotaient, des rochers apparaissaient, et le carburant baissait. Neil a contourné les rochers, et une longue sonde a touché la poussière. Contact ! Eagle s’était posé. Neil est descendu par l’échelle et a fait un petit pas. Les deux explorateurs ont ramassé des roches, installé un sismomètre et un petit miroir laser. Le lendemain, le haut d’Eagle a décollé pour les ramener. La moitié du bas est restée, à monter la garde avec sa plaque : nous sommes venus en paix. Et chaque nuit, la lumière d’un laser venu de la Terre rend encore visite au miroir posé à côté.',
    ),
  },
  model: {
    glb: 'models/apollo11lm.glb',
    scale: 1,
    overlay: ['propellant-tanks', 'easep-seismometer', 'laser-retroreflector'],
    defaultCamera: { position: [7.5, 5.4, 11.5], target: [0, 1.4, -1.0] },
    env: { clearRadius: 6, tracks: false, landerSilhouette: false },
  },
  lesson: {
    ideas: [
      t('Engineering trade-offs: why splitting a lander in two and leaving half behind saves fuel.', 'Compromis d’ingénierie : pourquoi couper un atterrisseur en deux et en laisser la moitié économise du carburant.'),
      t('The speed of light: a laser pulse takes about 2.5 s to reach the Moon and come back.', 'La vitesse de la lumière : une impulsion laser met environ 2,5 s pour aller sur la Lune et revenir.'),
      t('Messages across time: what the plaque says about the people who wrote it.', 'Des messages à travers le temps : ce que la plaque dit de ceux qui l’ont écrite.'),
    ],
    activity: t(
      '15 min — "Laser to the Moon": in pairs, one student is Earth and one is the Moon reflector, 10 steps apart. Earth "fires" a ball, the Moon sends it straight back; a third student times the round trip. Then compute: light travels about 300,000 km per second and takes about 2.5 s for the round trip, so how far away is the Moon? (≈ 375,000 km.) Discuss why a mirror with no batteries can work for more than 50 years.',
      '15 min — « Un laser vers la Lune » : par deux, un élève joue la Terre et l’autre le réflecteur lunaire, à 10 pas l’un de l’autre. La Terre « tire » une balle, la Lune la renvoie tout droit ; un troisième élève chronomètre l’aller-retour. Puis calculez : la lumière parcourt environ 300 000 km par seconde et met environ 2,5 s pour l’aller-retour ; à quelle distance est la Lune ? (≈ 375 000 km.) Discutez : pourquoi un miroir sans piles peut-il fonctionner plus de 50 ans ?',
    ),
  },
  sources: ['nssdca-a11lm', 'alsj', 'nssdca', 'jpl-llr', 'nasa-a11-plaque'],
};
