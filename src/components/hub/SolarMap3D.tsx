import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, Text, Sparkles, Float, PerspectiveCamera, Ring } from '@react-three/drei';
import { useRef, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import * as THREE from 'three';
import type { DestinationId } from '../../data/types';
import { useT } from '../../i18n/useT';
import { DESTINATIONS } from '../../data';
import { SpaceEffects } from './SpaceEffects';

// Constants pour les positions orbitales
const ORBITAL_SPEEDS = {
  earth: 0.0001,
  mars: 0.00008,
};

// Composant Soleil avec effet volumétrique et animation
function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef1 = useRef<THREE.Mesh>(null);
  const glowRef2 = useRef<THREE.Mesh>(null);
  const flareRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animation de rotation lente
    if (sunRef.current) {
      sunRef.current.rotation.y = time * 0.05;
    }
    
    // Pulsation des couches de lueur
    if (glowRef1.current) {
      glowRef1.current.scale.setScalar(1 + Math.sin(time * 0.8) * 0.05);
    }
    if (glowRef2.current) {
      glowRef2.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.08);
    }
    
    // Animation des éruptions solaires
    if (flareRef.current) {
      flareRef.current.rotation.z = time * 0.3;
      const material = flareRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.6 + Math.sin(time * 2) * 0.2;
    }
  });
  
  return (
    <group>
      {/* Noyau du soleil */}
      <Sphere ref={sunRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#FFF6DC" />
      </Sphere>
      
      {/* Éruptions solaires */}
      <Sphere ref={flareRef} args={[2.2, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#FFAA33"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </Sphere>
      
      {/* Couche atmosphérique externe */}
      <Sphere ref={glowRef1} args={[2.8, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#FFB547"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Lueur externe volumétrique */}
      <Sphere ref={glowRef2} args={[4, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#FF8A1F"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Couronne solaire */}
      <Sphere args={[5.5, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Lumières dynamiques */}
      <pointLight position={[0, 0, 0]} intensity={3} distance={100} color="#FFFFFF" />
      <pointLight position={[0, 0, 0]} intensity={1.5} distance={50} color="#FFB547" />
      
      {/* Particules de plasma solaire */}
      <Sparkles
        count={200}
        scale={6}
        size={4}
        speed={0.2}
        color="#FFDD77"
      />
    </group>
  );
}

// Composant Planète avec animations avancées
interface PlanetProps {
  position: [number, number, number];
  size: number;
  color: string;
  emissive?: string;
  name: string;
  orbitRadius: number;
  orbitSpeed: number;
  onClick?: () => void;
  selected?: boolean;
}

function Planet({ position, size, color, emissive = '#000000', name, orbitRadius, orbitSpeed, onClick, selected }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Animation de rotation et orbite avec useFrame
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y += orbitSpeed;
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={position}>
        {/* Halo de sélection avec animation */}
        {(selected || hovered) && (
          <Sphere args={[size * 2.2, 32, 32]}>
            <meshBasicMaterial
              color={selected ? '#FFB547' : '#FFFFFF'}
              transparent
              opacity={selected ? 0.25 : 0.1}
              side={THREE.BackSide}
            />
          </Sphere>
        )}
        
        {/* Anneaux de sélection pulsants */}
        {selected && (
          <>
            <Ring args={[size * 1.8, size * 1.9, 32]} rotation={[Math.PI / 2, 0, 0]}>
              <meshBasicMaterial color="#FFB547" transparent opacity={0.6} side={THREE.DoubleSide} />
            </Ring>
            <Ring args={[size * 2.2, size * 2.3, 32]} rotation={[Math.PI / 2, 0, 0]}>
              <meshBasicMaterial color="#FFB547" transparent opacity={0.4} side={THREE.DoubleSide} />
            </Ring>
          </>
        )}
        
        {/* Planète avec effet de flottement */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <Sphere
            ref={meshRef}
            args={[size, 64, 64]}
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(true);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHovered(false);
              document.body.style.cursor = 'default';
            }}
          >
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={selected ? 0.6 : hovered ? 0.4 : 0.2}
              metalness={0.3}
              roughness={0.7}
            />
          </Sphere>
        </Float>
        
        {/* Atmosphère */}
        <Sphere args={[size * 1.05, 32, 32]}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </Sphere>
        
        {/* Effet de particules autour de la planète */}
        {selected && (
          <Sparkles
            count={80}
            scale={size * 3.5}
            size={3}
            speed={0.4}
            color="#FFB547"
          />
        )}
        
        {/* Nom de la planète */}
        <Text
          position={[0, size + 0.8, 0]}
          fontSize={hovered || selected ? 0.45 : 0.4}
          color={selected ? '#FFB547' : hovered ? '#FFFFFF' : '#E0E0E0'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
          fontWeight="bold"
        >
          {name}
        </Text>
      </group>
      
      {/* Ligne d'orbite améliorée */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 128]} />
        <meshBasicMaterial
          color={selected ? '#FFB547' : '#FFFFFF'}
          transparent
          opacity={selected ? 0.3 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Points lumineux sur l'orbite */}
      {selected && (
        <Sparkles
          count={20}
          scale={[orbitRadius * 2, 0.1, orbitRadius * 2]}
          size={2}
          speed={0.2}
          color="#FFB547"
        />
      )}
    </group>
  );
}

// Composant Lune avec orbite autour de la Terre
function Moon({ earthPosition, selected, onClick }: { earthPosition: [number, number, number]; selected: boolean; onClick: () => void }) {
  const moonRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const moonOrbitRadius = 1.2;
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (moonRef.current) {
      const angle = time * 0.5;
      moonRef.current.position.x = earthPosition[0] + Math.cos(angle) * moonOrbitRadius;
      moonRef.current.position.z = earthPosition[2] + Math.sin(angle) * moonOrbitRadius;
    }
  });
  
  return (
    <group ref={moonRef} position={[earthPosition[0], earthPosition[1], earthPosition[2]]}>
      {/* Halo de sélection */}
      {(selected || hovered) && (
        <Sphere args={[0.5, 32, 32]}>
          <meshBasicMaterial
            color={selected ? '#FFB547' : '#FFFFFF'}
            transparent
            opacity={selected ? 0.25 : 0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
      
      {/* Anneaux de sélection */}
      {selected && (
        <>
          <Ring args={[0.45, 0.5, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color="#FFB547" transparent opacity={0.6} side={THREE.DoubleSide} />
          </Ring>
          <Ring args={[0.6, 0.65, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color="#FFB547" transparent opacity={0.4} side={THREE.DoubleSide} />
          </Ring>
        </>
      )}
      
      {/* Lune */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <Sphere
          args={[0.25, 32, 32]}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'default';
          }}
        >
          <meshStandardMaterial
            color="#C9CCD3"
            emissive={selected ? '#C9CCD3' : '#000000'}
            emissiveIntensity={selected ? 0.4 : hovered ? 0.2 : 0}
            metalness={0.1}
            roughness={0.9}
          />
        </Sphere>
      </Float>
      
      {/* Particules autour de la lune */}
      {selected && (
        <Sparkles
          count={40}
          scale={1}
          size={2}
          speed={0.3}
          color="#FFB547"
        />
      )}
      
      {/* Nom */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={hovered || selected ? 0.35 : 0.3}
        color={selected ? '#FFB547' : hovered ? '#FFFFFF' : '#C9CCD3'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        fontWeight="bold"
      >
        LUNE
      </Text>
    </group>
  );
}

// Composant Pioneer 10 (Deep Space) avec trajectoire
function Pioneer10({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const pioneer10Position: [number, number, number] = [25, 3, -15];
  
  // Créer la trajectoire de Pioneer 10 (de la Terre vers l'espace profond)
  const trajectoryPoints = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(8, 0, -3),      // Départ de la Terre
      new THREE.Vector3(12, 1, -5),     // Passe près de Mars
      new THREE.Vector3(18, 2, -10),    // Trajectoire intermédiaire
      new THREE.Vector3(25, 3, -15),    // Arrive en espace profond
    ]);
    
    return curve.getPoints(50);
  }, []);
  
  return (
    <>
      {/* Trajectoire de Pioneer 10 */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={trajectoryPoints.length}
            array={new Float32Array(trajectoryPoints.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={selected ? '#7FE7F2' : '#4A9EFF'}
          transparent
          opacity={selected ? 0.6 : 0.3}
          linewidth={2}
        />
      </line>
      
      {/* Points lumineux le long de la trajectoire */}
      {selected && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={trajectoryPoints.length}
              array={new Float32Array(trajectoryPoints.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.1}
            color="#7FE7F2"
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>
      )}
      
      {/* Pioneer 10 au bout de la trajectoire */}
      <group position={pioneer10Position}>
        {(selected || hovered) && (
          <Sphere args={[1.5, 32, 32]}>
            <meshBasicMaterial
              color="#FFB547"
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </Sphere>
        )}
        
        {/* Anneaux de sélection */}
        {selected && (
          <>
            <Ring args={[1, 1.1, 32]} rotation={[Math.PI / 2, 0, 0]}>
              <meshBasicMaterial color="#7FE7F2" transparent opacity={0.6} side={THREE.DoubleSide} />
            </Ring>
            <Ring args={[1.3, 1.4, 32]} rotation={[Math.PI / 2, 0, 0]}>
              <meshBasicMaterial color="#7FE7F2" transparent opacity={0.4} side={THREE.DoubleSide} />
            </Ring>
          </>
        )}
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(true);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHovered(false);
              document.body.style.cursor = 'default';
            }}
          >
            {/* Représentation simple du Pioneer 10 */}
            <mesh>
              <boxGeometry args={[0.3, 0.1, 0.3]} />
              <meshStandardMaterial
                color="#7FE7F2"
                emissive="#7FE7F2"
                emissiveIntensity={selected ? 0.8 : hovered ? 0.5 : 0.3}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* Antenne */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
              <meshStandardMaterial color="#7FE7F2" metalness={0.8} />
            </mesh>
            
            {/* Parabole */}
            <mesh position={[0.15, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.15, 0.05, 16]} />
              <meshStandardMaterial color="#7FE7F2" metalness={0.6} />
            </mesh>
          </group>
        </Float>
        
        {selected && (
          <Sparkles
            count={100}
            scale={4}
            size={3}
            speed={0.5}
            color="#7FE7F2"
          />
        )}
        
        <Text
          position={[0, 1.5, 0]}
          fontSize={hovered || selected ? 0.4 : 0.35}
          color={selected ? '#FFB547' : hovered ? '#FFFFFF' : '#7FE7F2'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          fontWeight="bold"
        >
          ESPACE PROFOND
        </Text>
        
        <Text
          position={[0, 1.1, 0]}
          fontSize={0.2}
          color="#8089A5"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          Pioneer 10 → Aldébaran
        </Text>
      </group>
    </>
  );
}

// Composant Ceinture d'astéroïdes
function AsteroidBelt() {
  const count = 800;
  const radius = 12;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 2;
      const y = (Math.random() - 0.5) * 0.5;
      
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);
  
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#C9A27A"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Scène 3D principale
function Scene({ selected, onSelect }: { selected: DestinationId; onSelect: (d: DestinationId) => void }) {
  const earthPosition: [number, number, number] = [8, 0, -3];
  const marsPosition: [number, number, number] = [10, 0, 8];
  
  return (
    <>
      {/* Caméra avec position initiale optimale */}
      <PerspectiveCamera makeDefault position={[15, 12, 15]} fov={60} />
      
      {/* Contrôles orbitaux */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
      
      {/* Arrière-plan étoilé */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      {/* Soleil */}
      <Sun />
      
      {/* Terre */}
      <Planet
        position={earthPosition}
        size={0.8}
        color="#4A90E2"
        emissive="#1D4FA3"
        name="TERRE"
        orbitRadius={8.5}
        orbitSpeed={ORBITAL_SPEEDS.earth}
        selected={false}
      />
      
      {/* Lune */}
      <Moon earthPosition={earthPosition} selected={selected === 'moon'} onClick={() => onSelect('moon')} />
      
      {/* Mars */}
      <Planet
        position={marsPosition}
        size={0.7}
        color="#E07A3F"
        emissive="#A13A12"
        name="MARS"
        orbitRadius={12.8}
        orbitSpeed={ORBITAL_SPEEDS.mars}
        onClick={() => onSelect('mars')}
        selected={selected === 'mars'}
      />
      
      {/* Ceinture d'astéroïdes */}
      <AsteroidBelt />
      
      {/* Pioneer 10 */}
      <Pioneer10
        selected={selected === 'deep-space'}
        onClick={() => onSelect('deep-space')}
      />
      
      {/* Lumière ambiante douce */}
      <ambientLight intensity={0.1} />
      
      {/* Brouillard spatial pour la profondeur */}
      <fog attach="fog" args={['#05070D', 30, 80]} />
      
      {/* Effets spatiaux immersifs */}
      <SpaceEffects />
    </>
  );
}

/** Carte 3D immersive du système solaire */
export function SolarMap3D({ selected, onSelect }: { selected: DestinationId; onSelect: (d: DestinationId) => void }) {
  const { t } = useT();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="h-full w-full"
      aria-label={t('mapLabel')}
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <Scene selected={selected} onSelect={onSelect} />
      </Canvas>
      
      {/* Instructions de navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-black/50 px-4 py-2 text-xs text-white/70 backdrop-blur-sm">
        🖱️ Cliquez + Glissez pour tourner | 🔍 Molette pour zoomer | Cliquez sur les planètes
      </div>
    </motion.div>
  );
}
