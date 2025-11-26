import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ApparatusProps {
  type: "beaker" | "burette" | "thermometer" | "ph-meter" | "test-tube" | "cuvette" | "flask";
  volume?: number;
  maxVolume?: number;
  temperature?: number;
  color?: string;
  boiling?: boolean;
  scale?: number;
}

// Generic 3D Apparatus Base Component
export function Apparatus3D({
  type,
  volume = 0,
  maxVolume = 250,
  temperature = 25,
  color = "#4287f5",
  boiling = false,
  scale = 1,
}: ApparatusProps) {
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!ref.current) return;

    const group = ref.current;

    // Clear previous children
    group.clear();

    switch (type) {
      case "beaker":
        createBeaker(group, volume, maxVolume, color, temperature, boiling, scale);
        break;
      case "burette":
        createBurette(group, volume, maxVolume, color, scale);
        break;
      case "thermometer":
        createThermometer(group, temperature, scale);
        break;
      case "test-tube":
        createTestTube(group, volume, maxVolume, color, scale);
        break;
      case "flask":
        createFlask(group, volume, maxVolume, color, temperature, boiling, scale);
        break;
      case "cuvette":
        createCuvette(group, volume, maxVolume, color, scale);
        break;
    }

    // Animation for boiling effect
    if (boiling) {
      let animationFrameId: number;
      const animate = () => {
        if (ref.current) {
          ref.current.rotation.z = Math.sin(Date.now() * 0.005) * 0.02;
        }
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [type, volume, maxVolume, temperature, color, boiling, scale]);

  return <group ref={ref} />;
}

// Create a 3D Beaker
function createBeaker(
  group: THREE.Group,
  volume: number,
  maxVolume: number,
  color: string,
  temperature: number,
  boiling: boolean,
  scale: number
) {
  // Container (glass-like appearance)
  const beakerGeometry = new THREE.CylinderGeometry(1, 0.95, 2.5, 32);
  const beakerMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    metalness: 0.1,
    roughness: 0.2,
    transparent: true,
    opacity: 0.7,
  });
  const beaker = new THREE.Mesh(beakerGeometry, beakerMaterial);
  beaker.scale.multiplyScalar(scale);
  group.add(beaker);

  // Liquid inside
  if (volume > 0) {
    const liquidHeight = (volume / maxVolume) * 2.5 * 0.8;
    const liquidGeometry = new THREE.CylinderGeometry(0.95, 0.95, liquidHeight, 32);
    const liquidMaterial = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.3,
      roughness: 0.1,
      transparent: true,
      opacity: 0.9,
    });
    const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquid.position.y = -2.5 / 2 + liquidHeight / 2 + 0.2;
    liquid.scale.multiplyScalar(scale);
    group.add(liquid);

    // Boiling effect - particles
    if (boiling) {
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 50;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 1.8 * scale;
        positions[i * 3 + 1] = -1 + Math.random() * liquidHeight * 0.8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1.8 * scale;
      }

      particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xffff00,
        size: 0.05 * scale,
        sizeAttenuation: true,
      });
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      group.add(particles);
    }
  }

  // Rim
  const rimGeometry = new THREE.TorusGeometry(1, 0.08, 16, 32);
  const rimMaterial = new THREE.MeshStandardMaterial({ color: "#cccccc" });
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 1.3;
  rim.scale.multiplyScalar(scale);
  group.add(rim);
}

// Create a 3D Burette
function createBurette(
  group: THREE.Group,
  volume: number,
  maxVolume: number,
  color: string,
  scale: number
) {
  // Tube
  const tubeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
  const tubeMaterial = new THREE.MeshStandardMaterial({
    color: "#e8f4f8",
    metalness: 0.05,
    roughness: 0.3,
    transparent: true,
    opacity: 0.6,
  });
  const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
  tube.scale.multiplyScalar(scale);
  group.add(tube);

  // Liquid inside
  if (volume > 0) {
    const liquidHeight = (volume / maxVolume) * 3.8;
    const liquidGeometry = new THREE.CylinderGeometry(0.19, 0.19, liquidHeight, 16);
    const liquidMaterial = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.3,
      roughness: 0.1,
    });
    const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquid.position.y = -1.9 + liquidHeight / 2;
    liquid.scale.multiplyScalar(scale);
    group.add(liquid);
  }

  // Stopcock at bottom
  const stopcockGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const stopcockMaterial = new THREE.MeshStandardMaterial({
    color: "#444444",
    metalness: 0.8,
  });
  const stopcock = new THREE.Mesh(stopcockGeometry, stopcockMaterial);
  stopcock.position.y = -2;
  stopcock.scale.multiplyScalar(scale);
  group.add(stopcock);

  // Top bulb
  const bulbGeometry = new THREE.SphereGeometry(0.35, 16, 16);
  const bulbMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    metalness: 0.1,
    roughness: 0.2,
    transparent: true,
    opacity: 0.5,
  });
  const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
  bulb.position.y = 2.2;
  bulb.scale.multiplyScalar(scale);
  group.add(bulb);
}

