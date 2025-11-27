import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { ReactionEquation, ChemicalCompound } from "@/lib/chemical-reaction-db";

interface FlowNode {
  id: string;
  name: string;
  type: "reactant" | "product" | "catalyst";
  position: [number, number, number];
  color: string;
  size: number;
}

interface FlowConnection {
  from: string;
  to: string;
  ratio: number;
  animated: boolean;
}

function Particle({ pos }: { pos: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.x = pos[0] + Math.sin(clock.getElapsedTime()) * 0.1;
      meshRef.current.position.y = pos[1] + Math.cos(clock.getElapsedTime() * 0.7) * 0.1;
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.015;
    }
  });

  return (
    <mesh ref={meshRef} position={pos}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshPhongMaterial
        color="#00aaff"
        emissive="#0055ff"
        emissiveIntensity={0.5}
        wireframe={false}
      />
    </mesh>
  );
}

function FlowNode({
  node,
  isReactant,
}: {
  node: FlowNode;
  isReactant: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003;
      meshRef.current.rotation.y += 0.005;
      meshRef.current.scale.set(
        hovered ? 1.3 : 1,
        hovered ? 1.3 : 1,
        hovered ? 1.3 : 1
      );
    }
  });

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[node.size, 32, 32]} />
        <meshPhongMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered ? 0.6 : 0.3}
          wireframe={false}
          transparent={true}
          opacity={0.9}
        />
      </mesh>

      {/* Label */}
      <Text position={[0, -node.size - 0.8, 0]} fontSize={0.5} color="#ffffff">
        {node.name}
      </Text>

      {/* Type indicator */}
      <Text position={[0, node.size + 0.8, 0]} fontSize={0.3} color="#cccccc">
        {isReactant ? "→" : "←"}
      </Text>
    </group>
  );
}

interface AnimatingDot {
  id: string;
  progress: number;
}

function FlowLine({
  from,
  to,
  ratio,
  reaction,
}: {
  from: FlowNode;
  to: FlowNode;
  ratio: number;
  reaction: ReactionEquation;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const dotsRef = useRef<AnimatingDot[]>([]);
  const [dots, setDots] = useState<AnimatingDot[]>([]);

  useEffect(() => {
    // Initialize dots along the line
    const dotCount = Math.ceil(ratio * 3);
    dotsRef.current = Array.from({ length: dotCount }, (_, i) => ({
      id: `dot-${i}`,
      progress: (i / dotCount) * 0.8,
    }));
  }, [ratio]);

  useFrame(() => {
    dotsRef.current.forEach((dot) => {
      dot.progress += 0.01;
      if (dot.progress > 1) {
        dot.progress = 0;
      }
    });
    setDots([...dotsRef.current]);
  });

  const points = [
    new THREE.Vector3(from.position[0], from.position[1], from.position[2]),
    new THREE.Vector3(to.position[0], to.position[1], to.position[2]),
  ];

  return (
    <group>
      {/* Connection line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4488ff" linewidth={2} />
      </line>

      {/* Flow particles */}
      {dots.map((dot, i) => {
        const start = points[0];
        const end = points[1];
        const pos = new THREE.Vector3(
          start.x + (end.x - start.x) * dot.progress,
          start.y + (end.y - start.y) * dot.progress,
          start.z + (end.z - start.z) * dot.progress
        );
        return (
          <mesh key={dot.id} position={[pos.x, pos.y, pos.z]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshPhongMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={0.8}
            />
          </mesh>
        );
      })}

      {/* Stoichiometry label */}
      <Text
        position={[
          (from.position[0] + to.position[0]) / 2,
          (from.position[1] + to.position[1]) / 2 + 0.5,
          (from.position[2] + to.position[2]) / 2,
        ]}
        fontSize={0.4}
        color="#ffff00"
      >
        {ratio.toFixed(1)}:1
      </Text>
    </group>
  );
}

export function MaterialFlowVisualization({
  reaction,
}: {
  reaction: ReactionEquation;
}) {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [connections, setConnections] = useState<FlowConnection[]>([]);

  useEffect(() => {
    // Create nodes for reactants and products
    const newNodes: FlowNode[] = [];

    // Reactants (left side)
    reaction.reactants.forEach((r, i) => {
      newNodes.push({
        id: `reactant-${i}`,
        name: `${r.compound.name}\n(${r.moles} mol)`,
        type: "reactant",
        position: [-3, (reaction.reactants.length - 1) * 1.5 - i * 1.5, 0],
        color: r.compound.color,
        size: 0.4 + r.moles * 0.1,
      });
    });

    // Products (right side)
    reaction.products.forEach((p, i) => {
      newNodes.push({
        id: `product-${i}`,
        name: `${p.compound.name}\n(${p.moles} mol)`,
        type: "product",
        position: [3, (reaction.products.length - 1) * 1.5 - i * 1.5, 0],
        color: p.compound.color,
        size: 0.4 + p.moles * 0.1,
      });
    });

    setNodes(newNodes);

    // Create connections
    const newConnections: FlowConnection[] = [];
    reaction.reactants.forEach((r, ri) => {
      reaction.products.forEach((p, pi) => {
        const ratio = p.moles / r.moles;
        newConnections.push({
          from: `reactant-${ri}`,
          to: `product-${pi}`,
          ratio,
          animated: true,
        });
      });
    });
    setConnections(newConnections);
  }, [reaction]);

  return (
    <div className="w-full h-full bg-slate-950">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#0055ff" />

        {/* Render nodes */}
        {nodes.map((node) => (
          <FlowNode
            key={node.id}
            node={node}
            isReactant={node.type === "reactant"}
          />
        ))}

        {/* Render connections */}
        {connections.map((conn, i) => {
          const fromNode = nodes.find((n) => n.id === conn.from);
          const toNode = nodes.find((n) => n.id === conn.to);
          if (fromNode && toNode) {
            return (
              <FlowLine
                key={i}
                from={fromNode}
                to={toNode}
                ratio={conn.ratio}
                reaction={reaction}
              />
            );
          }
        })}

        {/* Reaction title and equation */}
        <Text position={[0, 5, 0]} fontSize={0.6} color="#ffff00">
          {reaction.equation}
        </Text>

        <OrbitControls autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
}
