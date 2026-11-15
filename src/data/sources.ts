import type { Source } from './types';

export const SOURCES: Record<string, Source> = {
  'nssdca-lrv': {
    id: 'nssdca-lrv',
    title: 'The Apollo Lunar Roving Vehicle',
    publisher: 'NASA Space Science Data Coordinated Archive (NSSDCA)',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html',
  },
  'nssdca-a15': {
    id: 'nssdca-a15',
    title: 'Apollo 15 Lunar Module / ALSEP (1971-063C)',
    publisher: 'NASA Space Science Data Coordinated Archive (NSSDCA)',
    url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C',
  },
  nssdca: {
    id: 'nssdca',
    title: 'NASA Space Science Data Coordinated Archive',
    publisher: 'NASA Goddard Space Flight Center',
    url: 'https://nssdc.gsfc.nasa.gov/',
  },
  alsj: {
    id: 'alsj',
    title: 'Apollo Lunar Surface Journal',
    publisher: 'NASA History',
    url: 'https://www.nasa.gov/history/alsj/',
  },
  'nasa-mer': {
    id: 'nasa-mer',
    title: 'Mars Exploration Rovers: Spirit and Opportunity',
    publisher: 'NASA Science / JPL',
    url: 'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/',
  },
  'nasa-pioneer10': {
    id: 'nasa-pioneer10',
    title: 'Pioneer 10',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/pioneer-10/',
  },
  'nasa-pioneer11': {
    id: 'nasa-pioneer11',
    title: 'Pioneer 11',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/pioneer-11/',
  },
  'nssdca-a11lm': {
    id: 'nssdca-a11lm',
    title: 'Apollo 11 Lunar Module / EASEP (1969-059C)',
    publisher: 'NASA Space Science Data Coordinated Archive (NSSDCA)',
    url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C',
  },
  'nasa-pathfinder': {
    id: 'nasa-pathfinder',
    title: 'Mars Pathfinder',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/mars-pathfinder/',
  },
  'nasa-msl': {
    id: 'nasa-msl',
    title: 'Mars Science Laboratory: Curiosity Rover',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/msl-curiosity/',
  },
  'nssdca-msl': {
    id: 'nssdca-msl',
    title: 'Curiosity Mars Science Laboratory (2011-070A)',
    publisher: 'NASA Space Science Data Coordinated Archive (NSSDCA)',
    url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-070A',
  },
  'nasa-msl-instruments': {
    id: 'nasa-msl-instruments',
    title: 'Curiosity Science Instruments',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/msl-curiosity/science-instruments/',
  },
  'jpl-llr': {
    id: 'jpl-llr',
    title: 'The Apollo Experiment That Keeps On Giving (laser ranging)',
    publisher: 'NASA Jet Propulsion Laboratory',
    url: 'https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/',
  },
  'nasa-a11-plaque': {
    id: 'nasa-a11-plaque',
    title: 'Apollo 11 Plaque',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/resource/apollo-11-plaque/',
  },
  'jpl-sojourner': {
    id: 'jpl-sojourner',
    title: 'Mars Pathfinder Sojourner Rover',
    publisher: 'NASA Jet Propulsion Laboratory',
    url: 'https://www.jpl.nasa.gov/missions/mars-pathfinder-sojourner-rover/',
  },
  'nssdca-pathfinder': {
    id: 'nssdca-pathfinder',
    title: 'Mars Pathfinder lander (1996-068A)',
    publisher: 'NASA Space Science Data Coordinated Archive (NSSDCA)',
    url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A',
  },
  'nssdca-sojourner': {
    id: 'nssdca-sojourner',
    title: 'Mars Pathfinder Rover (Sojourner)',
    publisher: 'NASA Space Science Data Coordinated Archive (NSSDCA)',
    url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=MESURPR',
  },
  'nasa-m2020': {
    id: 'nasa-m2020',
    title: 'Mars 2020: Perseverance Rover',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/mars-2020-perseverance/',
  },
  'nasa-m2020-3d': {
    id: 'nasa-m2020-3d',
    title: 'Mars 2020 Perseverance Rover (3D model)',
    publisher: 'NASA Science / JPL-Caltech',
    url: 'https://science.nasa.gov/3d-resources/mars-2020-perseverance-rover/',
  },
  'nasa-m2020-instruments': {
    id: 'nasa-m2020-instruments',
    title: 'Perseverance Science Instruments',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/',
  },
  'nasa-m2020-components': {
    id: 'nasa-m2020-components',
    title: 'Perseverance Rover Components',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/mars-2020-perseverance/rover-components/',
  },
  'nssdca-m2020': {
    id: 'nssdca-m2020',
    title: 'Mars 2020 Perseverance Rover (2020-052A)',
    publisher: 'NASA Space Science Data Coordinated Archive (NSSDCA)',
    url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2020-052A',
  },
  'nasa-ingenuity': {
    id: 'nasa-ingenuity',
    title: 'Ingenuity Mars Helicopter',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/',
  },
  'nasa-moxie': {
    id: 'nasa-moxie',
    title: "NASA's Oxygen-Generating Experiment MOXIE Completes Mars Mission",
    publisher: 'NASA',
    url: 'https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/',
  },
  'nasa-m2020-sounds': {
    id: 'nasa-m2020-sounds',
    title: 'Sounds of Mars',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/mars-2020-perseverance/sounds-of-mars/',
  },
  'nasa-m2020-names': {
    id: 'nasa-m2020-names',
    title: 'Nearly 11 Million Names of Earthlings Are on Mars Perseverance',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/missions/mars-2020-perseverance/nearly-11-million-names-of-earthlings-are-on-mars-perseverance/',
  },
  'nasa-m2020-gems': {
    id: 'nasa-m2020-gems',
    title: "5 Hidden Gems Are Riding Aboard NASA's Perseverance Rover",
    publisher: 'NASA Jet Propulsion Laboratory',
    url: 'https://www.nasa.gov/centers-and-facilities/jpl/5-hidden-gems-are-riding-aboard-nasas-perseverance-rover/',
  },
  'nasa-m2020-depot': {
    id: 'nasa-m2020-depot',
    title: 'The Role of a Rover, a Lander, and Helicopters in the Unique Shape of the First Sample Depot on Mars',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/missions/mars-2020-perseverance/the-role-of-a-rover-a-lander-and-helicopters-in-the-unique-shape-of-the-first-sample-depot-on-mars/',
  },
  'jpl-m2020-rim': {
    id: 'jpl-m2020-rim',
    title: "NASA's Perseverance Rover Reaches Top of Jezero Crater Rim",
    publisher: 'NASA Jet Propulsion Laboratory',
    url: 'https://www.jpl.nasa.gov/news/nasas-perseverance-rover-reaches-top-of-jezero-crater-rim/',
  },
  'jpl-m2020-biosignature': {
    id: 'jpl-m2020-biosignature',
    title: 'NASA Says Mars Rover Discovered Potential Biosignature Last Year',
    publisher: 'NASA Jet Propulsion Laboratory',
    url: 'https://www.jpl.nasa.gov/news/nasa-says-mars-rover-discovered-potential-biosignature-last-year/',
  },
  'spaceapps-challenge': {
    id: 'spaceapps-challenge',
    title: "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment",
    publisher: 'NASA Space Apps Challenge 2026',
    url: 'https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/',
  },
};

export const NON_ENDORSEMENT =
  'NASA does not endorse any non-U.S. Government entity and is not responsible for information contained on non-U.S. Government websites.';
