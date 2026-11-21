"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useSceneStore } from "../engine/useSceneStore";
import stackData from "@/content/stack.json";

const CLUSTER_POSITIONS: Record<string, [number, number, number]> = {
  "ai-ml": [-2.2, 1.2, 0],
  "llm-eng": [0.5, 2.0, -0.5],
  "computer-vision": [-1.8, -1.4, 0.5],
  backend: [1.8, -0.8, -0.2],
  infrastructure: [2.2, 1.0, 0.4],
};

export interface ConstellationSceneProps {
  selectedNodeId?: string | null;
  onSelectNode?: (id: string) => void;
}

export function ConstellationScene({
  selectedNodeId,
  onSelectNode,
}: ConstellationSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { reducedMotion } = useSceneStore();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Calculate 3D positions for all nodes
  const { nodePositions, lineSegments, edgeConnections } = useMemo(() => {
    const positions: Record<string, [number, number, number]> = {};
    const clusterCounters: Record<string, number> = {};

    stackData.nodes.forEach((node) => {
      const basePos = CLUSTER_POSITIONS[node.cluster] ?? [0, 0, 0];
      const count = clusterCounters[node.cluster] ?? 0;
      clusterCounters[node.cluster] = count + 1;

      const angle = count * 2.39996;
      const radius = 0.75 + count * 0.12;
      const x = basePos[0] + Math.cos(angle) * radius;
      const y = basePos[1] + Math.sin(angle) * radius * 0.7;
      const z = basePos[2] + Math.sin(count * 1.5) * 0.5;

      positions[node.id] = [x, y, z];
    });

    const segments: Array<[[number, number, number], [number, number, number]]> = [];
    const connections: Record<string, Set<string>> = {};

    stackData.edges.forEach((edge) => {
      const fromPos = positions[edge.from];
      const toPos = positions[edge.to];
      if (fromPos && toPos) {
        segments.push([fromPos, toPos]);
      }
      if (!connections[edge.from]) connections[edge.from] = new Set();
      if (!connections[edge.to]) connections[edge.to] = new Set();
      connections[edge.from]?.add(edge.to);
      connections[edge.to]?.add(edge.from);
    });

    return {
      nodePositions: positions,
      lineSegments: segments,
      edgeConnections: connections,
    };
  }, []);

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
    groupRef.current.rotation.y = t * 0.04;
    groupRef.current.rotation.x = Math.sin(t * 0.02) * 0.025;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} color="#D9DEE5" />
      <pointLight position={[5, 5, 5]} intensity={1.8} color="#B6E36A" />
      <pointLight position={[-5, -3, -2]} intensity={1.0} color="#B58A68" />

      {/* Network Edges */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#252C35"
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </lineSegments>

      {/* Nodes */}
      {stackData.nodes.map((node) => {
        const pos = nodePositions[node.id];
        if (!pos) return null;
        const isHovered = hoveredNode === node.id;
        const isSelected = selectedNodeId === node.id;
        const isConnected =
          selectedNodeId &&
          edgeConnections[selectedNodeId]?.has(node.id);

        const nodeColor = isSelected
          ? "#B6E36A"
          : isHovered
            ? "#cbf489"
            : isConnected
              ? "#D9DEE5"
              : "#8C96A3";

        return (
          <group key={node.id} position={pos}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode?.(node.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredNode(node.id);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHoveredNode(null);
                document.body.style.cursor = "default";
              }}
            >
              <sphereGeometry
                args={[isSelected ? 0.14 : isHovered ? 0.12 : 0.075, 16, 16]}
              />
              <meshStandardMaterial
                color={nodeColor}
                emissive={isSelected || isHovered ? "#B6E36A" : "#000000"}
                emissiveIntensity={isSelected ? 1.2 : isHovered ? 0.8 : 0}
                roughness={0.3}
                metalness={0.8}
              />
            </mesh>

            {/* Selection Pulse Ring */}
            {isSelected && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.22, 0.015, 16, 32]} />
                <meshBasicMaterial color="#B6E36A" />
              </mesh>
            )}

            {/* Always visible or hover label */}
            {(isHovered || isSelected) && (
              <Text
                position={[0.2, 0.1, 0]}
                fontSize={0.18}
                color="#D9DEE5"
                anchorX="left"
                anchorY="middle"
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
