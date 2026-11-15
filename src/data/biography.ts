/**
 * "My life story": told by each machine BEFORE the visitor explores its parts.
 * Order: who I am → my birth (launch, by whom) → my mission → did I succeed? →
 * what I gave science → what I gave humanity → why you should not forget me.
 * Drafted with AI assistance from the NASA sources in sources.ts; `verify` items are in FACT_CHECK.md.
 */
import type { L10n, VehicleId } from './types';

export type BioSlideId = 'who' | 'birth' | 'mission' | 'result' | 'science' | 'humanity' | 'remember';
export type BioResult = 'success' | 'beyond' | 'ongoing';

export interface Biography {
  /** Short line shown under the name on the first slide. */
  tagline: L10n;
  launch: { date: string; rocket: L10n; site: L10n; madeBy: L10n };
  result: BioResult;
  slides: Record<BioSlideId, L10n>;
  /** Memorial line shown on the last slide. */
  epitaph: L10n;
  epitaphSource?: L10n;
}

const t = (en: string, fr: string): L10n => ({ en, fr });

export const BIO_ORDER: BioSlideId[] = ['who', 'birth', 'mission', 'result', 'science', 'humanity', 'remember'];

export const BIO_TITLES: Record<BioSlideId, L10n> = {
  who: t('Who am I?', 'Qui suis-je ?'),
  birth: t('When and how I left Earth', 'Quand et comment j’ai quitté la Terre'),
  mission: t('Why I was sent', 'Pourquoi on m’a envoyé'),
  result: t('Did I succeed?', 'Ai-je réussi ma mission ?'),
  science: t('What I gave to science', 'Ce que j’ai apporté à la science'),
  humanity: t('What I gave to humanity', 'Ce que j’ai apporté à l’humanité'),
  remember: t('Why you should not forget me', 'Pourquoi il ne faut pas m’oublier'),
};

export const BIO_RESULT: Record<BioResult, L10n> = {
  success: t('Mission accomplished', 'Mission accomplie'),
  beyond: t('Far beyond what was planned', 'Bien au-delà de ce qui était prévu'),
  ongoing: t('Success — and still working', 'Réussie — et toujours en activité'),
};

