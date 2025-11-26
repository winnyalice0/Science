import { useEffect, useRef } from "react";
import * as THREE from "three";

interface AdvancedApparatusProps {
  type: "bunsen_burner" | "tripod_stand" | "wire_gauze" | "heating_vessel" | "beaker_heated" | "round_flask" | "thermometer_holder";
  isHeating?: boolean;
  flameIntensity?: number; // 0-1
  smokeAmount?: number; // 0-1
  evaporationRate?: number; // 0-1
  temperature?: number;
  scale?: number;
}

export function AdvancedApparatus3D({
  type,
  isHeating = false,
  flameIntensity = 0,
  smokeAmount = 0,
  evaporationRate = 0,
  temperature = 25,
  scale = 1,
}: AdvancedApparatusProps) {
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!ref.current) return;
    const group = ref.current;
    group.clear();

    switch (type) {
      case "bunsen_burner":
        createBunsenBurner(group, isHeating, flameIntensity, scale);
        break;
      case "tripod_stand":
        createTripodStand(group, scale);
        break;
      case "wire_gauze":
        createWireGauze(group, temperature, scale);
        break;
      case "heating_vessel":
        createHeatingVessel(group, temperature, evaporationRate, scale);
        break;
      case "beaker_heated":
        createHeatedBeaker(group, isHeating, flameIntensity, evaporationRate, scale);
        break;
    }
  }, [type, isHeating, flameIntensity, smokeAmount, evaporationRate, temperature, scale]);

  return <group ref={ref} />;
}

function createBunsenBurner(
  group: THREE.Group,
  isHeating: boolean,
  flameIntensity: number,
  scale: number
) {
  // Base plate
  const baseGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 32);
  const baseMaterial = new THREE.MeshStandardMaterial({ color: "#444444" });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.scale.multiplyScalar(scale);
  group.add(base);

  // Vertical tube
  const tubeGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16);
  const tubeMaterial = new THREE.MeshStandardMaterial({ color: "#333333", metalness: 0.8 });
  const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
  tube.position.y = 0.7;
  tube.scale.multiplyScalar(scale);
  group.add(tube);

  // Heating cap/top
  const capGeometry = new THREE.CylinderGeometry(0.2, 0.15, 0.3, 16);
  const capMaterial = new THREE.MeshStandardMaterial({ color: "#222222", metalness: 0.9 });
  const cap = new THREE.Mesh(capGeometry, capMaterial);
  cap.position.y = 1.35;
  cap.scale.multiplyScalar(scale);
  group.add(cap);

  // Flame visualization
  if (isHeating && flameIntensity > 0) {
    // Inner blue flame
    const innerFlameGeometry = new THREE.ConeGeometry(0.15, 0.6, 16);
    const innerFlameMaterial = new THREE.MeshBasicMaterial({
      color: "#4169ff",
      transparent: true,
      opacity: 0.7 * flameIntensity,
      wireframe: false,
    });
    const innerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
    innerFlame.position.y = 1.5;
    innerFlame.scale.multiplyScalar(scale);
    group.add(innerFlame);

    // Outer orange flame
    const outerFlameGeometry = new THREE.ConeGeometry(0.25, 0.8, 16);
    const outerFlameMaterial = new THREE.MeshBasicMaterial({
      color: "#ff6600",
      transparent: true,
      opacity: 0.5 * flameIntensity,
    });
    const outerFlame = new THREE.Mesh(outerFlameGeometry, outerFlameMaterial);
    outerFlame.position.y = 1.55;
    outerFlame.scale.multiplyScalar(scale);
    group.add(outerFlame);

    // Flame particles (glow effect)
    const flameParticleGeometry = new THREE.BufferGeometry();
    const particleCount = Math.round(50 * flameIntensity);
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.3 * scale;
      positions[i * 3 + 1] = 1.3 + Math.random() * 0.8 * scale;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3 * scale;
    }

    flameParticleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const flameParticleMaterial = new THREE.PointsMaterial({
      color: 0xffff00,
      size: 0.05 * scale,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6 * flameIntensity,
    });
    const flameParticles = new THREE.Points(flameParticleGeometry, flameParticleMaterial);
    group.add(flameParticles);

    // Glowing effect
    const glowGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: "#ff6600",
      transparent: true,
      opacity: 0.2 * flameIntensity,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = 1.5;
    glow.scale.multiplyScalar(scale);
    group.add(glow);
  }
}

function createTripodStand(group: THREE.Group, scale: number) {
  // Three legs
  const legPositions = [
    [0.4, 0, 0],
    [-0.2, 0.35, 0],
    [-0.2, -0.35, 0],
  ];

  legPositions.forEach((pos) => {
    const legGeometry = new THREE.CylinderGeometry(0.03, 0.04, 0.8, 8);
    const legMaterial = new THREE.MeshStandardMaterial({
      color: "#666666",
      metalness: 0.6,
    });
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(pos[0] * scale, 0.4 * scale, pos[2] * scale);
    leg.rotation.z = 0.2;
    leg.scale.multiplyScalar(scale);
    group.add(leg);
  });

  // Top ring for holding
  const ringGeometry = new THREE.TorusGeometry(0.3, 0.03, 8, 16);
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: "#888888",
    metalness: 0.7,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.8 * scale;
  ring.scale.multiplyScalar(scale);
  group.add(ring);
}

