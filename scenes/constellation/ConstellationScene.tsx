"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useSceneStore } from "../engine/useSceneStore";
import stackData from "@/content/stack.json";

// Procedurally map clusters to spherical angular zones
const CLUSTER_POSITIONS: Record<string, [number, number, number]> = {
  "ai-ml": [-2.2, 1.2, 0],
  "llm-eng": [0.5, 2.0, -0.5],
  "computer-vision": [-1.8, -1.4, 0.5],
  backend: [1.8, -0.8, -0.2],
  infrastructure: [2.2, 1.0, 0.4],
};

export function ConstellationScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { reducedMotion } = useSceneStore();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Calculate 3D positions for all nodes based on their cluster
  const { nodePositions, lineSegments } = useMemo(() => {
    const positions: Record<string, [number, number, number]> = {};
    const clusterCounters: Record<string, number> = {};

    stackData.nodes.forEach((node) => {
      const basePos = CLUSTER_POSITIONS[node.cluster] ?? [0, 0, 0];
      const count = clusterCounters[node.cluster] ?? 0;
      clusterCounters[node.cluster] = count + 1;

      // Small jitter around cluster centroid
      const angle = (count * 2.39996); // golden ratio angle
      const radius = 0.65 + (count * 0.12);
      const x = basePos[0] + Math.cos(angle) * radius;
      const y = basePos[1] + Math.sin(angle) * radius * 0.7;
      const z = basePos[2] + (Math.sin(count * 1.5) * 0.5);

      positions[node.id] = [x, y, z];
    });

    // Build line segments between nodes
    const segments: Array<[[number, number, number], [number, number, number]]> = [];
    stackData.edges.forEach((edge) => {
      const fromPos = positions[edge.from];
      const toPos = positions[edge.to];
      if (fromPos && toPos) {
        segments.push([fromPos, toPos]);
      }
    });

    return { nodePositions: positions, lineSegments: segments };
  }, []);

  // Geometry for lines
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    lineSegments.forEach(([from, to]) => {
      points.push(new THREE.Vector3(...from));
      points.push(new THREE.Vector3(...to));
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [lineSegments]);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.05;
    groupRef.current.rotation.x = Math.sin(t * 0.03) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#B6E36A" />

      {/* Connection Edges */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#252C35"
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </lineSegments>

      {/* Nodes */}
      {stackData.nodes.map((node) => {
        const pos = nodePositions[node.id];
        if (!pos) return null;
        const isHovered = hoveredNode === node.id;
        const isVerified = node.status === "verified";

        return (
          <group key={node.id} position={pos}>
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredNode(node.id);
              }}
              onPointerOut={() => {
                setHoveredNode(null);
              }}
            >
              <sphereGeometry args={[isHovered ? 0.12 : 0.08, 16, 16]} />
              <meshStandardMaterial
                color={isHovered ? "#B6E36A" : isVerified ? "#B6E36A" : "#8C96A3"}
                emissive={isHovered ? "#B6E36A" : "#000000"}
                emissiveIntensity={isHovered ? 0.8 : 0}
                roughness={0.4}
                metalness={0.8}
              />
            </mesh>

            {/* Label floating beside node when hovered */}
            {isHovered && (
              <Text
                position={[0.2, 0.1, 0]}
                fontSize={0.16}
                color="#D9DEE5"
                anchorX="left"
                anchorY="middle"
                font="/fonts/JetBrainsMono-Regular.ttf"
              >
                {node.label}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
}
