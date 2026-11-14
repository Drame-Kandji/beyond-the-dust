import * as THREE from 'three';

/** Shared PBR materials for the procedural models. Parts clone them on registration. */
const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p);

export const M = {
  aluminium: std({ color: '#c9ccd3', metalness: 0.85, roughness: 0.38 }),
  darkMetal: std({ color: '#3a3f4a', metalness: 0.7, roughness: 0.5 }),
  steelMesh: std({ color: '#9aa0a8', metalness: 0.9, roughness: 0.45, wireframe: false }),
  titanium: std({ color: '#b5b0a6', metalness: 0.8, roughness: 0.35 }),
  gold: std({ color: '#d4a64a', metalness: 1, roughness: 0.28, emissive: '#3a2600', emissiveIntensity: 0.15 }),
  goldFoil: std({ color: '#c9973a', metalness: 0.95, roughness: 0.42 }),
  white: std({ color: '#e9e6df', metalness: 0.1, roughness: 0.6 }),
  offWhite: std({ color: '#d8d2c4', metalness: 0.15, roughness: 0.7 }),
  black: std({ color: '#15171c', metalness: 0.3, roughness: 0.6 }),
  solar: std({ color: '#1a2a5e', metalness: 0.6, roughness: 0.25, emissive: '#0a1640', emissiveIntensity: 0.25 }),
  solarFrame: std({ color: '#7d828c', metalness: 0.8, roughness: 0.4 }),
  lens: std({ color: '#0b0f18', metalness: 0.2, roughness: 0.05, emissive: '#2a4a7a', emissiveIntensity: 0.4 }),
  orange: std({ color: '#c96a2b', metalness: 0.3, roughness: 0.6 }),
  rtg: std({ color: '#5a5e66', metalness: 0.75, roughness: 0.45 }),
  rtgFins: std({ color: '#7b7f88', metalness: 0.8, roughness: 0.4 }),
  seat: std({ color: '#5c6b7a', metalness: 0.2, roughness: 0.8 }),
  internal: std({ color: '#7fe7f2', metalness: 0.2, roughness: 0.4, emissive: '#2bb6c4', emissiveIntensity: 0.6 }),
};
