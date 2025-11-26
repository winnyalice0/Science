import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import * as THREE from "three";

interface MicroscopeParticle {
  id: string;
  name: string;
  size: number;
  color: string;
  type: "cell" | "bacteria" | "virus" | "dna" | "protein" | "mitochondria" | "ribosome" | "chromosome";
  scale: number;
  rotationSpeed: number;
}

interface MicroscopeProps {
  particles: MicroscopeParticle[];
  zoomLevel: number;
  isRunning?: boolean;
  backgroundColor?: string;
}

export type { MicroscopeParticle, MicroscopeProps };

// Individual particle component
function ParticleObject({ particle }: { particle: MicroscopeParticle }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current && particle.rotationSpeed > 0) {
      meshRef.current.rotation.x += particle.rotationSpeed * 0.01;
      meshRef.current.rotation.y += particle.rotationSpeed * 0.015;
    }
  });

  const renderParticle = () => {
    switch (particle.type) {
      case "cell":
        return (
          <mesh ref={meshRef} scale={particle.scale}>
            <sphereGeometry args={[particle.size, 32, 32]} />
            <meshPhongMaterial
              color={particle.color}
              emissive={particle.color}
              emissiveIntensity={0.3}
              wireframe={false}
              transparent={true}
              opacity={0.8}
            />
            {/* Cell nucleus */}
            <mesh position={[0, 0, 0.3]}>
              <sphereGeometry args={[particle.size * 0.4, 16, 16]} />
              <meshPhongMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.5} />
            </mesh>
          </mesh>
        );

      case "bacteria":
        return (
          <mesh ref={meshRef} scale={particle.scale}>
            <cylinderGeometry args={[particle.size * 0.3, particle.size * 0.3, particle.size * 2, 16]} />
            <meshPhongMaterial
              color={particle.color}
              emissive={particle.color}
              emissiveIntensity={0.4}
              wireframe={false}
            />
            {/* Flagella */}
            <mesh position={[particle.size, 0, 0]}>
              <tubeGeometry args={[
                new THREE.CatmullRomCurve3([
                  new THREE.Vector3(0, 0, 0),
                  new THREE.Vector3(particle.size * 1.5, particle.size * 0.5, 0),
                  new THREE.Vector3(particle.size * 2, particle.size * 1.5, 0),
                ]),
                20,
                particle.size * 0.1,
                8,
                false,
              ]} />
              <meshPhongMaterial color={particle.color} />
            </mesh>
          </mesh>
        );

      case "virus":
        return (
          <mesh ref={meshRef} scale={particle.scale}>
            <icosahedronGeometry args={[particle.size, 4]} />
            <meshPhongMaterial
              color={particle.color}
              emissive={particle.color}
              emissiveIntensity={0.6}
              wireframe={false}
            />
          </mesh>
        );

      case "dna":
        return (
          <group ref={meshRef} scale={particle.scale}>
            {/* Double helix structure */}
            {[...Array(20)].map((_, i) => {
              const angle = (i / 20) * Math.PI * 2;
              const y = (i / 20) * particle.size * 2 - particle.size;
              return (
                <mesh key={i} position={[Math.cos(angle) * particle.size, y, Math.sin(angle) * particle.size * 0.5]}>
                  <sphereGeometry args={[particle.size * 0.2, 8, 8]} />
                  <meshPhongMaterial color={i % 2 === 0 ? "#0099ff" : "#ff0099"} emissive="#ffffff" emissiveIntensity={0.3} />
                </mesh>
              );
            })}
          </group>
        );

      case "protein":
        return (
          <mesh ref={meshRef} scale={particle.scale}>
            <tetrahedronGeometry args={[particle.size]} />
            <meshPhongMaterial
              color={particle.color}
              emissive={particle.color}
              emissiveIntensity={0.5}
              wireframe={false}
            />
          </mesh>
        );

      case "mitochondria":
        return (
          <group ref={meshRef} scale={particle.scale}>
            {/* Outer membrane */}
            <mesh>
              <capsuleGeometry args={[particle.size * 0.5, particle.size * 1.5, 8, 16]} />
              <meshPhongMaterial
                color={particle.color}
                emissive={particle.color}
                emissiveIntensity={0.4}
                transparent={true}
                opacity={0.7}
              />
            </mesh>
            {/* Inner structure */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[particle.size * 0.3, particle.size * 0.3, particle.size, 16]} />
              <meshPhongMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.3} />
            </mesh>
          </group>
        );

      case "ribosome":
        return (
          <mesh ref={meshRef} scale={particle.scale}>
            <torusGeometry args={[particle.size, particle.size * 0.4, 16, 32]} />
            <meshPhongMaterial
              color={particle.color}
              emissive={particle.color}
              emissiveIntensity={0.5}
              wireframe={false}
            />
          </mesh>
        );

      case "chromosome":
        return (
          <group ref={meshRef} scale={particle.scale}>
            {/* X-shaped chromosome */}
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[particle.size * 2, particle.size * 0.3, particle.size * 0.3]} />
              <meshPhongMaterial
                color={particle.color}
                emissive={particle.color}
                emissiveIntensity={0.5}
                wireframe={false}
              />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]}>
              <boxGeometry args={[particle.size * 2, particle.size * 0.3, particle.size * 0.3]} />
              <meshPhongMaterial
                color={particle.color}
                emissive={particle.color}
                emissiveIntensity={0.5}
                wireframe={false}
              />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh ref={meshRef} scale={particle.scale}>
            <sphereGeometry args={[particle.size, 16, 16]} />
            <meshPhongMaterial color={particle.color} />
          </mesh>
        );
    }
  };

  return renderParticle();
}

export function MicroscopeViewer({ particles, zoomLevel, isRunning, backgroundColor = "#001a4d" }: MicroscopeProps) {
  return (
    <div className="w-full h-full relative bg-black rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, zoomLevel], fov: 50 }}>
        <PerspectiveCamera makeDefault position={[0, 0, zoomLevel]} fov={50} />
        <color attach="background" args={[backgroundColor]} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, 10]} intensity={0.8} />
        <pointLight position={[0, 0, 15]} intensity={0.6} color="#0099ff" />

        {/* Grid background */}
        <gridHelper args={[100, 20, "#1a4d7a", "#0d2847"]} position={[0, -50, 0]} />

        {/* Particles */}
        {particles.map(particle => (
          <ParticleObject key={particle.id} particle={particle} />
        ))}

        {/* OrbitControls for rotation */}
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>

      {/* Microscope HUD */}
      <div className="absolute top-4 left-4 bg-black/70 text-cyan-400 font-mono text-xs p-3 rounded border border-cyan-400/50 space-y-1">
        <div>MICROSCOPE: ACTIVE</div>
        <div>ZOOM: {zoomLevel.toFixed(1)}x</div>
        <div>PARTICLES: {particles.length}</div>
        <div>STATUS: {isRunning ? "RUNNING" : "IDLE"}</div>
      </div>

      {/* Resolution indicator */}
      <div className="absolute bottom-4 right-4 bg-black/70 text-cyan-400 font-mono text-xs p-3 rounded border border-cyan-400/50">
        <div>1μm = 1 unit</div>
        <div>Magnification: {Math.round(zoomLevel * 100)}%</div>
      </div>
    </div>
  );
}

export default MicroscopeViewer;