function createWireGauze(group: THREE.Group, temperature: number, scale: number) {
  // Wire mesh grid
  const gridSize = 0.4;
  const wireThickness = 0.008;

  // Horizontal wires
  for (let i = 0; i < 6; i++) {
    const wireGeometry = new THREE.CylinderGeometry(wireThickness, wireThickness, gridSize, 8);
    const heatColor = temperature > 100 ? "#ff6600" : temperature > 50 ? "#ffcc00" : "#888888";
    const wireMaterial = new THREE.MeshStandardMaterial({
      color: heatColor,
      metalness: 0.8,
      emissive: temperature > 50 ? new THREE.Color(heatColor) : new THREE.Color(0x000000),
      emissiveIntensity: Math.min(temperature / 200, 0.5),
    });
    const wire = new THREE.Mesh(wireGeometry, wireMaterial);
    wire.position.y = (i - 2.5) * 0.1 * scale;
    wire.rotation.z = Math.PI / 2;
    wire.scale.multiplyScalar(scale);
    group.add(wire);
  }

  // Vertical wires
  for (let i = 0; i < 6; i++) {
    const wireGeometry = new THREE.CylinderGeometry(wireThickness, wireThickness, gridSize, 8);
    const heatColor = temperature > 100 ? "#ff6600" : temperature > 50 ? "#ffcc00" : "#888888";
    const wireMaterial = new THREE.MeshStandardMaterial({
      color: heatColor,
      metalness: 0.8,
      emissive: temperature > 50 ? new THREE.Color(heatColor) : new THREE.Color(0x000000),
      emissiveIntensity: Math.min(temperature / 200, 0.5),
    });
    const wire = new THREE.Mesh(wireGeometry, wireMaterial);
    wire.position.x = (i - 2.5) * 0.1 * scale;
    wire.rotation.x = Math.PI / 2;
    wire.scale.multiplyScalar(scale);
    group.add(wire);
  }

  // Glow effect when hot
  if (temperature > 50) {
    const glowGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: "#ff6600",
      transparent: true,
      opacity: Math.min(temperature / 300, 0.3),
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.z = 0.02 * scale;
    glow.scale.multiplyScalar(scale);
    group.add(glow);
  }
}

function createHeatingVessel(group: THREE.Group, temperature: number, evaporationRate: number, scale: number) {
  // Vessel (beaker shape)
  const vesselGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.6, 16);
  const heatColor = temperature > 100 ? "#ff6600" : temperature > 50 ? "#ffcc00" : "#cccccc";
  const vesselMaterial = new THREE.MeshStandardMaterial({
    color: heatColor,
    metalness: 0.3,
    emissive: temperature > 50 ? new THREE.Color(heatColor) : new THREE.Color(0x000000),
    emissiveIntensity: Math.min(temperature / 300, 0.4),
  });
  const vessel = new THREE.Mesh(vesselGeometry, vesselMaterial);
  vessel.scale.multiplyScalar(scale);
  group.add(vessel);

  // Evaporation steam effect
  if (evaporationRate > 0) {
    const steamGeometry = new THREE.BufferGeometry();
    const steamCount = Math.round(30 * evaporationRate);
    const steamPositions = new Float32Array(steamCount * 3);

    for (let i = 0; i < steamCount; i++) {
      steamPositions[i * 3] = (Math.random() - 0.5) * 0.4 * scale;
      steamPositions[i * 3 + 1] = 0.3 + Math.random() * 0.5 * scale;
      steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.4 * scale;
    }

    steamGeometry.setAttribute("position", new THREE.BufferAttribute(steamPositions, 3));
    const steamMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08 * scale,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6 * evaporationRate,
    });
    const steam = new THREE.Points(steamGeometry, steamMaterial);
    group.add(steam);
  }
}

function createHeatedBeaker(
  group: THREE.Group,
  isHeating: boolean,
  flameIntensity: number,
  evaporationRate: number,
  scale: number
) {
  // Main beaker
  const beakerGeometry = new THREE.CylinderGeometry(0.3, 0.28, 0.5, 16);
  const beakerMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    metalness: 0.1,
    roughness: 0.3,
    transparent: true,
    opacity: 0.7,
  });
  const beaker = new THREE.Mesh(beakerGeometry, beakerMaterial);
  beaker.position.y = 0.3 * scale;
  beaker.scale.multiplyScalar(scale);
  group.add(beaker);

  // Liquid with color change based on heating
  if (flameIntensity > 0) {
    const liquidColor = flameIntensity > 0.7 ? "#ff6600" : flameIntensity > 0.4 ? "#ffcc00" : "#4287f5";
    const liquidGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.4, 16);
    const liquidMaterial = new THREE.MeshStandardMaterial({
      color: liquidColor,
      metalness: 0.4,
      emissive: new THREE.Color(liquidColor),
      emissiveIntensity: flameIntensity * 0.3,
    });
    const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquid.position.y = 0.25 * scale;
    liquid.scale.multiplyScalar(scale);
    group.add(liquid);
  }

  // Evaporation/steam effect
  if (evaporationRate > 0) {
    const steamGeometry = new THREE.BufferGeometry();
    const steamCount = Math.round(40 * evaporationRate);
    const steamPositions = new Float32Array(steamCount * 3);

    for (let i = 0; i < steamCount; i++) {
      steamPositions[i * 3] = (Math.random() - 0.5) * 0.3 * scale;
      steamPositions[i * 3 + 1] = 0.5 + Math.random() * 0.6 * scale;
      steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.3 * scale;
    }

    steamGeometry.setAttribute("position", new THREE.BufferAttribute(steamPositions, 3));
    const steamMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1 * scale,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7 * evaporationRate,
    });
    const steam = new THREE.Points(steamGeometry, steamMaterial);
    group.add(steam);
  }

  // Hot glow effect
  if (flameIntensity > 0) {
    const glowGeometry = new THREE.SphereGeometry(0.35, 16, 16);
    const glowColor = flameIntensity > 0.7 ? "#ff6600" : "#ffcc00";
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: 0.15 * flameIntensity,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = 0.3 * scale;
    glow.scale.multiplyScalar(scale);
    group.add(glow);
  }
}
