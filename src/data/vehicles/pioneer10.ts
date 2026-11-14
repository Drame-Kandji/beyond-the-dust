/**
 * Pioneer 10 — content drafted with AI assistance from NASA Science / NASA Ames pages.
 * `verify: true` = to be checked by the team (FACT_CHECK.md).
 * Coordinates: metres. The dish opens toward +z (toward Earth), magnetometer boom along +y.
 */
import type { Vehicle } from '../types';

const t = (en: string, fr: string) => ({ en, fr });

export const pioneer10: Vehicle = {
  id: 'pioneer10',
  destination: 'deep-space',
  name: t('Pioneer 10', 'Pioneer 10'),
  category: t('Nuclear-powered deep-space probe', 'Sonde spatiale à énergie nucléaire'),
  status: t('Drifting toward Aldebaran, silent since 2003', 'Dérive vers Aldebaran, silencieuse depuis 2003'),
  hook: t('It left for 21 months and spoke for 31 years.', 'Elle est partie pour 21 mois et a parlé pendant 31 ans.'),
  location: t('Beyond the planets, heading toward Taurus', 'Au-delà des planètes, en route vers le Taureau'),
  teleportText: t('Teleporting to deep space, 12 billion km from Earth…', 'Téléportation vers l’espace lointain, à 12 milliards de km…'),
  loadingText: t('Warming up the RTGs…', 'Réchauffage des générateurs RTG…'),
  intro: t(
    "Hello from very far away. I'm Pioneer 10. I left Earth in 1972. I'm still travelling, but you can't hear me anymore. Touch my parts and listen to my story.",
    'Bonjour de très loin. Je suis Pioneer 10. J’ai quitté la Terre en 1972. Je voyage encore, mais tu ne peux plus m’entendre. Touche mes pièces et écoute mon histoire.',
  ),
  twin: {
    name: t('My sister: Pioneer 11', 'Ma sœur : Pioneer 11'),
    summary: t(
      'Pioneer 11 followed me in 1973. She flew past Jupiter in 1974, then became the first spacecraft to visit Saturn, on September 1, 1979. She sent her last transmission in 1995.',
      'Pioneer 11 m’a suivie en 1973. Elle a survolé Jupiter en 1974, puis est devenue le premier vaisseau à visiter Saturne, le 1er septembre 1979. Elle a envoyé sa dernière transmission en 1995.',
    ),
    facts: [
      { value: '1979-09-01', label: t('first flyby of Saturn', 'premier survol de Saturne'), sourceId: 'nasa-pioneer11' },
      { value: '1995', label: t('last transmission', 'dernière transmission'), sourceId: 'nasa-pioneer11' },
    ],
  },
  keyDates: [
    { date: '1972-03-03', kind: 'launch', label: t('Launch on an Atlas-Centaur (March 2 local Florida time)', 'Lancement sur Atlas-Centaur (2 mars heure de Floride)'), sourceId: 'nasa-pioneer10' },
    { date: '1972-07-15', kind: 'feat', label: t('First spacecraft to enter the asteroid belt', 'Premier vaisseau à entrer dans la ceinture d’astéroïdes'), sourceId: 'nasa-pioneer10' },
    { date: '1973-12-04', kind: 'feat', label: t('First flyby of Jupiter (Dec 3 US time)', 'Premier survol de Jupiter (3 déc. heure des États-Unis)'), sourceId: 'nasa-pioneer10' },
    { date: '1983-06-13', kind: 'feat', label: t('Crosses the orbit of Neptune', 'Franchit l’orbite de Neptune'), sourceId: 'nasa-pioneer10' },
    { date: '1997-03-31', kind: 'trouble', label: t('Routine science mission ends', 'Fin de la mission scientifique de routine'), sourceId: 'nasa-pioneer10' },
    { date: '2003-01-23', kind: 'end', label: t('Last signal received, ≈ 12 billion km away', 'Dernier signal reçu, à ≈ 12 milliards de km'), sourceId: 'nasa-pioneer10' },
    { date: '2006-03-04', kind: 'end', label: t('Last attempt to contact: no answer', 'Dernière tentative de contact : pas de réponse'), sourceId: 'nasa-pioneer10' },
    { date: '2026-11-15', kind: 'today', label: t('Still drifting toward Aldebaran', 'Dérive toujours vers Aldebaran'), sourceId: 'nasa-pioneer10' },
  ],
  stats: [
    { value: '21', label: t('months planned', 'mois prévus'), sourceId: 'nasa-pioneer10' },
    { value: '31', label: t('years of talking to Earth', 'années à parler à la Terre'), sourceId: 'nasa-pioneer10' },
    { value: '258 kg', label: t('launch mass', 'masse au lancement'), sourceId: 'nasa-pioneer10' },
    { value: '2.74 m', label: t('dish antenna', 'antenne parabolique'), sourceId: 'nasa-pioneer10' },
    { value: '11 h 20 min', label: t('for its last signal to reach Earth', 'pour que son dernier signal atteigne la Terre'), sourceId: 'nasa-pioneer10' },
  ],
  chapters: [
    {
      id: 'who',
      title: t('Who am I?', 'Qui suis-je ?'),
      lead: t('Humanity’s first messenger to the giant planets.', 'La première messagère de l’humanité vers les planètes géantes.'),
      body: t(
        'I am a small probe of about 258 kg with a big dish antenna, 2.74 metres wide. I have no solar panels. Instead, four nuclear generators sit at the end of long arms.',
        'Je suis une petite sonde d’environ 258 kg avec une grande antenne parabolique de 2,74 mètres. Je n’ai pas de panneaux solaires. À la place, quatre générateurs nucléaires sont fixés au bout de longs bras.',
      ),
    },
    {
      id: 'why',
      title: t('Why was I sent?', 'Pourquoi m’a-t-on envoyée ?'),
      lead: t('Nobody had ever gone that far.', 'Personne n’était jamais allé aussi loin.'),
      body: t(
        'Before me, no spacecraft had crossed the asteroid belt or visited Jupiter. Scientists did not know if the belt was too dangerous, or how strong Jupiter’s radiation was. I was sent to find out, and to open the road for others.',
        'Avant moi, aucun vaisseau n’avait traversé la ceinture d’astéroïdes ni visité Jupiter. On ne savait pas si la ceinture était trop dangereuse, ni à quel point les radiations de Jupiter étaient fortes. J’ai été envoyée pour le découvrir, et ouvrir la route aux autres.',
      ),
    },
    {
      id: 'how',
      title: t('How I worked', 'Comment je fonctionnais'),
      lead: t('Spinning, listening, whispering home.', 'Tourner, écouter, murmurer vers la Terre.'),
      body: t(
        'I spun slowly to stay stable, like a spinning top. My dish always pointed toward Earth. My nuclear generators turned heat into electricity, and my instruments measured particles, magnetic fields and light.',
        'Je tournais lentement sur moi-même pour rester stable, comme une toupie. Mon antenne visait toujours la Terre. Mes générateurs nucléaires transformaient la chaleur en électricité, et mes instruments mesuraient les particules, les champs magnétiques et la lumière.',
      ),
      sceneAction: 'focus-part',
      focusPart: 'rtg',
    },
    {
      id: 'hardest',
      title: t('My hardest moment', 'Mon moment le plus difficile'),
      lead: t('Jupiter’s invisible storm.', 'La tempête invisible de Jupiter.'),
      body: t(
        'Near Jupiter, the radiation was much stronger than expected. It disturbed some of my instruments and even caused false commands. I survived, and the measurements I made helped engineers build tougher spacecraft afterwards.',
        'Près de Jupiter, les radiations étaient bien plus fortes que prévu. Elles ont perturbé certains de mes instruments et provoqué de fausses commandes. J’ai survécu, et mes mesures ont aidé les ingénieurs à construire des vaisseaux plus résistants ensuite.',
      ),
    },
    {
      id: 'discovered',
      title: t('What I discovered', 'Ce que j’ai découvert'),
      lead: t('The first close-up of a giant.', 'Le premier portrait rapproché d’un géant.'),
      body: t(
        'I took the first close-up pictures of Jupiter and measured its huge magnetic field and radiation belts. I showed that the asteroid belt could be crossed safely. Then I became the first human-made object to pass the orbit of Neptune, in 1983.',
        'J’ai pris les premières images rapprochées de Jupiter et mesuré son immense champ magnétique et ses ceintures de radiations. J’ai montré qu’on pouvait traverser la ceinture d’astéroïdes sans danger. Puis je suis devenue le premier objet humain à dépasser l’orbite de Neptune, en 1983.',
      ),
    },
    {
      id: 'last-day',
      title: t('My last day', 'Mon dernier jour'),
      lead: t('My voice faded, little by little.', 'Ma voix s’est éteinte, petit à petit.'),
      body: t(
        'My nuclear generators made a little less power every year. On January 23, 2003, Earth heard my last, very faint signal. It had travelled for about 11 hours and 20 minutes. When scientists tried again in 2006, there was only silence.',
        'Mes générateurs produisaient un peu moins d’énergie chaque année. Le 23 janvier 2003, la Terre a entendu mon dernier signal, très faible. Il avait voyagé environ 11 heures et 20 minutes. Quand les scientifiques ont réessayé en 2006, il n’y avait plus que le silence.',
      ),
    },
    {
      id: 'today',
      title: t('Where I am today', 'Où je suis aujourd’hui'),
      lead: t('Carrying a message for whoever finds me.', 'Je porte un message pour qui me trouvera.'),
      body: t(
        'I am drifting toward the star Aldebaran, in the constellation Taurus. At my speed, it would take me about 2 million years to get there. I carry a small engraved plaque that shows who sent me and where Earth is.',
        'Je dérive vers l’étoile Aldebaran, dans la constellation du Taureau. À ma vitesse, il me faudrait environ 2 millions d’années pour y arriver. Je porte une petite plaque gravée qui montre qui m’a envoyée et où se trouve la Terre.',
      ),
      sceneAction: 'plaque',
    },
  ],
  parts: [
    {
      id: 'high-gain-antenna',
      icon: 'Satellite',
      name: t('High-gain dish antenna', 'Antenne parabolique grand gain'),
      meshNames: ['dish', 'antenna', 'antenne', 'hga', 'parab'],
      anchor: [1.0, 0.95, 0.4],
      camera: { position: [3.2, 2.2, 5.4], target: [0, 0.2, 0.2] },
      explode: [0, 0, 0.7],
      simple: t(
        "I'm a giant ear and mouth, 2.74 m wide. I always pointed toward Earth to whisper my data across billions of kilometres.",
        'Je suis une oreille et une bouche géantes, de 2,74 m de large. Je visais toujours la Terre pour murmurer mes données à travers des milliards de kilomètres.',
      ),
      deeper: t(
        'A parabolic dish concentrates radio waves into a narrow beam, like a flashlight reflector concentrates light. On Earth, the giant antennas of the Deep Space Network caught the faint signal.',
        'Une antenne parabolique concentre les ondes radio en un faisceau étroit, comme le réflecteur d’une lampe torche concentre la lumière. Sur Terre, les grandes antennes du Deep Space Network captaient ce signal très faible.',
      ),
      whyItMattered: t('Every discovery Pioneer 10 made reached us through this dish.', 'Chaque découverte de Pioneer 10 nous est parvenue grâce à cette antenne.'),
      numbers: [{ value: '2.74 m', label: t('diameter', 'diamètre'), sourceId: 'nasa-pioneer10' }],
      worksWith: ['rtg', 'main-body', 'thrusters'],
    },
    {
      id: 'rtg',
      icon: 'Atom',
      name: t('Nuclear generators (RTGs)', 'Générateurs nucléaires (RTG)'),
      meshNames: ['rtg', 'generator', 'nuclear'],
      anchor: [-2.35, -1.25, -0.2],
      camera: { position: [-4.6, -0.4, 3.2], target: [-1.8, -1.0, -0.2] },
      explode: [-0.4, -0.3, 0],
      simple: t(
        'Far from the Sun, solar panels get too little light. So we make electricity from the heat of a radioactive material, like a warm battery that lasts for decades. We sit on long arms to keep our radiation away from the instruments.',
        'Loin du Soleil, les panneaux solaires reçoivent trop peu de lumière. Alors nous fabriquons de l’électricité à partir de la chaleur d’une matière radioactive, comme une pile chaude qui dure des dizaines d’années. Nous sommes au bout de longs bras pour éloigner nos radiations des instruments.',
      ),
      deeper: t(
        'Radioisotope thermoelectric generators (RTGs) contain plutonium that naturally gives off heat as it decays. Thermocouples turn that heat directly into electricity, with no moving parts. Their power slowly decreases over the years.',
        'Les générateurs thermoélectriques à radio-isotopes (RTG) contiennent du plutonium qui dégage naturellement de la chaleur en se désintégrant. Des thermocouples transforment directement cette chaleur en électricité, sans pièce mobile. Leur puissance baisse lentement au fil des années.',
      ),
      whyItMattered: t('Pioneer 10 was the first spacecraft to rely on nuclear power alone. When the RTG power grew too weak for the transmitter, it fell silent.', 'Pioneer 10 fut le premier vaisseau à fonctionner uniquement à l’énergie nucléaire. Quand la puissance des RTG est devenue trop faible pour l’émetteur, elle s’est tue.'),
      numbers: [{ value: '4', label: t('RTGs on 2 booms', 'RTG sur 2 bras'), sourceId: 'nasa-pioneer10' }],
      worksWith: ['high-gain-antenna', 'main-body'],
    },
    {
      id: 'magnetometer-boom',
      icon: 'Magnet',
      name: t('Magnetometer boom', 'Bras du magnétomètre'),
      meshNames: ['magnet', 'boom_mag', 'magboom'],
      anchor: [0, 5.2, -0.2],
      camera: { position: [3.5, 6.0, 4.0], target: [0, 4.6, -0.2] },
      explode: [0, 0.6, 0],
      simple: t(
        "I'm a very long, thin arm with a sensor at the end. I measured invisible magnetic fields, far from the spacecraft’s own electronics.",
        'Je suis un bras très long et très fin avec un capteur au bout. Je mesurais les champs magnétiques invisibles, loin de l’électronique du vaisseau.',
      ),
      deeper: t(
        'A magnetometer is a super-sensitive compass. Placing it on a long boom keeps it away from magnetic "noise" made by the spacecraft itself.',
        'Un magnétomètre est une boussole ultra-sensible. Le placer au bout d’un long bras l’éloigne du « bruit » magnétique produit par le vaisseau lui-même.',
      ),
      whyItMattered: t('It mapped Jupiter’s enormous magnetic field for the first time.', 'Il a cartographié pour la première fois l’immense champ magnétique de Jupiter.'),
      numbers: [{ value: '≈ 6.6 m', label: t('boom length', 'longueur du bras'), sourceId: 'nasa-pioneer10' }],
      worksWith: ['particle-detectors'],
    },
    {
      id: 'imaging-photopolarimeter',
      icon: 'Aperture',
      name: t('Imaging photopolarimeter', 'Photopolarimètre imageur'),
      meshNames: ['ipp', 'photopol', 'imaging', 'camera'],
      anchor: [0.55, -0.15, -0.35],
      camera: { position: [2.4, -0.6, -2.0], target: [0.4, -0.1, -0.3] },
      explode: [0.4, 0, -0.2],
      simple: t(
        "I'm a camera that scanned Jupiter line by line while the spacecraft spun, to build the first close-up pictures.",
        'Je suis une caméra qui balayait Jupiter ligne par ligne pendant que le vaisseau tournait, pour construire les premières images rapprochées.',
      ),
      deeper: t(
        'Instead of taking a snapshot, this instrument measured light along one thin strip at a time as Pioneer rotated. Computers on Earth assembled the strips into images in red and blue light.',
        'Au lieu de prendre une photo d’un coup, cet instrument mesurait la lumière bande par bande pendant que Pioneer tournait. Les ordinateurs sur Terre assemblaient ces bandes en images en lumière rouge et bleue.',
      ),
      whyItMattered: t('Humanity saw the clouds and storms of Jupiter up close for the very first time.', 'L’humanité a vu de près, pour la toute première fois, les nuages et les tempêtes de Jupiter.'),
      worksWith: ['main-body'],
    },
    {
      id: 'particle-detectors',
      icon: 'Sparkles',
      name: t('Particle & cosmic-ray detectors', 'Détecteurs de particules et de rayons cosmiques'),
      meshNames: ['particle', 'cosmic', 'detector', 'geiger', 'radiation'],
      anchor: [-0.55, -0.25, -0.35],
      camera: { position: [-2.4, -0.4, -2.0], target: [-0.4, -0.1, -0.3] },
      explode: [-0.4, 0, -0.2],
      simple: t(
        'We count invisible particles flying through space. We discovered how strong Jupiter’s radiation really is.',
        'Nous comptons les particules invisibles qui volent dans l’espace. Nous avons découvert à quel point les radiations de Jupiter sont fortes.',
      ),
      deeper: t(
        'Several instruments measured charged particles from the Sun (the solar wind), particles trapped around Jupiter and cosmic rays coming from far across the galaxy.',
        'Plusieurs instruments mesuraient les particules chargées venues du Soleil (le vent solaire), les particules piégées autour de Jupiter et les rayons cosmiques venus de loin dans la galaxie.',
      ),
      whyItMattered: t('Knowing the radiation near Jupiter helped design every spacecraft that followed, like Voyager.', 'Connaître les radiations près de Jupiter a aidé à concevoir tous les vaisseaux suivants, comme Voyager.'),
      worksWith: ['magnetometer-boom'],
    },
    {
      id: 'meteoroid-detectors',
      icon: 'Shield',
      name: t('Meteoroid detectors', 'Détecteurs de météoroïdes'),
      meshNames: ['meteor', 'dust', 'asteroid'],
      anchor: [0.9, -0.55, -0.15],
      camera: { position: [2.2, -2.2, -2.6], target: [0.4, -0.4, -0.1] },
      explode: [0, 0, -0.45],
      simple: t(
        'We listened for tiny dust grains hitting the spacecraft while it crossed the asteroid belt. Good news: the belt was much safer than people feared.',
        'Nous guettions les minuscules grains de poussière qui frappaient le vaisseau dans la ceinture d’astéroïdes. Bonne nouvelle : la ceinture était bien moins dangereuse que prévu.',
      ),
      deeper: t(
        'Pressurised panels on the back of the dish would leak a little gas when punctured by a tiny particle, which counted each impact.',
        'Des panneaux pressurisés à l’arrière de l’antenne perdaient un peu de gaz lorsqu’une minuscule particule les perçait, ce qui permettait de compter chaque impact.',
      ),
      whyItMattered: t('It proved that spacecraft could cross the asteroid belt, opening the way to the outer planets.', 'Ils ont prouvé que les vaisseaux pouvaient traverser la ceinture d’astéroïdes, ouvrant la route vers les planètes lointaines.'),
      worksWith: ['high-gain-antenna'],
    },
    {
      id: 'plaque',
      icon: 'Mail',
      name: t('The Pioneer plaque', 'La plaque de Pioneer'),
      meshNames: ['plaque', 'plate'],
      anchor: [0.45, 0.55, -0.2],
      camera: { position: [1.8, 1.4, -1.6], target: [0.4, 0.4, -0.2] },
      explode: [0.3, 0.3, -0.3],
      simple: t(
        'Scientists fixed an engraved message on me, in case someone ever finds me. It shows two humans, our Sun and its planets, and a map to find Earth.',
        'Les scientifiques ont fixé sur moi un message gravé, au cas où quelqu’un me trouverait un jour. Il montre deux humains, notre Soleil et ses planètes, et une carte pour trouver la Terre.',
      ),
      deeper: t(
        'The gold-anodised aluminium plaque, designed notably by Carl Sagan and Frank Drake, uses science as a universal language: a hydrogen atom as a unit of measure, and the position of the Sun relative to 14 pulsars.',
        'La plaque en aluminium anodisé or, conçue notamment par Carl Sagan et Frank Drake, utilise la science comme langage universel : un atome d’hydrogène comme unité de mesure, et la position du Soleil par rapport à 14 pulsars.',
      ),
      whyItMattered: t('It is one of humanity’s first messages sent beyond the Solar System.', 'C’est l’un des premiers messages de l’humanité envoyés au-delà du Système solaire.'),
      funFact: t('Tap "Open the plaque" to explore it piece by piece.', 'Appuie sur « Ouvrir la plaque » pour l’explorer morceau par morceau.'),
      numbers: [{ value: '≈ 15 × 23 cm', label: t('plaque size', 'taille de la plaque'), sourceId: 'nasa-pioneer10' }],
      worksWith: ['main-body'],
      event: 'plaque',
    },
    {
      id: 'main-body',
      icon: 'Hexagon',
      name: t('Main body', 'Corps principal'),
      meshNames: ['body', 'bus', 'hex', 'main'],
      anchor: [0, -0.1, -0.55],
      camera: { position: [0.8, 0.6, -3.4], target: [0, 0, -0.2] },
      explode: [0, 0, -0.35],
      simple: t(
        'My six-sided box holds the radio, the computer brain and the instruments. I spin slowly to stay stable, like a spinning top.',
        'Ma boîte à six côtés contient la radio, le cerveau électronique et les instruments. Je tourne lentement pour rester stable, comme une toupie.',
      ),
      deeper: t(
        'The hexagonal equipment compartment sat behind the dish. Spin stabilisation keeps a spacecraft pointing in a steady direction without using much fuel.',
        'Le compartiment hexagonal des équipements se trouvait derrière l’antenne. La stabilisation par rotation garde un vaisseau orienté de façon stable sans utiliser beaucoup de carburant.',
      ),
      whyItMattered: t('A simple, robust design is what let Pioneer 10 keep working for decades beyond its plan.', 'Une conception simple et robuste a permis à Pioneer 10 de fonctionner des décennies au-delà du prévu.'),
      worksWith: ['high-gain-antenna', 'rtg', 'thrusters'],
    },
    {
      id: 'thrusters',
      icon: 'Wind',
      name: t('Thrusters', 'Propulseurs'),
      meshNames: ['thruster', 'jet', 'propuls'],
      anchor: [-1.35, 0.35, 0.5],
      camera: { position: [-3.4, 1.4, 2.8], target: [-1.2, 0.3, 0.4] },
      explode: [-0.3, 0, 0.2],
      simple: t(
        'We are small gas jets. A short puff turned the spacecraft so the antenna kept pointing at Earth.',
        'Nous sommes de petits jets de gaz. Une courte bouffée tournait le vaisseau pour que l’antenne vise toujours la Terre.',
      ),
      deeper: t(
        'Small thrusters near the rim of the dish adjusted the spin rate, the pointing and the trajectory with short pulses.',
        'De petits propulseurs près du bord de l’antenne ajustaient la vitesse de rotation, l’orientation et la trajectoire par de courtes impulsions.',
      ),
      whyItMattered: t('As Earth moved around the Sun, Pioneer had to keep turning to face it, or its voice would be lost.', 'Comme la Terre tourne autour du Soleil, Pioneer devait sans cesse se réorienter vers elle, sinon sa voix se perdait.'),
      worksWith: ['high-gain-antenna', 'main-body'],
    },
  ],
  telemetry: {
    band: t('S-band radio to NASA’s Deep Space Network', 'Radio bande S vers le Deep Space Network de la NASA'),
    power: { value: '8 W', label: t('transmitter power (about a night light)', 'puissance de l’émetteur (environ une veilleuse)'), sourceId: 'nasa-pioneer10' },
    delay: t('≈ 11 h 20 min one way at its last contact (2003)', '≈ 11 h 20 min aller simple lors du dernier contact (2003)'),
    delaySeconds: 11 * 3600 + 20 * 60,
    delayLabel: t('11 h 20 min — sped up', '11 h 20 min — accéléré'),
    lastContact: t('January 23, 2003', '23 janvier 2003'),
    link: t('Pioneer dish → Deep Space Network antennas → Earth', 'Antenne de Pioneer → antennes du Deep Space Network → Terre'),
    replies: false,
    replyText: t(
      'Your message left Earth… and travelled into the dark. No answer came back. Pioneer 10’s last signal reached Earth on January 23, 2003.',
      'Ton message a quitté la Terre… et a voyagé dans le noir. Aucune réponse n’est revenue. Le dernier signal de Pioneer 10 a atteint la Terre le 23 janvier 2003.',
    ),
  },
  quiz: [
    {
      q: t('Why didn’t Pioneer 10 use solar panels?', 'Pourquoi Pioneer 10 n’utilisait-elle pas de panneaux solaires ?'),
      options: [t('They were too expensive', 'C’était trop cher'), t('Far from the Sun, there is too little sunlight', 'Loin du Soleil, il y a trop peu de lumière'), t('They were forgotten', 'On les a oubliés')],
      answer: 1,
      explain: t('Near Jupiter, sunlight is about 27 times weaker than at Earth, so it used nuclear RTGs.', 'Près de Jupiter, la lumière est environ 27 fois plus faible que sur Terre : la sonde utilisait des RTG nucléaires.'),
    },
    {
      q: t('Which giant planet did it fly past first?', 'Quelle planète géante a-t-elle survolée en premier ?'),
      options: [t('Saturn', 'Saturne'), t('Jupiter', 'Jupiter'), t('Neptune', 'Neptune')],
      answer: 1,
      explain: t('In December 1973, Pioneer 10 made the first-ever flyby of Jupiter.', 'En décembre 1973, Pioneer 10 a réalisé le tout premier survol de Jupiter.'),
    },
    {
      q: t('What message does it carry?', 'Quel message transporte-t-elle ?'),
      options: [t('A USB stick', 'Une clé USB'), t('An engraved plaque showing humans and where Earth is', 'Une plaque gravée montrant des humains et où est la Terre'), t('A letter in English', 'Une lettre en anglais')],
      answer: 1,
      explain: t('The plaque uses science, like a hydrogen atom and a pulsar map, as a universal language.', 'La plaque utilise la science, comme un atome d’hydrogène et une carte de pulsars, comme langage universel.'),
    },
  ],
  faq: [
    {
      q: t('How did you get power?', 'D’où venait ton énergie ?'),
      a: t('From four nuclear generators called RTGs. They turn the heat of radioactive plutonium into electricity, because sunlight is too weak so far from the Sun.', 'De quatre générateurs nucléaires appelés RTG. Ils transforment la chaleur du plutonium radioactif en électricité, car la lumière du Soleil est trop faible si loin.'),
      keywords: ['power', 'energy', 'rtg', 'nuclear', 'energie', 'nucleaire'],
    },
    {
      q: t('Why can’t we hear you anymore?', 'Pourquoi ne peut-on plus t’entendre ?'),
      a: t('My generators made less power every year. In 2003, there was not enough left for my radio. My last signal arrived on January 23, 2003.', 'Mes générateurs produisaient moins d’énergie chaque année. En 2003, il n’en restait plus assez pour ma radio. Mon dernier signal est arrivé le 23 janvier 2003.'),
      keywords: ['hear', 'silent', 'stop', 'why', 'entendre', 'silence', 'pourquoi'],
    },
    {
      q: t('Where are you going?', 'Où vas-tu ?'),
      a: t('Toward the star Aldebaran, in Taurus. I would need about 2 million years to get there.', 'Vers l’étoile Aldebaran, dans le Taureau. Il me faudrait environ 2 millions d’années pour y arriver.'),
      keywords: ['where', 'going', 'aldebaran', 'ou', 'vas'],
    },
  ],
  audio: {
    story: { en: 'audio/pioneer10_en.mp3', fr: 'audio/pioneer10_fr.mp3' },
    transcript: t(
      'Once upon a time, in 1972, a small probe with a big ear left Earth. Her name was Pioneer 10. She was supposed to travel for twenty-one months. She crossed the asteroid belt, where no one had gone before, and flew past giant Jupiter, taking its very first close-up portraits. She had no solar panels, because so far from the Sun the light is too weak. Instead, she carried warm nuclear hearts. Year after year, she whispered to Earth, a little more softly each time. After thirty-one years, her voice faded away. But she is still travelling, toward a red star called Aldebaran, carrying a drawing of us, and a map to find our home.',
      'Il était une fois, en 1972, une petite sonde avec une grande oreille qui quitta la Terre. Elle s’appelait Pioneer 10. Elle devait voyager vingt et un mois. Elle traversa la ceinture d’astéroïdes, où personne n’était allé, et passa près de la géante Jupiter, dont elle prit les tout premiers portraits rapprochés. Elle n’avait pas de panneaux solaires, car si loin du Soleil la lumière est trop faible. À la place, elle portait des cœurs nucléaires tout chauds. Année après année, elle murmurait à la Terre, un peu plus doucement chaque fois. Après trente et un ans, sa voix s’est éteinte. Mais elle voyage encore, vers une étoile rouge appelée Aldebaran, avec un dessin de nous et une carte pour trouver notre maison.',
    ),
  },
  model: { glb: 'models/pioneer10.glb', scale: 1, defaultCamera: { position: [6.2, 3.0, 8.2], target: [0, 1.2, 0] } },
  sources: ['nasa-pioneer10', 'nasa-pioneer11', 'nssdca'],
};
