/**
 * Team shown on the Sources & credits page.
 */
import type { L10n } from './types';

export interface TeamMember {
  firstName: string;
  fullName: string;
  role: L10n;
  focus: L10n;
  lead?: boolean;
  link?: string;
}

const t = (en: string, fr: string): L10n => ({ en, fr });

export const TEAM: TeamMember[] = [
  {
    firstName: 'Siga',
    fullName: 'Siga Séne',
    lead: true,
    role: t('Team lead · 3D & voice', 'Direction d’équipe · 3D & voix'),
    focus: t('3D models, narration and the 30-second video', 'Modèles 3D, narration et vidéo de 30 secondes'),
  },
  {
    firstName: 'Aliou',
    fullName: 'Aliou Dramé',
    lead: true,
    role: t('Lead development', 'Développement principal'),
    focus: t('Web app, 3D engine and deployment', 'Application web, moteur 3D et mise en ligne'),
  },
  {
    firstName: 'Rokheya',
    fullName: 'Rokheya Hane',
    role: t('Front-end development', 'Développement front-end'),
    focus: t('Interface, mobile layout and accessibility', 'Interface, affichage mobile et accessibilité'),
  },
  {
    firstName: 'Cheikhouna',
    fullName: 'Cheikhouna Diop',
    role: t('Aerospace & storytelling', 'Aérospatial & récit'),
    focus: t('Mission facts and the machines’ stories', 'Faits des missions et histoires des machines'),
  },
  {
    firstName: 'Mouhamed',
    fullName: 'Mouhamed Diop',
    role: t('Robotics & 3D', 'Robotique & 3D'),
    focus: t('How the rovers work, CAD models', 'Fonctionnement des rovers, modèles CAO'),
  },
  {
    firstName: 'Ibrahima',
    fullName: 'Ibrahima Diaby',
    role: t('Telecommunications', 'Télécommunications'),
    focus: t('Radio links, signal delays and the “Send a signal” game', 'Liaisons radio, délais du signal et le jeu « Envoyer un signal »'),
  },
];
