import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Composant pour créer des nuages de poussière cosmique
 */
export function CosmicDust({ count = 2000 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Position aléatoire dans une sphère
      const radius = 30 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Couleurs variées (bleu, violet, orange)
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0.5 + Math.random() * 0.5; // R
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.3; // G
        colors[i * 3 + 2] = 1; // B
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.8 + Math.random() * 0.2; // R
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.3; // G
        colors[i * 3 + 2] = 1; // B
      } else {
        colors[i * 3] = 1; // R
        colors[i * 3 + 1] = 0.6 + Math.random() * 0.4; // G
        colors[i * 3 + 2] = 0.3 + Math.random() * 0.3; // B
      }
    }
    
    return { positions, colors };
  }, [count]);
  
  useFrame((state) => {
    if (points.current) {
      const time = state.clock.getElapsedTime();
      points.current.rotation.y = time * 0.02;
      points.current.rotation.x = Math.sin(time * 0.01) * 0.1;
    }
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particlesPosition.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        transparent
        opacity={0.6}
        vertexColors
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Composant pour créer des rayons lumineux du soleil
 */
export function SunRays() {
  const raysRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (raysRef.current) {
      const time = state.clock.getElapsedTime();
      raysRef.current.rotation.z = time * 0.1;
    }
  });
  
  const rays = useMemo(() => {
    const rayElements = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      rayElements.push(
        <mesh key={i} position={[Math.cos(angle) * 3, Math.sin(angle) * 3, 0]} rotation={[0, 0, angle]}>
          <planeGeometry args={[0.3, 8]} />
          <meshBasicMaterial
            color="#FFB547"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      );
    }
    return rayElements;
  }, []);
  
  return <group ref={raysRef}>{rays}</group>;
}

/**
 * Composant pour créer des météorites occasionnels
 */
export function ShootingStars() {
  const starsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (starsRef.current) {
      const time = state.clock.getElapsedTime();
      // Faire bouger les étoiles filantes de temps en temps
      starsRef.current.children.forEach((star, i) => {
        const offset = i * 3.7;
        const cycle = (time + offset) % 10;
        if (cycle < 2) {
          star.position.x = -30 + cycle * 30;
          star.position.y = 10 + Math.sin(cycle * 3) * 5;
          star.position.z = -20 + i * 2;
          star.visible = true;
        } else {
          star.visible = false;
        }
      });
    }
  });
  
  return (
    <group ref={starsRef}>
      {[...Array(3)].map((_, i) => (
        <mesh key={i} visible={false}>
          <boxGeometry args={[2, 0.05, 0.05]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.8}
            emissive="#FFFFFF"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Composant pour créer une nébuleuse lointaine
 */
export function DistantNebula() {
  const nebulaRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (nebulaRef.current) {
      const time = state.clock.getElapsedTime();
      nebulaRef.current.rotation.z = time * 0.03;
      const material = nebulaRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + Math.sin(time * 0.5) * 0.05;
    }
  });
  
  return (
    <mesh ref={nebulaRef} position={[-40, 15, -60]}>
      <planeGeometry args={[30, 30]} />
      <meshBasicMaterial
        color="#8B4FFF"
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Composant pour créer des anneaux de lumière autour des planètes
 */
export function PlanetGlow({ position, size, color }: { position: [number, number, number]; size: number; color: string }) {
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (glowRef.current) {
      const time = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 2) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
  });
  
  return (
    <mesh ref={glowRef} position={position}>
      <sphereGeometry args={[size * 1.3, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.08}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Composant pour créer des lignes de connexion entre les planètes
 */
export function ConnectionLines() {
  const linesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (linesRef.current) {
      const time = state.clock.getElapsedTime();
      linesRef.current.children.forEach((line, i) => {
        const material = (line as THREE.Line).material as THREE.LineBasicMaterial;
        material.opacity = 0.05 + Math.sin(time + i) * 0.03;
      });
    }
  });
  
  const lines = useMemo(() => {
    const lineElements = [];
    const positions = [
      { start: [0, 0, 0], end: [8, 0, -3] }, // Soleil -> Terre
      { start: [8, 0, -3], end: [10, 0, 8] }, // Terre -> Mars
      { start: [10, 0, 8], end: [25, 3, -15] }, // Mars -> Deep Space
    ];
    
    positions.forEach((pos, i) => {
      const points = [];
      points.push(new THREE.Vector3(pos.start[0], pos.start[1], pos.start[2]));
      points.push(new THREE.Vector3(pos.end[0], pos.end[1], pos.end[2]));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      lineElements.push(
        <line key={i} geometry={geometry}>
          <lineBasicMaterial
            color="#4A9EFF"
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
          />
        </line>
      );
    });
    
    return lineElements;
  }, []);
  
  return <group ref={linesRef}>{lines}</group>;
}

/**
 * Composant principal qui combine tous les effets
 */
export function SpaceEffects() {
  return (
    <>
      <CosmicDust count={2000} />
      <SunRays />
      <ShootingStars />
      <DistantNebula />
      <ConnectionLines />
    </>
  );
}
