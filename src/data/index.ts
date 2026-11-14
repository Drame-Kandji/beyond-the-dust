import type { ComingSoon, Destination, DestinationId, Vehicle, VehicleId } from './types';
import { lrv } from './vehicles/lrv';
import { opportunity } from './vehicles/opportunity';
import { pioneer10 } from './vehicles/pioneer10';
import { apollo11lm } from './vehicles/apollo11lm';
import { sojourner } from './vehicles/sojourner';
import { curiosity } from './vehicles/curiosity';

const t = (en: string, fr: string) => ({ en, fr });

export const VEHICLES: Record<VehicleId, Vehicle> = { lrv, opportunity, pioneer10, apollo11lm, sojourner, curiosity };
/** Order = order in the hub lists (per destination). */
export const VEHICLE_LIST: Vehicle[] = [apollo11lm, lrv, sojourner, opportunity, curiosity, pioneer10];

export const DESTINATIONS: Destination[] = [
  {
    id: 'moon',
    name: t('Moon', 'Lune'),
    tagline: t('Where astronauts drove farther than their boots could carry them.', 'Là où des astronautes ont roulé plus loin que leurs bottes ne pouvaient les porter.'),
    fact: t('Light from the Moon reaches Earth in about 1.3 seconds.', 'La lumière de la Lune atteint la Terre en environ 1,3 seconde.'),
  },
  {
    id: 'mars',
    name: t('Mars', 'Mars'),
    tagline: t('Where robots searched for clues about ancient water.', 'Là où des robots ont cherché des indices d’une eau ancienne.'),
    fact: t('A day on Mars, called a sol, lasts about 24 hours and 39 minutes.', 'Un jour martien, appelé sol, dure environ 24 heures et 39 minutes.'),
  },
  {
    id: 'deep-space',
    name: t('Deep Space', 'Espace lointain'),
    tagline: t('Where machines keep travelling after Earth can no longer hear them.', 'Là où des machines voyagent encore quand la Terre ne les entend plus.'),
    fact: t('Beyond Jupiter, sunlight is too weak for most solar panels.', 'Au-delà de Jupiter, la lumière du Soleil est trop faible pour la plupart des panneaux solaires.'),
  },
];

export const COMING_SOON: ComingSoon[] = [
  { id: 'alsep', destination: 'moon', name: 'ALSEP science stations', line: t('Seismometers and mirrors left to keep doing science.', 'Sismomètres et miroirs laissés pour continuer la science.') },
  { id: 'surveyor', destination: 'moon', name: 'Surveyor landers', line: t('Robots that proved soft landings were possible.', 'Des robots qui ont prouvé qu’on pouvait se poser en douceur.') },
  { id: 'viking', destination: 'mars', name: 'Viking 1 & 2', line: t('The first U.S. landers to work on Mars, 1976.', 'Les premiers atterrisseurs américains à fonctionner sur Mars, 1976.') },
  { id: 'phoenix', destination: 'mars', name: 'Phoenix & InSight', line: t('One dug for ice, one listened for marsquakes.', 'L’un creusait la glace, l’autre écoutait les séismes martiens.') },
  { id: 'ingenuity', destination: 'mars', name: 'Ingenuity', line: t('The first aircraft to fly on another planet.', 'Le premier aéronef à voler sur une autre planète.') },
  { id: 'dawn', destination: 'deep-space', name: 'Dawn', line: t('Still circling the dwarf planet Ceres, unpowered.', 'Tourne encore autour de la planète naine Cérès, sans énergie.') },
  { id: 'near', destination: 'deep-space', name: 'NEAR Shoemaker', line: t('Resting on the asteroid 433 Eros.', 'Repose sur l’astéroïde 433 Éros.') },
  { id: 'kepler', destination: 'deep-space', name: 'Kepler', line: t('Planet hunter drifting behind Earth’s orbit.', 'Chasseur de planètes qui dérive derrière l’orbite terrestre.') },
];

export const vehiclesFor = (d: DestinationId) => VEHICLE_LIST.filter((v) => v.destination === d);
export const comingSoonFor = (d: DestinationId) => COMING_SOON.filter((c) => c.destination === d);