// Create a Thermometer
function createThermometer(group: THREE.Group, temperature: number, scale: number) {
  // Glass stem
  const stemGeometry = new THREE.CylinderGeometry(0.08, 0.08, 3, 16);
  const stemMaterial = new THREE.MeshStandardMaterial({
    color: "#ccffff",
    transparent: true,
    opacity: 0.7,
  });
  const stem = new THREE.Mesh(stemGeometry, stemMaterial);
  stem.scale.multiplyScalar(scale);
  group.add(stem);

  // Bulb at bottom (temperature indicator)
  const tempRatio = Math.max(0, Math.min(1, (temperature - 0) / 100));
  const bulbColor = new THREE.Color().lerpColors(
    new THREE.Color("#0000ff"),
    new THREE.Color("#ff0000"),
    tempRatio
  );

  const bulbGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  const bulbMaterial = new THREE.MeshStandardMaterial({
    color: bulbColor,
    metalness: 0.6,
  });
  const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
  bulb.position.y = -1.5;
  bulb.scale.multiplyScalar(scale);
  group.add(bulb);

  // Liquid rise inside (red/blue indicator)
  const liquidHeight = (tempRatio * 2.5 + 0.3) * scale;
  const liquidGeometry = new THREE.CylinderGeometry(0.06, 0.06, liquidHeight, 8);
  const liquidMaterial = new THREE.MeshStandardMaterial({
    color: bulbColor,
    metalness: 0.4,
  });
  const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
  liquid.position.y = -1.5 + liquidHeight / 2;
  group.add(liquid);
}

// Create pH Meter (visual representation)
export function createPhMeter(group: THREE.Group, ph: number, scale: number) {
  // Handle
  const handleGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.2);
  const handleMaterial = new THREE.MeshStandardMaterial({ color: "#333333" });
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.position.y = 0.5;
  handle.scale.multiplyScalar(scale);
  group.add(handle);

  // Probe (electrode)
  const probeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 16);
  const probeMaterial = new THREE.MeshStandardMaterial({ color: "#888888" });
  const probe = new THREE.Mesh(probeGeometry, probeMaterial);
  probe.position.y = -0.3;
  probe.scale.multiplyScalar(scale);
  group.add(probe);

  // Display screen (shows pH value)
  const screenGeometry = new THREE.PlaneGeometry(0.6, 0.4);
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: "#000000",
    emissive: 0x00ff00,
  });
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.y = 1.2;
  screen.position.z = 0.15;
  screen.scale.multiplyScalar(scale);
  group.add(screen);
}

// Create Test Tube
function createTestTube(
  group: THREE.Group,
  volume: number,
  maxVolume: number,
  color: string,
  scale: number
) {
  // Tube
  const tubeGeometry = new THREE.CylinderGeometry(0.3, 0.28, 2.5, 16);
  const tubeMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    metalness: 0.05,
    roughness: 0.3,
    transparent: true,
    opacity: 0.6,
  });
  const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
  tube.scale.multiplyScalar(scale);
  group.add(tube);

  // Rounded bottom
  const bottomGeometry = new THREE.SphereGeometry(0.29, 16, 8);
  const bottomMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.6,
  });
  const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.position.y = -1.3;
  bottom.scale.set(1, 0.5, 1);
  bottom.scale.multiplyScalar(scale);
  group.add(bottom);

  // Liquid
  if (volume > 0) {
    const liquidHeight = (volume / maxVolume) * 2;
    const liquidGeometry = new THREE.CylinderGeometry(0.28, 0.28, liquidHeight, 16);
    const liquidMaterial = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.3,
    });
    const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquid.position.y = -1.3 + liquidHeight / 2;
    liquid.scale.multiplyScalar(scale);
    group.add(liquid);
  }

  // Rim
  const rimGeometry = new THREE.TorusGeometry(0.32, 0.06, 16, 16);
  const rimMaterial = new THREE.MeshStandardMaterial({ color: "#cccccc" });
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 1.3;
  rim.scale.multiplyScalar(scale);
  group.add(rim);
}

// Create Cuvette (small container for spectrophotometer)
function createCuvette(
  group: THREE.Group,
  volume: number,
  maxVolume: number,
  color: string,
  scale: number
) {
  // Box shape (square)
  const size = 0.5;
  const cuvGeometry = new THREE.BoxGeometry(size, size * 1.5, size);
  const cuvMaterial = new THREE.MeshStandardMaterial({
    color: "#e8f4f8",
    metalness: 0.1,
    roughness: 0.3,
    transparent: true,
    opacity: 0.5,
  });
  const cuvette = new THREE.Mesh(cuvGeometry, cuvMaterial);
  cuvette.scale.multiplyScalar(scale);
  group.add(cuvette);

  // Liquid inside
  if (volume > 0) {
    const liquidHeight = (volume / maxVolume) * size * 1.4;
    const liquidGeometry = new THREE.BoxGeometry(size - 0.05, liquidHeight, size - 0.05);
    const liquidMaterial = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.4,
      roughness: 0.1,
    });
    const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquid.position.y = -size * 0.7 + liquidHeight / 2;
    liquid.scale.multiplyScalar(scale);
    group.add(liquid);
  }
}

// Create Flask (round bottom flask)
function createFlask(
  group: THREE.Group,
  volume: number,
  maxVolume: number,
  color: string,
  temperature: number,
  boiling: boolean,
  scale: number
) {
  // Main round flask body
  const flaskGeometry = new THREE.SphereGeometry(1, 32, 32);
  const flaskMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    metalness: 0.05,
    roughness: 0.3,
    transparent: true,
    opacity: 0.6,
  });
  const flask = new THREE.Mesh(flaskGeometry, flaskMaterial);
  flask.scale.multiplyScalar(scale);
  group.add(flask);

  // Neck
  const neckGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.5, 16);
  const neckMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.6,
  });
  const neck = new THREE.Mesh(neckGeometry, neckMaterial);
  neck.position.y = 1;
  neck.scale.multiplyScalar(scale);
  group.add(neck);

  // Liquid
  if (volume > 0) {
    const liquidHeight = (volume / maxVolume) * 1.8;
    const liquidGeometry = new THREE.SphereGeometry(0.95, 32, 16);
    const liquidMaterial = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.3,
      roughness: 0.1,
    });
    const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquid.scale.set(1, liquidHeight / 1.8, 1);
    liquid.scale.multiplyScalar(scale);
    liquid.position.y = -0.5 * scale;
    group.add(liquid);
  }
}