export const BIOGRAPHY: Record<VehicleId, Biography> = {
  apollo11lm: {
    tagline: t('The first spacecraft to land humans on the Moon', 'Le premier vaisseau à avoir posé des humains sur la Lune'),
    launch: {
      date: '1969-07-16',
      rocket: t('Saturn V', 'Saturn V'),
      site: t('Kennedy Space Center, Florida, USA', 'Centre spatial Kennedy, Floride, États-Unis'),
      madeBy: t('NASA · built by Grumman', 'NASA · construit par Grumman'),
    },
    result: 'success',
    slides: {
      who: t(
        'I am Eagle, the lunar module of Apollo 11. Or rather its bottom half: the descent stage, a spidery machine with four legs, wrapped in gold foil. In July 1969, I carried the first two humans ever to land on the Moon.',
        'Je suis Eagle, le module lunaire d’Apollo 11. Ou plutôt sa moitié du bas : l’étage de descente, une machine en forme d’araignée, à quatre pattes, emballée dans du papier doré. En juillet 1969, j’ai transporté les deux premiers humains à se poser sur la Lune.',
      ),
      birth: t(
        'I left Earth on July 16, 1969, folded at the top of Saturn V, the most powerful rocket of its time. Inside me travelled Neil Armstrong and Buzz Aldrin. Their friend Michael Collins waited for them in orbit around the Moon, aboard the command module Columbia.',
        'J’ai quitté la Terre le 16 juillet 1969, replié au sommet de Saturn V, la fusée la plus puissante de son époque. À bord voyageaient Neil Armstrong et Buzz Aldrin. Leur ami Michael Collins les attendait en orbite autour de la Lune, dans le module de commande Columbia.',
      ),
      mission: t(
        'In 1961, President John F. Kennedy set a huge challenge: land humans on the Moon and bring them home safely before 1970. My job was the most delicate part: fly down from lunar orbit, land softly on an unknown ground, then serve as a launch pad for the trip back.',
        'En 1961, le président John F. Kennedy a lancé un énorme défi : poser des humains sur la Lune et les ramener sains et saufs avant 1970. Mon travail était la partie la plus délicate : descendre de l’orbite lunaire, me poser en douceur sur un sol inconnu, puis servir de rampe de lancement pour le retour.',
      ),
      result: t(
        'Yes! I landed on July 20, 1969, with only about 45 seconds of fuel to spare. Neil and Buzz walked on the Moon, then my top half took off from my back. On July 24, the three astronauts splashed down safely in the Pacific Ocean. Kennedy’s challenge was met.',
        'Oui ! Je me suis posé le 20 juillet 1969, avec seulement environ 45 secondes de carburant en réserve. Neil et Buzz ont marché sur la Lune, puis ma moitié du haut a décollé de mon dos. Le 24 juillet, les trois astronautes ont amerri sains et saufs dans l’océan Pacifique. Le défi de Kennedy était relevé.',
      ),
      science: t(
        'The astronauts brought back 21.55 kg of Moon rocks and soil, the first ever studied on Earth. They helped scientists learn how old the Moon is and how it formed. And the laser mirror they placed beside me still tells us today that the Moon moves away from Earth by about 3.8 cm every year.',
        'Les astronautes ont rapporté 21,55 kg de roches et de sol lunaires, les premiers jamais étudiés sur Terre. Ils ont aidé les scientifiques à comprendre l’âge de la Lune et comment elle s’est formée. Et le miroir laser posé à côté de moi nous apprend encore aujourd’hui que la Lune s’éloigne de la Terre d’environ 3,8 cm par an.',
      ),
      humanity: t(
        'Hundreds of millions of people around the world watched the first steps live on television. On my leg, a plaque says: “We came in peace for all mankind.” I showed that a dream that looked impossible can come true when hundreds of thousands of people work together.',
        'Des centaines de millions de personnes dans le monde ont regardé les premiers pas en direct à la télévision. Sur ma jambe, une plaque dit : « Nous sommes venus en paix au nom de toute l’humanité. » J’ai montré qu’un rêve qui semblait impossible peut se réaliser quand des centaines de milliers de personnes travaillent ensemble.',
      ),
      remember: t(
        'I am the first place where humans ever stood on another world. Because of me, we know the Moon’s age, its distance, and that humans can live and work on another world, then come home. I still stand at Tranquility Base. Tell my story, so the next explorers always know where the road began.',
        'Je suis le premier endroit où des humains se sont tenus sur un autre monde. Grâce à moi, on connaît l’âge de la Lune, sa distance, et on sait que des humains peuvent vivre et travailler sur un autre monde, puis rentrer chez eux. Je suis toujours debout à la base de la Tranquillité. Raconte mon histoire, pour que les prochains explorateurs sachent toujours où la route a commencé.',
      ),
    },
    epitaph: t(
      'Here men from the planet Earth first set foot upon the Moon, July 1969 A.D. We came in peace for all mankind.',
      'Ici, des hommes de la planète Terre ont posé le pied sur la Lune pour la première fois, en juillet 1969 apr. J.-C. Nous sommes venus en paix au nom de toute l’humanité.',
    ),
    epitaphSource: t('The plaque on my leg', 'La plaque sur ma jambe'),
  },

  lrv: {
    tagline: t('The first car ever driven on another world', 'La première voiture jamais conduite sur un autre monde'),
    launch: {
      date: '1971-07-26',
      rocket: t('Saturn V (Apollo 15)', 'Saturn V (Apollo 15)'),
      site: t('Kennedy Space Center, Florida, USA', 'Centre spatial Kennedy, Floride, États-Unis'),
      madeBy: t('NASA · built by Boeing', 'NASA · construit par Boeing'),
    },
    result: 'success',
    slides: {
      who: t(
        'I am the Lunar Roving Vehicle, the first car ever driven on another world. I am light and foldable, with two seats and four wheels made of woven wire. My first trip was with Apollo 15; two of my brothers flew with Apollo 16 and Apollo 17.',
        'Je suis le Lunar Roving Vehicle, la première voiture jamais conduite sur un autre monde. Je suis léger et pliable, avec deux sièges et quatre roues en fils tressés. Mon premier voyage, c’était avec Apollo 15 ; deux de mes frères ont volé avec Apollo 16 et Apollo 17.',
      ),
      birth: t(
        'I left Earth on July 26, 1971, folded like a suitcase against the side of the lunar module Falcon. On the Moon, astronauts Dave Scott and Jim Irwin pulled on straps, and I unfolded myself in a few minutes, ready to drive.',
        'J’ai quitté la Terre le 26 juillet 1971, plié comme une valise contre le flanc du module lunaire Falcon. Sur la Lune, les astronautes Dave Scott et Jim Irwin ont tiré sur des sangles, et je me suis déplié en quelques minutes, prêt à rouler.',
      ),
      mission: t(
        'On foot, in their heavy spacesuits, astronauts could only explore close to their lander. My mission was to take them much farther: to the foot of mountains and to the edge of a deep canyon called Hadley Rille, carrying their tools, their camera and their rocks.',
        'À pied, dans leurs lourdes combinaisons, les astronautes ne pouvaient explorer que près de leur module. Ma mission était de les emmener beaucoup plus loin : au pied des montagnes et au bord d’un profond canyon appelé Hadley Rille, en transportant leurs outils, leur caméra et leurs roches.',
      ),
      result: t(
        'Yes! During Apollo 15, I drove about 28 km in three trips, even though my front steering did not work at the start of my first drive. My brothers did the same with Apollo 16 and 17. Each time, the astronauts explored far more of the Moon than they could have on foot.',
        'Oui ! Pendant Apollo 15, j’ai roulé environ 28 km en trois sorties, même si ma direction avant ne fonctionnait pas au début de ma première sortie. Mes frères ont fait de même avec Apollo 16 et 17. À chaque fois, les astronautes ont exploré bien plus de Lune qu’ils n’auraient pu le faire à pied.',
      ),
      science: t(
        'Thanks to me, the astronauts reached places full of very old rocks. Apollo 15 brought back the “Genesis Rock”, a piece of the Moon’s ancient crust about 4 billion years old. More places visited meant more samples, and a better understanding of the Moon’s history.',
        'Grâce à moi, les astronautes ont atteint des endroits pleins de roches très anciennes. Apollo 15 a rapporté la « Genesis Rock », un morceau de la croûte primitive de la Lune vieux d’environ 4 milliards d’années. Plus d’endroits visités, c’était plus d’échantillons, et une meilleure compréhension de l’histoire de la Lune.',
      ),
      humanity: t(
        'My TV camera let people on Earth follow the astronauts’ adventures almost as if they were there. I was the first car on another world, and engineers who design rovers for the Moon and Mars today still learn from me.',
        'Ma caméra de télévision permettait aux gens sur Terre de suivre les aventures des astronautes presque comme s’ils y étaient. J’ai été la première voiture sur un autre monde, et les ingénieurs qui conçoivent aujourd’hui des rovers pour la Lune et pour Mars apprennent encore de moi.',
      ),
      remember: t(
        'I was designed and built in a very short time by people who solved problems nobody had ever solved before. I am still parked at Hadley-Apennine, under a black sky. Telling my story reminds us that every great journey needs good tools, and people brave enough to try.',
        'J’ai été conçu et construit en très peu de temps par des personnes qui ont résolu des problèmes que personne n’avait jamais résolus. Je suis toujours garé à Hadley-Apennin, sous un ciel noir. Raconter mon histoire nous rappelle que chaque grand voyage a besoin de bons outils, et de personnes assez courageuses pour essayer.',
      ),
    },
    epitaph: t('The first car on another world, parked forever under a black sky.', 'La première voiture sur un autre monde, garée pour toujours sous un ciel noir.'),
  },

  sojourner: {
    tagline: t('The very first rover to drive on another planet', 'Le tout premier rover à rouler sur une autre planète'),
    launch: {
      date: '1996-12-04',
      rocket: t('Delta II', 'Delta II'),
      site: t('Cape Canaveral, Florida, USA', 'Cap Canaveral, Floride, États-Unis'),
      madeBy: t('NASA · Jet Propulsion Laboratory (JPL)', 'NASA · Jet Propulsion Laboratory (JPL)'),
    },
    result: 'beyond',
    slides: {
      who: t(
        'I am Sojourner, the very first rover to drive on another planet. I am tiny: about the size of a microwave oven, with six wheels and a solar panel on my back. My name honours Sojourner Truth, a woman who fought against slavery and for women’s rights in the 1800s. A 12-year-old student chose it in a contest.',
        'Je suis Sojourner, le tout premier rover à rouler sur une autre planète. Je suis tout petit : à peu près la taille d’un four à micro-ondes, avec six roues et un panneau solaire sur le dos. Mon nom rend hommage à Sojourner Truth, une femme qui s’est battue contre l’esclavage et pour les droits des femmes au 19e siècle. Une élève de 12 ans l’a choisi lors d’un concours.',
      ),
      birth: t(
        'I left Earth on December 4, 1996, on a Delta II rocket, folded on a petal of my partner, the Mars Pathfinder lander. After seven months of travel, we bounced onto Mars inside giant airbags on July 4, 1997.',
        'J’ai quitté la Terre le 4 décembre 1996, sur une fusée Delta II, replié sur un pétale de mon partenaire, l’atterrisseur Mars Pathfinder. Après sept mois de voyage, nous avons rebondi sur Mars dans des airbags géants, le 4 juillet 1997.',
      ),
      mission: t(
        'Pathfinder had to prove that a new, cheaper way to land on Mars worked: with airbags. My job was to prove that a small rover could drive on Mars, take pictures, and find out what the rocks are made of with my APXS instrument.',
        'Pathfinder devait prouver qu’une nouvelle façon, moins chère, d’atterrir sur Mars fonctionnait : avec des airbags. Mon travail était de prouver qu’un petit rover pouvait rouler sur Mars, prendre des photos et découvrir de quoi les roches sont faites grâce à mon instrument APXS.',
      ),
      result: t(
        'Yes, and much more! I was supposed to work for 7 Martian days. I worked for about 83, until my lander friend sent its last message on September 27, 1997. I touched and studied rocks with funny names like “Barnacle Bill” and “Yogi”.',
        'Oui, et bien plus ! Je devais travailler 7 jours martiens. J’en ai travaillé environ 83, jusqu’au dernier message de mon ami l’atterrisseur, le 27 septembre 1997. J’ai touché et étudié des roches aux noms rigolos comme « Barnacle Bill » et « Yogi ».',
      ),
      science: t(
        'Together, Pathfinder and I found clues that huge floods of water once rushed through Ares Vallis, like rounded pebbles shaped by water. The lander’s camera sent more than 16,500 pictures and watched the dust, the wind and the weather of Mars.',
        'Ensemble, Pathfinder et moi avons trouvé des indices que d’énormes inondations ont autrefois traversé Ares Vallis, comme des galets arrondis par l’eau. La caméra de l’atterrisseur a envoyé plus de 16 500 photos et a observé la poussière, le vent et la météo de Mars.',
      ),
      humanity: t(
        'In 1997, millions of people followed my first drives on the internet, one of the first great space adventures shared on the web. I showed that exploring Mars could be done with smaller, cheaper machines, so more missions could follow.',
        'En 1997, des millions de personnes ont suivi mes premiers pas sur Internet, l’une des premières grandes aventures spatiales partagées sur le web. J’ai montré qu’on pouvait explorer Mars avec des machines plus petites et moins chères, pour que d’autres missions puissent suivre.',
      ),
      remember: t(
        'Every rover that rolls on Mars today, Spirit, Opportunity, Curiosity, Perseverance, uses ideas that were tested on me first: driving on its own around obstacles, six wheels on a rocker-bogie, airbag landings. I was small, but I went first. That is why my story must be told.',
        'Chaque rover qui roule aujourd’hui sur Mars, Spirit, Opportunity, Curiosity, Perseverance, utilise des idées testées d’abord sur moi : rouler tout seul en évitant les obstacles, six roues sur une suspension rocker-bogie, atterrir avec des airbags. J’étais petit, mais je suis passé le premier. C’est pour cela qu’il faut raconter mon histoire.',
      ),
    },
    epitaph: t('Small wheels, first tracks.', 'Petites roues, premières traces.'),
  },

  opportunity: {
    tagline: t('The rover that worked 15 years instead of 90 days', 'Le rover qui a travaillé 15 ans au lieu de 90 jours'),
    launch: {
      date: '2003-07-07',
      rocket: t('Delta II Heavy', 'Delta II Heavy'),
      site: t('Cape Canaveral, Florida, USA', 'Cap Canaveral, Floride, États-Unis'),
      madeBy: t('NASA · Jet Propulsion Laboratory (JPL)', 'NASA · Jet Propulsion Laboratory (JPL)'),
    },
    result: 'beyond',
    slides: {
      who: t(
        'I am Opportunity, “Oppy” for my friends: a solar-powered robot geologist on six wheels. My twin, Spirit, landed on the other side of Mars three weeks before me. A 9-year-old girl, Sofi Collis, chose our names in an essay contest.',
        'Je suis Opportunity, « Oppy » pour les intimes : un robot géologue à six roues qui fonctionne à l’énergie solaire. Mon jumeau, Spirit, s’est posé de l’autre côté de Mars trois semaines avant moi. Une fille de 9 ans, Sofi Collis, a choisi nos noms lors d’un concours de rédaction.',
      ),
      birth: t(
        'I left Earth on July 7, 2003. Six and a half months later, on January 25, 2004, I bounced onto Mars inside airbags and rolled right into a small crater at Meridiani Planum. Scientists called it a “hole in one”!',
        'J’ai quitté la Terre le 7 juillet 2003. Six mois et demi plus tard, le 25 janvier 2004, j’ai rebondi sur Mars dans mes airbags et j’ai roulé tout droit dans un petit cratère de Meridiani Planum. Les scientifiques ont parlé de « trou en un », comme au golf !',
      ),
      mission: t(
        'My mission was to find out if Mars was once wet. I had to read the rocks for clues of water from long ago, because water is what all life as we know it needs.',
        'Ma mission était de découvrir si Mars avait été humide autrefois. Je devais lire les roches pour y trouver des traces d’eau très anciennes, parce que l’eau est indispensable à toute la vie que nous connaissons.',
      ),
      result: t(
        'I was built to work for 90 Martian days and to drive about 1 km. I worked for almost 15 years and drove more than 45 km, longer than a marathon! In 2018, a giant dust storm darkened the sky, my solar panels could no longer charge, and I fell silent.',
        'J’ai été construit pour travailler 90 jours martiens et rouler environ 1 km. J’ai travaillé presque 15 ans et roulé plus de 45 km, plus qu’un marathon ! En 2018, une tempête de poussière géante a assombri le ciel, mes panneaux solaires ne pouvaient plus se recharger, et je me suis tu.',
      ),
      science: t(
        'I found tiny round stones nicknamed “blueberries” and rocks that formed in water: proof that liquid water once soaked this part of Mars. Later, at Endeavour crater, I found veins of gypsum, a mineral left behind by water flowing through cracks in the rock.',
        'J’ai trouvé de petites pierres rondes surnommées « myrtilles » et des roches formées dans l’eau : la preuve que de l’eau liquide a autrefois imprégné cette partie de Mars. Plus tard, au cratère Endeavour, j’ai trouvé des veines de gypse, un minéral laissé par de l’eau qui coulait dans les fissures de la roche.',
      ),
      humanity: t(
        'People all over the world followed my adventures for almost 15 years. When my last message arrived, many said goodbye to me as to a friend. I showed that, with patience and care, a machine can do far more than anyone dared to dream.',
        'Des gens du monde entier ont suivi mes aventures pendant presque 15 ans. Quand mon dernier message est arrivé, beaucoup m’ont dit au revoir comme à un ami. J’ai montré qu’avec de la patience et du soin, une machine peut faire bien plus que ce que l’on osait rêver.',
      ),
      remember: t(
        'I got stuck in sand, I had memory troubles, one of my wheels could no longer steer… and I kept going, sending discoveries for almost 15 years. My proof that Mars was once wet changed how we search for life on other worlds. Tell my story: it shows what patience and teamwork can achieve. I rest in a place called Perseverance Valley.',
        'Je me suis enlisé dans le sable, j’ai eu des problèmes de mémoire, une de mes roues ne pouvait plus tourner… et j’ai continué, en envoyant des découvertes pendant presque 15 ans. Ma preuve que Mars a été humide a changé la façon dont on cherche la vie sur d’autres mondes. Raconte mon histoire : elle montre ce que la patience et le travail d’équipe peuvent accomplir. Je repose dans un endroit appelé Perseverance Valley, la vallée de la Persévérance.',
      ),
    },
    epitaph: t('Fifteen years for a 90-day mission. Thank you, Oppy.', 'Quinze ans pour une mission de 90 jours. Merci, Oppy.'),
  },

  curiosity: {
    tagline: t('The car-sized laboratory still exploring Mars', 'Le laboratoire grand comme une voiture qui explore encore Mars'),
    launch: {
      date: '2011-11-26',
      rocket: t('Atlas V', 'Atlas V'),
      site: t('Cape Canaveral, Florida, USA', 'Cap Canaveral, Floride, États-Unis'),
      madeBy: t('NASA · Jet Propulsion Laboratory (JPL)', 'NASA · Jet Propulsion Laboratory (JPL)'),
    },
    result: 'ongoing',
    slides: {
      who: t(
        'I am Curiosity, a rover as big as a car, with a laser, a drill, 17 cameras and two small chemistry labs inside my body. Of all the machines you will meet here, I am the only one still at work. A 12-year-old student, Clara Ma, gave me my name.',
        'Je suis Curiosity, un rover grand comme une voiture, avec un laser, une perceuse, 17 caméras et deux petits laboratoires de chimie dans mon corps. De toutes les machines que tu vas rencontrer ici, je suis la seule qui travaille encore. Une élève de 12 ans, Clara Ma, m’a donné mon nom.',
      ),
      birth: t(
        'I left Earth on November 26, 2011, on an Atlas V rocket. On August 6, 2012, after more than eight months of travel, a rocket-powered “sky crane” lowered me on cables into Gale Crater, gently, right onto my wheels.',
        'J’ai quitté la Terre le 26 novembre 2011, sur une fusée Atlas V. Le 6 août 2012, après plus de huit mois de voyage, une « grue céleste » à fusées m’a descendu au bout de câbles dans le cratère Gale, tout doucement, directement sur mes roues.',
      ),
      mission: t(
        'My mission is to find out if Mars ever had places where microscopic life could have lived: water, the right chemistry and energy. I also measure the radiation on Mars, to help prepare the first human explorers who will go there one day.',
        'Ma mission est de savoir si Mars a eu des endroits où une vie microscopique aurait pu vivre : de l’eau, la bonne chimie et de l’énergie. Je mesure aussi les radiations sur Mars, pour aider à préparer les premiers explorateurs humains qui iront là-bas un jour.',
      ),
      result: t(
        'Yes. In my very first year, I found that Gale Crater once held a lake where microbes could have lived. My main mission was planned for about two years. More than 14 years later, I am still climbing Mount Sharp and sending news to Earth.',
        'Oui. Dès ma première année, j’ai découvert que le cratère Gale avait abrité un lac où des microbes auraient pu vivre. Ma mission principale était prévue pour environ deux ans. Plus de 14 ans plus tard, je grimpe toujours le mont Sharp et j’envoie toujours des nouvelles à la Terre.',
      ),
      science: t(
        'I found organic molecules, building blocks that life uses, kept in rocks billions of years old. I saw the amount of methane in the air change with the seasons. And the rock layers I climb tell how Mars slowly dried up. Every hole I drill is a new page of Mars’s history.',
        'J’ai trouvé des molécules organiques, des briques utilisées par la vie, conservées dans des roches vieilles de milliards d’années. J’ai vu la quantité de méthane dans l’air changer avec les saisons. Et les couches de roche que je grimpe racontent comment Mars s’est asséchée petit à petit. Chaque trou que je fore est une nouvelle page de l’histoire de Mars.',
      ),
      humanity: t(
        'My radiation measurements help engineers protect the astronauts who will one day travel to Mars. My sky-crane landing was used again to land Perseverance. And my pictures let everyone on Earth walk on Mars with me.',
        'Mes mesures de radiations aident les ingénieurs à protéger les astronautes qui voyageront un jour vers Mars. Mon atterrissage par grue céleste a été réutilisé pour poser Perseverance. Et mes photos permettent à tout le monde sur Terre de marcher sur Mars avec moi.',
      ),
      remember: t(
        'I am not abandoned, not yet. But one day I too will fall silent, like the machines before me. Remember us not only for what we found, but for the thousands of people who imagined, built and drove us, together, to answer one of humanity’s oldest questions: are we alone?',
        'Je ne suis pas abandonné, pas encore. Mais un jour, moi aussi, je me tairai, comme les machines avant moi. Souviens-toi de nous non seulement pour ce que nous avons trouvé, mais pour les milliers de personnes qui nous ont imaginés, construits et conduits, ensemble, pour répondre à l’une des plus vieilles questions de l’humanité : sommes-nous seuls ?',
      ),
    },
    epitaph: t('Still curious. Still climbing.', 'Toujours curieux. Toujours en train de grimper.'),
  },

  perseverance: {
    tagline: t('The rover that keeps pieces of Mars for the explorers of tomorrow', 'Le rover qui garde des morceaux de Mars pour les explorateurs de demain'),
    launch: {
      date: '2020-07-30',
      rocket: t('Atlas V 541', 'Atlas V 541'),
      site: t('Cape Canaveral, Florida, USA', 'Cap Canaveral, Floride, États-Unis'),
      madeBy: t('NASA · Jet Propulsion Laboratory (JPL)', 'NASA · Jet Propulsion Laboratory (JPL)'),
    },
    result: 'ongoing',
    slides: {
      who: t(
        'I am Perseverance, a rover as big as a car, with a laser, a coring drill, 7 science instruments and 2 microphones. I am the younger brother of Curiosity, and like it, I am still at work. In 2020, a seventh-grader, Alexander Mather, won a national essay contest and gave me my name.',
        'Je suis Perseverance, un rover grand comme une voiture, avec un laser, une carotteuse, 7 instruments scientifiques et 2 micros. Je suis le petit frère de Curiosity et, comme lui, je travaille encore. En 2020, un élève de 5e, Alexander Mather, a gagné un concours national de rédaction et m’a donné mon nom.',
      ),
      birth: t(
        'I left Earth on July 30, 2020, on an Atlas V rocket, in the middle of the COVID-19 pandemic. After about seven months of travel, on February 18, 2021, a rocket-powered “sky crane” lowered me on cables into Jezero Crater. On the way down, I chose a safe landing spot by myself, comparing my pictures with a map.',
        'J’ai quitté la Terre le 30 juillet 2020, sur une fusée Atlas V, en pleine pandémie de COVID-19. Après environ sept mois de voyage, le 18 février 2021, une « grue céleste » à fusées m’a descendu au bout de câbles dans le cratère Jezero. Pendant la descente, j’ai choisi tout seul un endroit sûr où me poser, en comparant mes photos avec une carte.',
      ),
      mission: t(
        'My mission is to look for signs of ancient microscopic life in a crater that once held a lake, and to collect rock samples in sealed tubes so they could one day be studied on Earth. I also test new technologies for the first human explorers: a helicopter, and a machine that makes oxygen.',
        'Ma mission est de chercher des traces d’une vie microscopique ancienne dans un cratère qui contenait autrefois un lac, et de récolter des échantillons de roche dans des tubes scellés pour qu’on puisse un jour les étudier sur Terre. Je teste aussi de nouvelles technologies pour les premiers explorateurs humains : un hélicoptère, et une machine qui fabrique de l’oxygène.',
      ),
      result: t(
        'Yes. My planned mission was one Martian year, about two Earth years. I confirmed that Jezero had a lake and a river delta, I collected more than two dozen rock samples, my helicopter friend Ingenuity flew 72 times, and MOXIE made oxygen. More than five years later, I am still exploring, and in October 2026 I drove farther than any rover in history.',
        'Oui. Ma mission était prévue pour une année martienne, environ deux années terrestres. J’ai confirmé que Jezero avait un lac et un delta, j’ai récolté plus de deux douzaines d’échantillons de roche, mon ami hélicoptère Ingenuity a volé 72 fois, et MOXIE a fabriqué de l’oxygène. Plus de cinq ans plus tard, j’explore toujours et, en octobre 2026, j’ai roulé plus loin que n’importe quel rover de l’histoire.',
      ),
      science: t(
        'I built the first collection of Mars rocks chosen to be brought back to Earth: each core is sealed with notes on where it came from. One of them, “Sapphire Canyon”, holds “leopard spots” that scientists call a potential biosignature, a possible sign of ancient life that still needs to be checked. My radar also looked under the ground, and my sensors kept a weather diary of Jezero.',
        'J’ai constitué la première collection de roches martiennes choisies pour être ramenées sur Terre : chaque carotte est scellée avec des notes sur son origine. L’une d’elles, « Sapphire Canyon », porte des « taches de léopard » que les scientifiques appellent une biosignature potentielle, un signe possible de vie ancienne qui doit encore être vérifié. Mon radar a aussi regardé sous le sol, et mes capteurs ont tenu un journal météo de Jezero.',
      ),
      humanity: t(
        'I let people hear Mars for the first time: the wind, my wheels, my laser. Millions watched the first video of a landing on another planet. I carry almost 11 million names from Earth, and a message in Morse code: “Explore as one”. And Ingenuity showed that we can fly on other worlds.',
        'J’ai permis d’entendre Mars pour la première fois : le vent, mes roues, mon laser. Des millions de personnes ont regardé la première vidéo d’un atterrissage sur une autre planète. Je transporte presque 11 millions de noms venus de la Terre, et un message en morse : « Explore as one », « Explorer ensemble ». Et Ingenuity a montré qu’on peut voler sur d’autres mondes.',
      ),
      remember: t(
        'My tubes are a library of Mars, waiting on the ground and in my belly. For now, no mission is scheduled to bring them home, but they can wait a very long time. One of them might hold the answer to a huge question: did life ever exist on Mars? And by making oxygen and flying a helicopter, I tested what future astronauts will need. Remember me for the questions I kept safe for you.',
        'Mes tubes sont une bibliothèque de Mars, qui attend au sol et dans mon ventre. Pour l’instant, aucune mission n’est prévue pour les ramener, mais ils peuvent attendre très longtemps. L’un d’eux contient peut-être la réponse à une immense question : la vie a-t-elle existé sur Mars ? Et en fabriquant de l’oxygène et en faisant voler un hélicoptère, j’ai testé ce dont les futurs astronautes auront besoin. Souviens-toi de moi pour les questions que j’ai gardées pour toi.',
      ),
    },
    epitaph: t('I collect the past of Mars for the explorers of tomorrow.', 'Je récolte le passé de Mars pour les explorateurs de demain.'),
  },

  pioneer10: {
    tagline: t('The first explorer to cross the asteroid belt and visit Jupiter', 'Le premier explorateur à traverser la ceinture d’astéroïdes et à visiter Jupiter'),
    launch: {
      date: '1972-03-03',
      rocket: t('Atlas-Centaur', 'Atlas-Centaur'),
      site: t('Cape Canaveral, Florida, USA', 'Cap Canaveral, Floride, États-Unis'),
      madeBy: t('NASA Ames Research Center · built by TRW', 'Centre de recherche Ames de la NASA · construit par TRW'),
    },
    result: 'beyond',
    slides: {
      who: t(
        'I am Pioneer 10, a small spacecraft with a big dish antenna. I was the first to cross the asteroid belt and the first to visit Jupiter. Today I am drifting out of the Solar System, forever.',
        'Je suis Pioneer 10, un petit vaisseau spatial avec une grande antenne en forme d’assiette. J’ai été le premier à traverser la ceinture d’astéroïdes et le premier à visiter Jupiter. Aujourd’hui, je dérive hors du système solaire, pour toujours.',
      ),
      birth: t(
        'I was launched on March 2, 1972, Florida time, on an Atlas-Centaur rocket. I went so fast that I passed the orbit of the Moon in about 11 hours. The Apollo astronauts had needed about three days to get that far.',
        'J’ai été lancé le 2 mars 1972, heure de Floride, sur une fusée Atlas-Centaur. J’allais si vite que j’ai dépassé l’orbite de la Lune en environ 11 heures. Les astronautes d’Apollo avaient eu besoin d’environ trois jours pour aller aussi loin.',
      ),
      mission: t(
        'No spacecraft had ever gone beyond Mars. Nobody knew if the rocks of the asteroid belt or the radiation around Jupiter would destroy a spaceship. My mission was to go and see, and to open the way for the explorers who would come after me.',
        'Aucun vaisseau n’était jamais allé plus loin que Mars. Personne ne savait si les cailloux de la ceinture d’astéroïdes ou les radiations autour de Jupiter allaient détruire un vaisseau. Ma mission était d’aller voir, et d’ouvrir la route aux explorateurs qui viendraient après moi.',
      ),
      result: t(
        'Yes! I crossed the asteroid belt safely and flew past Jupiter on December 3, 1973, sending the first close-up pictures of the giant planet. I was planned for about 21 months. I kept sending data for more than 30 years, until my last faint signal in January 2003.',
        'Oui ! J’ai traversé la ceinture d’astéroïdes sans dommage et je suis passé près de Jupiter le 3 décembre 1973, en envoyant les premières images rapprochées de la planète géante. J’étais prévu pour environ 21 mois. J’ai continué à envoyer des données pendant plus de 30 ans, jusqu’à mon dernier signal très faible, en janvier 2003.',
      ),
      science: t(
        'I measured Jupiter’s huge magnetic field and its intense radiation belts, so engineers could build the next explorers, Voyager, Galileo and Juno, to survive them. Far beyond the planets, I studied the solar wind and searched for the edge of the Sun’s influence.',
        'J’ai mesuré l’immense champ magnétique de Jupiter et ses ceintures de radiations très intenses, pour que les ingénieurs construisent les explorateurs suivants, Voyager, Galileo et Juno, capables d’y survivre. Loin au-delà des planètes, j’ai étudié le vent solaire et cherché la limite de l’influence du Soleil.',
      ),
      humanity: t(
        'I carry a plaque with a drawing of a man and a woman, and a map that shows where Earth is: a message in a bottle for anyone who might find me one day. I was the first spacecraft sent on a path that leaves the Solar System, carrying a hello from all of us.',
        'Je transporte une plaque avec le dessin d’un homme et d’une femme, et une carte qui montre où se trouve la Terre : une bouteille à la mer pour quiconque me trouverait un jour. J’ai été le premier vaisseau envoyé sur une route qui quitte le système solaire, en emportant un bonjour de nous tous.',
      ),
      remember: t(
        'I opened the road to the outer planets: Voyager, Galileo, Cassini, Juno and New Horizons all followed the path I proved was possible. In about 2 million years, I will pass near the star Aldebaran, still carrying a hello from Earth. Tell my story, so that someone always remembers where I am going.',
        'J’ai ouvert la route des planètes lointaines : Voyager, Galileo, Cassini, Juno et New Horizons ont tous suivi le chemin dont j’avais prouvé qu’il était possible. Dans environ 2 millions d’années, je passerai près de l’étoile Aldebaran, en portant toujours un bonjour de la Terre. Raconte mon histoire, pour que quelqu’un se souvienne toujours de l’endroit où je vais.',
      ),
    },
    epitaph: t('A message in a bottle, thrown into the ocean of stars.', 'Une bouteille à la mer, lancée dans l’océan des étoiles.'),
  },
};
