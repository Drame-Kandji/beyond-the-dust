/**
 * Lunar Roving Vehicle, content drafted with AI assistance from NASA NSSDCA
 * and the Apollo Lunar Surface Journal. `verify: true` = to be checked by the team (FACT_CHECK.md).
 * Coordinates: metres, +x = front of the rover, +y = up.
 */
import type { Vehicle } from '../types';

const t = (en: string, fr: string) => ({ en, fr });

export const lrv: Vehicle = {
  id: 'lrv',
  destination: 'moon',
  name: t('Lunar Roving Vehicle', 'Rover lunaire (LRV)'),
  category: t('Astronaut-driven Moon car', 'Voiture lunaire conduite par des astronautes'),
  status: t('Parked on the Moon since 1971-1972', 'Garé sur la Lune depuis 1971-1972'),
  hook: t('They came by rocket. They left by rocket. The car stayed behind.', 'Ils sont venus en fusée. Ils sont repartis en fusée. La voiture est restée.'),
  location: t('Hadley-Apennine, the Moon (Apollo 15)', 'Hadley-Apennin, la Lune (Apollo 15)'),
  teleportText: t('Teleporting to Hadley-Apennine, the Moon…', 'Téléportation vers Hadley-Apennin, sur la Lune…'),
  loadingText: t('Unfolding the rover…', 'Dépliage du rover…'),
  intro: t(
    "Hello, explorer. I'm one of three cars that astronauts drove on the Moon. They flew home. I stayed. Touch any part of me and I'll tell you what it did.",
    "Bonjour, explorateur. Je suis l'une des trois voitures que des astronautes ont conduites sur la Lune. Eux sont rentrés. Moi, je suis resté. Touche une de mes pièces et je te dirai à quoi elle servait.",
  ),
  twin: {
    name: t('My two siblings: Apollo 16 and Apollo 17 rovers', 'Mes deux frères : les rovers d’Apollo 16 et 17'),
    summary: t(
      'Three rovers were driven on the Moon, and all three are still there: at Hadley-Apennine (Apollo 15), in the Descartes highlands (Apollo 16) and in the Taurus-Littrow valley (Apollo 17).',
      'Trois rovers ont roulé sur la Lune, et les trois y sont toujours : à Hadley-Apennin (Apollo 15), dans les hauts plateaux de Descartes (Apollo 16) et dans la vallée de Taurus-Littrow (Apollo 17).',
    ),
    facts: [
      { value: '≈ 27 km', label: t('driven on Apollo 16', 'parcourus pendant Apollo 16'), sourceId: 'alsj' },
      { value: '≈ 36 km', label: t('driven on Apollo 17, the Apollo record', 'parcourus pendant Apollo 17, le record d’Apollo'), sourceId: 'alsj' },
    ],
  },
  keyDates: [
    { date: '1971-07-26', kind: 'launch', label: t('Apollo 15 launches, rover folded inside the lunar module', 'Lancement d’Apollo 15, rover replié dans le module lunaire'), sourceId: 'nssdca-lrv' },
    { date: '1971-07-30', kind: 'feat', label: t('Landing at Hadley-Apennine', 'Alunissage à Hadley-Apennin'), sourceId: 'nssdca-lrv' },
    { date: '1971-07-31', kind: 'trouble', label: t('First drive: the front steering does not work at first', 'Première sortie : la direction avant ne marche pas au début'), sourceId: 'alsj' },
    { date: '1971-08-02', kind: 'end', label: t('Last drive, rover parked for good', 'Dernière sortie, rover garé pour toujours'), sourceId: 'nssdca-lrv' },
    { date: '1972-04-21', kind: 'feat', label: t('Second rover lands with Apollo 16 (Descartes)', 'Deuxième rover avec Apollo 16 (Descartes)'), sourceId: 'alsj' },
    { date: '1972-12-11', kind: 'feat', label: t('Third rover lands with Apollo 17 (Taurus-Littrow)', 'Troisième rover avec Apollo 17 (Taurus-Littrow)'), sourceId: 'alsj' },
    { date: '2026-11-15', kind: 'today', label: t('All three rovers are still on the Moon', 'Les trois rovers sont toujours sur la Lune'), sourceId: 'nssdca-lrv' },
  ],
  stats: [
    { value: '3', label: t('rovers left on the Moon', 'rovers laissés sur la Lune'), sourceId: 'nssdca-lrv' },
    { value: '≈ 27.9 km', label: t('driven on Apollo 15', 'parcourus pendant Apollo 15'), sourceId: 'nssdca-a15' },
    { value: '≈ 210 kg', label: t('mass on Earth', 'masse sur Terre'), sourceId: 'nssdca-lrv' },
    { value: '≈ 490 kg', label: t('it could carry', 'de charge transportée'), sourceId: 'nssdca-lrv' },
    { value: '4', label: t('wheels, one motor each', 'roues, un moteur chacune'), sourceId: 'nssdca-lrv' },
  ],
  chapters: [
    {
      id: 'who',
      title: t('Who am I?', 'Qui suis-je ?'),
      lead: t('I am a car built for the Moon.', 'Je suis une voiture construite pour la Lune.'),
      body: t(
        'I have four wheels, two seats and no roof. I am about 3 metres long, like a small car, but I weigh only about 210 kg on Earth. On the Moon, gravity is six times weaker, so I felt even lighter.',
        'J’ai quatre roues, deux sièges et pas de toit. Je mesure environ 3 mètres, comme une petite voiture, mais je ne pèse qu’environ 210 kg sur Terre. Sur la Lune, la gravité est six fois plus faible : je semblais encore plus léger.',
      ),
    },
    {
      id: 'why',
      title: t('Why was I sent?', 'Pourquoi m’a-t-on envoyé ?'),
      lead: t('Boots are slow. Spacesuits are heavy.', 'Les bottes sont lentes. Les combinaisons sont lourdes.'),
      body: t(
        'Walking on the Moon is tiring and slow. With me, astronauts could drive kilometres away from their lunar module, carry their tools and bring back many more rocks for scientists on Earth.',
        'Marcher sur la Lune est lent et fatigant. Avec moi, les astronautes pouvaient rouler à plusieurs kilomètres de leur module lunaire, transporter leurs outils et rapporter beaucoup plus de roches aux scientifiques sur Terre.',
      ),
    },
    {
      id: 'how',
      title: t('How I worked', 'Comment je fonctionnais'),
      lead: t('Folded like a camping chair, powered by two batteries.', 'Plié comme une chaise de camping, alimenté par deux batteries.'),
      body: t(
        'I travelled folded up on the side of the lunar module. The astronauts pulled a strap and I unfolded. Each wheel had its own electric motor, and a T-shaped handle replaced the steering wheel. Touch my parts to see how they worked together.',
        'J’ai voyagé replié sur le côté du module lunaire. Les astronautes tiraient sur une sangle et je me dépliais. Chaque roue avait son moteur électrique, et une poignée en T remplaçait le volant. Touche mes pièces pour voir comment elles travaillaient ensemble.',
      ),
      sceneAction: 'focus-part',
      focusPart: 'frame',
    },
    {
      id: 'hardest',
      title: t('My hardest moment', 'Mon moment le plus difficile'),
      lead: t('Duct tape, on the Moon.', 'Du ruban adhésif, sur la Lune.'),
      body: t(
        'On Apollo 15, my front steering did not work at first, so I was steered with my back wheels only. On Apollo 17, a fender broke and threw dust everywhere. The astronauts fixed it with laminated maps and duct tape!',
        'Pendant Apollo 15, ma direction avant ne marchait pas au début : on m’a dirigé avec les roues arrière seulement. Pendant Apollo 17, une aile s’est cassée et projetait de la poussière partout. Les astronautes l’ont réparée avec des cartes plastifiées et du ruban adhésif !',
      ),
    },
    {
      id: 'discovered',
      title: t('What I made possible', 'Ce que j’ai rendu possible'),
      lead: t('More distance, more rocks, more answers.', 'Plus de distance, plus de roches, plus de réponses.'),
      body: t(
        'On Apollo 15 alone, I helped bring back about 77 kg of Moon samples. Rocks collected far apart tell a richer story: they helped scientists understand how the Moon formed and changed over billions of years.',
        'Rien que pendant Apollo 15, j’ai aidé à rapporter environ 77 kg d’échantillons lunaires. Des roches récoltées loin les unes des autres racontent une histoire plus riche : elles ont aidé les scientifiques à comprendre comment la Lune s’est formée et a changé pendant des milliards d’années.',
      ),
    },
    {
      id: 'last-day',
      title: t('My last day', 'Mon dernier jour'),
      lead: t('I was parked on purpose.', 'On m’a garé exprès.'),
      body: t(
        'The rocket that took the astronauts home could only lift a limited weight: people and precious rocks came first. My batteries could not be recharged anyway. So after the last drive, I was parked, and my camera watched my friends leave.',
        'La fusée qui ramenait les astronautes ne pouvait soulever qu’un poids limité : les humains et les précieuses roches passaient en premier. Mes batteries ne pouvaient de toute façon pas être rechargées. Après la dernière sortie, on m’a garé, et ma caméra a regardé mes amis partir.',
      ),
    },
    {
      id: 'today',
      title: t('Where I am today', 'Où je suis aujourd’hui'),
      lead: t('Still parked. Still waiting.', 'Toujours garé. Toujours là.'),
      body: t(
        'There is no wind and no rain on the Moon, so my wheel tracks may last for a very long time. My two siblings rest at Descartes and Taurus-Littrow. We are proof that humans once drove on another world.',
        'Il n’y a ni vent ni pluie sur la Lune : les traces de mes roues peuvent durer très longtemps. Mes deux frères reposent à Descartes et à Taurus-Littrow. Nous sommes la preuve que des humains ont déjà conduit sur un autre monde.',
      ),
    },
  ],
  parts: [
    {
      id: 'wheels',
      icon: 'CircleDot',
      name: t('Wire-mesh wheels', 'Roues en maillage métallique'),
      meshNames: ['wheel', 'roue', 'tire', 'pneu'],
      anchor: [1.15, 0.85, 0.95],
      camera: { position: [2.6, 0.9, 2.6], target: [1.15, 0.4, 0.9] },
      explode: [0, 0, 0.5],
      simple: t(
        "I'm a wheel, but there's no air inside me! I'm woven from thin steel wires, like a basket, with titanium strips that grip the dust. A flat tyre? Impossible.",
        'Je suis une roue, mais il n’y a pas d’air en moi ! Je suis tressée en fils d’acier fins, comme un panier, avec des bandes de titane qui accrochent la poussière. Une crevaison ? Impossible.',
      ),
      deeper: t(
        'Each wheel was a flexible mesh of woven steel wire (often called "piano wire") with titanium chevrons on the tread. The mesh bent over rocks and spread the load on the soft, fine lunar soil (regolith).',
        'Chaque roue était un maillage souple de fils d’acier tressés (souvent appelé « corde à piano ») avec des chevrons en titane sur la bande de roulement. Le maillage se déformait sur les cailloux et répartissait le poids sur le sol lunaire fin et mou (le régolithe).',
      ),
      whyItMattered: t(
        'A rubber tyre full of air could freeze, overheat or burst in a vacuum. Mesh wheels let astronauts drive safely far from their spacecraft.',
        'Un pneu en caoutchouc rempli d’air pouvait geler, surchauffer ou éclater dans le vide. Les roues en maillage permettaient de rouler en sécurité loin du vaisseau.',
      ),
      funFact: t('You can still see the zig-zag pattern of these wheels in the lunar dust in photos taken from orbit.', 'Les traces en zigzag de ces roues sont visibles dans la poussière sur des photos prises depuis l’orbite.'),
      numbers: [{ value: '≈ 82 cm', label: t('wheel diameter', 'diamètre d’une roue'), sourceId: 'nssdca-lrv' }],
      worksWith: ['motors', 'frame'],
    },
    {
      id: 'motors',
      icon: 'Cog',
      name: t('Electric motors (one per wheel)', 'Moteurs électriques (un par roue)'),
      meshNames: ['motor', 'moteur', 'hub'],
      anchor: [-1.15, 0.45, 0.62],
      camera: { position: [-2.2, 0.8, 2.3], target: [-1.15, 0.42, 0.7] },
      explode: [0, 0, 0.25],
      simple: t(
        'Each wheel had its own little electric motor. If one stopped working, the other three could still drive me home.',
        'Chaque roue avait son petit moteur électrique. Si l’un tombait en panne, les trois autres pouvaient encore me ramener.',
      ),
      deeper: t(
        'The rover had four independent electric drive motors, one inside each wheel hub. Both the front and the rear wheels could steer, which made tight turns possible.',
        'Le rover avait quatre moteurs électriques indépendants, un dans le moyeu de chaque roue. Les roues avant et arrière pouvaient tourner, ce qui permettait des virages serrés.',
      ),
      whyItMattered: t('Redundancy: far from the lunar module, one broken motor could not leave the crew stranded.', 'La redondance : loin du module lunaire, un moteur en panne ne pouvait pas bloquer l’équipage.'),
      worksWith: ['batteries', 'wheels', 'controller'],
    },
    {
      id: 'batteries',
      icon: 'BatteryLow',
      name: t('Two silver-zinc batteries', 'Deux batteries argent-zinc'),
      meshNames: ['batter', 'power'],
      anchor: [1.25, 1.05, 0.25],
      camera: { position: [2.8, 1.8, 1.4], target: [1.2, 0.85, 0.2] },
      explode: [0.5, 0.4, 0],
      simple: t(
        "We are two batteries. We gave the rover all its energy, but nobody could recharge us. When we were empty, the trip was over.",
        'Nous sommes deux batteries. Nous donnions toute son énergie au rover, mais personne ne pouvait nous recharger. Une fois vides, le voyage était fini.',
      ),
      deeper: t(
        'The rover carried two non-rechargeable silver-zinc batteries. There was no solar panel to refill them, so their energy budget limited how far the rover could go on each mission.',
        'Le rover avait deux batteries argent-zinc non rechargeables. Aucun panneau solaire ne les rechargeait : leur réserve d’énergie limitait la distance parcourue à chaque mission.',
      ),
      whyItMattered: t('One of the reasons the rovers were left behind: once their batteries were used, they could not be driven again.', 'Une des raisons de l’abandon des rovers : une fois les batteries épuisées, impossible de les reconduire.'),
      numbers: [{ value: '36 V', label: t('voltage of each battery', 'tension de chaque batterie'), sourceId: 'nssdca-lrv' }],
      worksWith: ['motors', 'navigation'],
    },
    {
      id: 'frame',
      icon: 'Frame',
      name: t('Foldable aluminium frame', 'Châssis repliable en aluminium'),
      meshNames: ['frame', 'chassis', 'body'],
      anchor: [0.2, 0.62, -0.62],
      camera: { position: [0.5, 2.4, -3.6], target: [0, 0.6, 0] },
      explode: [0, -0.15, 0],
      simple: t(
        'I folded up like a camping chair so I could fit inside the lunar module. On the Moon, I unfolded in a few minutes.',
        'Je me pliais comme une chaise de camping pour tenir dans le module lunaire. Sur la Lune, je me dépliais en quelques minutes.',
      ),
      deeper: t(
        'The frame was made of aluminium tubing and hinged in three sections. Folded, the rover rode in a bay on the side of the lunar module’s descent stage. Astronauts released it with straps and pulleys.',
        'Le châssis était fait de tubes d’aluminium articulés en trois parties. Plié, le rover voyageait dans une baie sur le côté de l’étage de descente du module lunaire. Les astronautes le libéraient avec des sangles et des poulies.',
      ),
      whyItMattered: t('Every kilogram and every centimetre counted in the spacecraft. Folding made it possible to bring a car at all.', 'Chaque kilo et chaque centimètre comptaient dans le vaisseau. Le pliage a rendu possible d’emporter une voiture.'),
      funFact: t('Aluminium was chosen because it is strong but light: the whole car weighed about as much as three adults.', 'L’aluminium a été choisi car il est solide et léger : toute la voiture pesait à peu près autant que trois adultes.'),
      worksWith: ['wheels', 'seats'],
    },
    {
      id: 'controller',
      icon: 'Joystick',
      name: t('T-handle controller', 'Poignée de commande en T'),
      meshNames: ['controller', 'handle', 'joystick', 'tcontrol'],
      anchor: [0.3, 1.25, 0],
      camera: { position: [1.4, 2.2, 1.6], target: [0.25, 1.0, 0] },
      explode: [0, 0.35, 0],
      simple: t(
        'No steering wheel! The driver pushed me forward to go, pulled back to brake, and tilted me left or right to turn. Either astronaut could drive.',
        'Pas de volant ! Le conducteur me poussait vers l’avant pour avancer, me tirait vers l’arrière pour freiner et m’inclinait pour tourner. Les deux astronautes pouvaient conduire.',
      ),
      deeper: t(
        'A single hand controller between the two seats sent commands to the drive and steering electronics. It was designed to be used with bulky pressurised gloves.',
        'Une seule poignée entre les deux sièges envoyait les ordres à l’électronique de propulsion et de direction. Elle était conçue pour être utilisée avec d’épais gants pressurisés.',
      ),
      whyItMattered: t('Simple controls meant fewer mistakes for astronauts in stiff spacesuits.', 'Des commandes simples, c’étaient moins d’erreurs pour des astronautes en combinaison rigide.'),
      worksWith: ['motors', 'navigation'],
    },
    {
      id: 'navigation',
      icon: 'Compass',
      name: t('Navigation system', 'Système de navigation'),
      meshNames: ['nav', 'console', 'dash', 'gyro'],
      anchor: [0.65, 1.3, 0],
      camera: { position: [-0.4, 1.9, 0.9], target: [0.6, 1.1, 0] },
      explode: [0.2, 0.4, 0],
      simple: t(
        'I always knew the way home. I counted how many times the wheels turned and used a gyroscope, a spinning compass, to point back to the lunar module.',
        'Je connaissais toujours le chemin du retour. Je comptais les tours de roues et j’utilisais un gyroscope, une sorte de boussole qui tourne, pour indiquer la direction du module lunaire.',
      ),
      deeper: t(
        'There is no GPS and no useful magnetic compass on the Moon. A directional gyroscope and wheel odometers fed a small computer that displayed heading, distance travelled, and bearing and range back to the lunar module.',
        'Pas de GPS ni de boussole magnétique utile sur la Lune. Un gyroscope directionnel et des compteurs de roues alimentaient un petit calculateur qui affichait le cap, la distance parcourue, ainsi que la direction et la distance du module lunaire.',
      ),
      whyItMattered: t('Safety: astronauts had to be able to walk back if the rover broke down, so they always needed to know where home was.', 'La sécurité : si le rover tombait en panne, il fallait pouvoir rentrer à pied, donc toujours savoir où était le module.'),
      worksWith: ['batteries', 'controller'],
    },
    {
      id: 'tv-camera',
      icon: 'Video',
      name: t('Remote-controlled TV camera', 'Caméra de télévision télécommandée'),
      meshNames: ['camera', 'tv', 'gcta'],
      anchor: [1.6, 1.4, 0.25],
      camera: { position: [3.0, 1.7, 1.2], target: [1.5, 1.25, 0.25] },
      explode: [0.45, 0.2, 0.2],
      simple: t(
        'I was a camera that people on Earth could steer by remote control. Thanks to me, people at home could watch the Moon live on TV.',
        'J’étais une caméra que des personnes sur Terre pouvaient diriger à distance. Grâce à moi, on pouvait regarder la Lune en direct à la télévision.',
      ),
      deeper: t(
        'The colour TV camera was mounted at the front and could be pointed, tilted and zoomed by a controller on Earth. Its pictures were sent through the rover’s radio relay unit and dish antenna.',
        'La caméra couleur était fixée à l’avant et pouvait être orientée, inclinée et zoomée par un opérateur sur Terre. Ses images passaient par le relais radio et l’antenne parabolique du rover.',
      ),
      whyItMattered: t('Scientists on Earth could see the landscape and help the astronauts choose which rocks to collect.', 'Les scientifiques sur Terre voyaient le paysage et aidaient les astronautes à choisir les roches à ramasser.'),
      funFact: t('On Apollo 17, this camera filmed the astronauts’ lift-off from the Moon, controlled from Earth.', 'Pendant Apollo 17, cette caméra a filmé le décollage des astronautes depuis la Lune, pilotée depuis la Terre.'),
      worksWith: ['antenna'],
    },
    {
      id: 'antenna',
      icon: 'Satellite',
      name: t('Umbrella dish antenna', 'Antenne parabolique « parapluie »'),
      meshNames: ['antenna', 'antenne', 'dish', 'lcru'],
      anchor: [1.35, 2.05, -0.3],
      camera: { position: [3.2, 2.6, -1.6], target: [1.3, 1.7, -0.3] },
      explode: [0.2, 0.6, -0.2],
      simple: t(
        "I'm the rover's phone line to Earth. I opened like an umbrella and had to point at Earth, about 384,000 km away, to send TV pictures home.",
        'Je suis la ligne téléphonique du rover vers la Terre. Je m’ouvrais comme un parapluie et devais viser la Terre, à environ 384 000 km, pour envoyer les images.',
      ),
      deeper: t(
        'The high-gain dish was part of the Lunar Communications Relay Unit (LCRU). It focused radio waves into a narrow beam aimed at Earth. Radio waves travel at the speed of light and take about 1.3 seconds to cross that distance.',
        'L’antenne grand gain faisait partie du relais de communication lunaire (LCRU). Elle concentrait les ondes radio en un faisceau étroit vers la Terre. Les ondes voyagent à la vitesse de la lumière et mettent environ 1,3 seconde pour franchir cette distance.',
      ),
      whyItMattered: t('Without this link, there would be no live pictures and no help from scientists on Earth during the drives.', 'Sans cette liaison, pas d’images en direct ni d’aide des scientifiques sur Terre pendant les sorties.'),
      numbers: [{ value: '≈ 1.3 s', label: t('light travel time Moon → Earth', 'temps de trajet de la lumière Lune → Terre'), sourceId: 'nssdca' }],
      worksWith: ['tv-camera', 'batteries'],
    },
    {
      id: 'seats',
      icon: 'Armchair',
      name: t('Folding seats & footrests', 'Sièges pliants et repose-pieds'),
      meshNames: ['seat', 'siege', 'foot'],
      anchor: [-0.15, 1.3, 0.38],
      camera: { position: [-1.6, 2.4, 2.4], target: [-0.15, 0.95, 0.3] },
      explode: [0, 0.3, 0.15],
      simple: t(
        'Two folding seats with seat belts. In low gravity, astronauts in big spacesuits bounced a lot on bumpy ground, so the belts kept them on board.',
        'Deux sièges pliants avec ceintures. En faible gravité, les astronautes en grosse combinaison rebondissaient beaucoup sur les bosses : les ceintures les gardaient à bord.',
      ),
      deeper: t(
        'The seats were light tubular frames with webbing, shaped to fit astronauts wearing life-support backpacks. Footrests helped them brace their legs while driving.',
        'Les sièges étaient des cadres tubulaires légers avec des sangles, adaptés à des astronautes portant leur sac de survie. Les repose-pieds les aidaient à se caler pendant la conduite.',
      ),
      whyItMattered: t('Comfort and safety mattered: a fall far from the lunar module could damage a spacesuit.', 'Le confort et la sécurité comptaient : une chute loin du module pouvait abîmer une combinaison.'),
      worksWith: ['frame', 'controller'],
    },
    {
      id: 'cargo',
      icon: 'Package',
      name: t('Tool & sample carrier', 'Porte-outils et échantillons'),
      meshNames: ['cargo', 'pallet', 'tool', 'sample'],
      anchor: [-1.45, 1.2, 0],
      camera: { position: [-3.4, 1.9, 1.0], target: [-1.3, 0.95, 0] },
      explode: [-0.55, 0.2, 0],
      simple: t(
        'My back was a toolbox: rakes, scoops, hammers and bags to bring Moon rocks back to Earth.',
        'Mon arrière était une boîte à outils : râteaux, pelles, marteaux et sacs pour rapporter des roches lunaires sur Terre.',
      ),
      deeper: t(
        'A rear pallet held geology tools and sample bags. Astronauts filled the bags at each stop, labelled where every rock came from, then drove on to the next site.',
        'Un plateau arrière portait les outils de géologie et les sacs d’échantillons. À chaque arrêt, les astronautes remplissaient les sacs, notaient d’où venait chaque roche, puis roulaient vers le site suivant.',
      ),
      whyItMattered: t('Knowing exactly where each rock was found is what turns a stone into a scientific clue.', 'Savoir exactement où chaque roche a été trouvée, c’est ce qui transforme un caillou en indice scientifique.'),
      worksWith: ['frame', 'seats'],
    },
  ],
  telemetry: {
    band: t('S-band radio via the Lunar Communications Relay Unit', 'Radio bande S via le relais de communication lunaire'),
    delay: t('≈ 1.3 seconds Moon → Earth', '≈ 1,3 seconde Lune → Terre'),
    delaySeconds: 1.3,
    delayLabel: t('real time', 'temps réel'),
    lastContact: t('Last drives: 1971 and 1972', 'Dernières sorties : 1971 et 1972'),
    link: t('Rover dish → Earth stations', 'Antenne du rover → stations sur Terre'),
    replies: false,
    replyText: t(
      'No answer: my batteries have been empty since 1971. But my camera once sent you live pictures of the Moon in just 1.3 seconds.',
      'Pas de réponse : mes batteries sont vides depuis 1971. Mais ma caméra t’envoyait autrefois des images de la Lune en direct en 1,3 seconde seulement.',
    ),
  },
  quiz: [
    {
      q: t('Why did the rover stay on the Moon?', 'Pourquoi le rover est-il resté sur la Lune ?'),
      options: [
        t('The rocket home could only lift a limited weight, and its batteries could not be recharged', 'La fusée du retour avait une limite de poids, et ses batteries n’étaient pas rechargeables'),
        t('It got stuck in a crater', 'Il était coincé dans un cratère'),
        t('The astronauts forgot it', 'Les astronautes l’ont oublié'),
      ],
      answer: 0,
      explain: t('People and rock samples came first in the small ascent rocket. The rover was parked on purpose.', 'Les humains et les échantillons passaient en premier dans la petite fusée de remontée. Le rover a été garé exprès.'),
    },
    {
      q: t('How many wheels did it have, and what were they made of?', 'Combien de roues avait-il, et en quoi étaient-elles ?'),
      options: [t('6 rubber wheels', '6 roues en caoutchouc'), t('4 woven steel-wire wheels', '4 roues en fils d’acier tressés'), t('3 plastic wheels', '3 roues en plastique')],
      answer: 1,
      explain: t('Four mesh wheels with titanium chevrons: no air inside, so no flat tyres.', 'Quatre roues en maillage avec chevrons en titane : pas d’air dedans, donc pas de crevaison.'),
    },
    {
      q: t('What was the dish antenna for?', 'À quoi servait l’antenne parabolique ?'),
      options: [t('Catching sunlight', 'Capter la lumière du Soleil'), t('Sending live TV pictures to Earth', 'Envoyer des images télévisées en direct vers la Terre'), t('Steering the rover', 'Diriger le rover')],
      answer: 1,
      explain: t('It focused radio waves toward Earth, about 384,000 km away.', 'Elle concentrait les ondes radio vers la Terre, à environ 384 000 km.'),
    },
  ],
  faq: [
    {
      q: t('Why did you stay on the Moon?', 'Pourquoi es-tu resté sur la Lune ?'),
      a: t('The rocket home could only carry the astronauts and their rocks, and my batteries could not be recharged. So I was parked on purpose.', 'La fusée du retour ne pouvait emporter que les astronautes et leurs roches, et mes batteries n’étaient pas rechargeables. On m’a donc garé exprès.'),
      keywords: ['stay', 'left', 'why', 'reste', 'pourquoi', 'abandon'],
    },
    {
      q: t('How did you get power?', 'D’où venait ton énergie ?'),
      a: t('From two silver-zinc batteries. They could not be recharged.', 'De deux batteries argent-zinc. Elles n’étaient pas rechargeables.'),
      keywords: ['power', 'energy', 'battery', 'energie', 'batterie'],
    },
    {
      q: t('How fast could you go?', 'À quelle vitesse roulais-tu ?'),
      a: t('About as fast as a bicycle: up to about 13 km/h on flat ground. On Apollo 16, going down a steep slope, John Young reported about 17 km/h!', 'À peu près comme un vélo : jusqu’à environ 13 km/h sur terrain plat. Pendant Apollo 16, en descendant une pente raide, John Young a annoncé environ 17 km/h !'),
      keywords: ['fast', 'speed', 'vite', 'vitesse'],
    },
  ],
  audio: {
    story: { en: 'audio/lrv_en.mp3', fr: 'audio/lrv_fr.mp3' },
    transcript: t(
      'Once upon a time, a little car travelled to the Moon, folded up like a camping chair. Two astronauts unfolded it, sat down, and drove across the grey dust, farther than their boots could ever carry them. The car had wire wheels that could never go flat, and a camera that sent live pictures back to Earth. Its batteries could not be recharged, and the rocket home could only carry people and precious rocks. So, when the last drive was over, the car was parked. Its camera watched its friends fly away. It is still there today, waiting in the silence, next to its own tracks.',
      'Il était une fois une petite voiture qui partit vers la Lune, pliée comme une chaise de camping. Deux astronautes la déplièrent, s’assirent et roulèrent sur la poussière grise, bien plus loin que leurs bottes n’auraient pu les porter. La voiture avait des roues en fil métallique qui ne crevaient jamais et une caméra qui envoyait des images en direct vers la Terre. Ses batteries ne pouvaient pas être rechargées, et la fusée du retour ne pouvait emporter que les humains et les précieuses roches. Alors, après la dernière sortie, la voiture fut garée. Sa caméra regarda ses amis s’envoler. Elle est toujours là aujourd’hui, dans le silence, à côté de ses propres traces.',
    ),
  },
  model: { glb: 'models/lrv.glb', scale: 1, defaultCamera: { position: [4.6, 2.5, 4.4], target: [0, 0.85, 0] } },
  sources: ['nssdca-lrv', 'nssdca-a15', 'alsj', 'nssdca'],
};
