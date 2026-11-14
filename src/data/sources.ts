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
  'spaceapps-challenge': {
    id: 'spaceapps-challenge',
    title: "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment",
    publisher: 'NASA Space Apps Challenge 2026',
    url: 'https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/',
  },
};

export const NON_ENDORSEMENT =
  'NASA does not endorse any non-U.S. Government entity and is not responsible for information contained on non-U.S. Government websites.';
