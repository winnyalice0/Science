import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, PointLight, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface ExplosionParams {
  intensity: number; // 0-1
  radius: number; // meters
  position: [number, number, number];
  fireIntensity: number;
  smokeAmount: number;
}

interface Particle {
  position: [number, number, number];
  velocity: [number, number, number];
  life: number;
  maxLife: number;
  size: number;
  type: "debris" | "spark" | "smoke";
  color: string;
}

// Explosion particle generator
function ParticleSystem({ explosionParams }: { explosionParams: ExplosionParams }) {
  const particlesRef = useRef<Particle[]>([]);
  const meshRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Initialize particles on explosion
  useEffect(() => {
    const newParticles: Particle[] = [];
    const particleCount = Math.round(100 * explosionParams.intensity);

    // Debris particles (brown/gray)
    for (let i = 0; i < particleCount * 0.4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const elevation = Math.random() * Math.PI;
      const velocity = 15 + Math.random() * 20;

      newParticles.push({
        position: [...explosionParams.position] as [number, number, number],
        velocity: [
          Math.sin(elevation) * Math.cos(angle) * velocity,
          Math.sin(elevation) * Math.sin(angle) * velocity,
          Math.cos(elevation) * velocity,
        ],
        life: 0,
        maxLife: 2000 + Math.random() * 1000,
        size: 0.1 + Math.random() * 0.3,
        type: "debris",
        color: Math.random() > 0.5 ? "#8B4513" : "#666666",
      });
    }

    // Spark particles (bright yellow/orange)
    for (let i = 0; i < particleCount * 0.3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const elevation = Math.random() * Math.PI * 0.7;
      const velocity = 20 + Math.random() * 30;

      newParticles.push({
        position: [...explosionParams.position] as [number, number, number],
        velocity: [
          Math.sin(elevation) * Math.cos(angle) * velocity,
          Math.sin(elevation) * Math.sin(angle) * velocity,
          Math.cos(elevation) * velocity,
        ],
        life: 0,
        maxLife: 1500 + Math.random() * 500,
        size: 0.05 + Math.random() * 0.15,
        type: "spark",
        color: Math.random() > 0.5 ? "#FFD700" : "#FFA500",
      });
    }

    // Smoke particles (gray/white)
    for (let i = 0; i < particleCount * 0.3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const elevation = Math.random() * Math.PI * 0.5;
      const velocity = 5 + Math.random() * 15;

      newParticles.push({
        position: [...explosionParams.position] as [number, number, number],
        velocity: [
          Math.sin(elevation) * Math.cos(angle) * velocity,
          Math.sin(elevation) * Math.sin(angle) * velocity + 2,
          Math.cos(elevation) * velocity,
        ],
        life: 0,
        maxLife: 3000 + Math.random() * 1500,
        size: 0.3 + Math.random() * 0.8,
        type: "smoke",
        color: "#999999",
      });
    }

    particlesRef.current = newParticles;
    setParticles(newParticles);
  }, [explosionParams]);

  useFrame(() => {
    particlesRef.current.forEach((particle) => {
      particle.life += 16; // ~60fps
      const lifeRatio = particle.life / particle.maxLife;

      // Update position
      particle.position[0] += particle.velocity[0] * 0.016;
      particle.position[1] += particle.velocity[1] * 0.016;
      particle.position[2] += particle.velocity[2] * 0.016;

      // Apply gravity to debris and sparks
      if (particle.type !== "smoke") {
        particle.velocity[1] -= 9.8 * 0.016; // gravity
      }

      // Fade out particles
      if (lifeRatio > 0.8) {
        particle.velocity[0] *= 0.95;
        particle.velocity[1] *= 0.95;
        particle.velocity[2] *= 0.95;
      }
    });

    // Remove dead particles
    particlesRef.current = particlesRef.current.filter(
      (p) => p.life < p.maxLife
    );

    if (meshRef.current && particlesRef.current.length > 0) {
      const geometry = meshRef.current.geometry as THREE.BufferGeometry;
      const positions = new Float32Array(particlesRef.current.length * 3);
      const colors = new Float32Array(particlesRef.current.length * 3);

      particlesRef.current.forEach((p, i) => {
        positions[i * 3] = p.position[0];
        positions[i * 3 + 1] = p.position[1];
        positions[i * 3 + 2] = p.position[2];

        const lifeRatio = p.life / p.maxLife;
        const colorHex = parseInt(p.color.substring(1), 16);
        const r = (colorHex >> 16) & 255;
        const g = (colorHex >> 8) & 255;
        const b = colorHex & 255;

        colors[i * 3] = r / 255 * (1 - lifeRatio * 0.5);
        colors[i * 3 + 1] = g / 255 * (1 - lifeRatio * 0.5);
        colors[i * 3 + 2] = b / 255 * (1 - lifeRatio * 0.5);
      });

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
    }

    setParticles([...particlesRef.current]);
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.length * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors={true}
        transparent={true}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Shockwave effect
function Shockwave({ explosionParams }: { explosionParams: ExplosionParams }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0.1);
  const [opacity, setOpacity] = useState(1);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const elapsed = clock.getElapsedTime() * 1000;
      const maxDuration = 500;

      if (elapsed < maxDuration) {
        const progress = elapsed / maxDuration;
        const newScale = 0.1 + progress * explosionParams.radius * 2;
        setScale(newScale);
        setOpacity(1 - progress);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={explosionParams.position}>
      <sphereGeometry args={[scale, 32, 32]} />
      <meshPhongMaterial
        color="#ffaa00"
        emissive="#ff6600"
        emissiveIntensity={0.5 * opacity}
        wireframe={false}
        transparent={true}
        opacity={opacity * 0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Blast light
function BlastLight({ explosionParams }: { explosionParams: ExplosionParams }) {
  const lightRef = useRef<THREE.Light>(null);
  const [intensity, setIntensity] = useState(2);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const elapsed = clock.getElapsedTime() * 1000;
      const maxDuration = 800;

      if (elapsed < maxDuration) {
        const progress = elapsed / maxDuration;
        const newIntensity = 2 * (1 - progress * progress);
        setIntensity(newIntensity);
      } else {
        setIntensity(0);
      }
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={explosionParams.position}
      intensity={intensity}
      distance={50}
      color="#ff9900"
    />
  );
}

// Main explosion effect component
export function ExplosionEffect({ params }: { params: ExplosionParams }) {
  const [showExplosion, setShowExplosion] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowExplosion(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!showExplosion) return null;

  return (
    <div className="absolute inset-0 bg-black/30 pointer-events-none">
      <Canvas
        className="w-full h-full"
        camera={{ position: [10, 10, 10], fov: 75 }}
      >
        <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={75} />
        <ambientLight intensity={0.5} />
        <BlastLight explosionParams={params} />
        <ParticleSystem explosionParams={params} />
        <Shockwave explosionParams={params} />
      </Canvas>
    </div>
  );
}

// Apparatus destruction effect
export interface ApparatusState {
  type: "beaker" | "test_tube" | "flask";
  position: [number, number, number];
  broken: boolean;
  crackIntensity: number;
}

function BrokenApparatus({ apparatus }: { apparatus: ApparatusState }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current && apparatus.broken) {
      const time = clock.getElapsedTime();
      // Wobble effect for broken glass
      meshRef.current.rotation.x = Math.sin(time * 5) * 0.1;
      meshRef.current.rotation.z = Math.cos(time * 5) * 0.1;
    }
  });

  const getGeometry = () => {
    switch (apparatus.type) {
      case "beaker":
        return <cylinderGeometry args={[0.5, 0.6, 1, 16]} />;
      case "test_tube":
        return <cylinderGeometry args={[0.2, 0.2, 1.5, 16]} />;
      case "flask":
        return <sphereGeometry args={[0.5, 16, 16]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={apparatus.position}>
      {getGeometry()}
      <meshPhongMaterial
        color="#ff6666"
        emissive="#ff3333"
        transparent={true}
        opacity={apparatus.broken ? 0.7 : 1}
        wireframe={apparatus.broken}
      />
    </mesh>
  );
}

export function ApparatusDestruction({ apparatus }: { apparatus: ApparatusState[] }) {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
      <ambientLight intensity={1} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      {apparatus.map((app, i) => (
        <BrokenApparatus key={i} apparatus={app} />
      ))}
    </Canvas>
  );
}
