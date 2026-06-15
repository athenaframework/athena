import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { AgentData } from '../types';

interface AgentAvatarProps {
  agent: AgentData;
  position: [number, number, number];
  scale?: number;
  onClick?: () => void;
  isFocused?: boolean;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agent,
  position,
  scale = 1,
  onClick,
  isFocused = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const time = useRef(Math.random() * Math.PI * 2); // randomize phase

  const statusColorMap: Record<string, string> = {
    idle: '#7BA3C4',
    thinking: '#C49B5A',
    working: '#5B9A5B',
    completed: '#3D8B8B',
    error: '#C75A5A',
  };

  const statusColor = statusColorMap[agent.status] || agent.color;

  useFrame((_, delta) => {
    time.current += delta;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(time.current * 1.2) * 0.12;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (agent.status === 'working' ? 1.4 : 0.4);
    }
    if (coreRef.current && coreRef.current.material instanceof THREE.MeshStandardMaterial) {
      const base = agent.status === 'working' ? 1.0 : 0.55;
      coreRef.current.material.emissiveIntensity = base + Math.sin(time.current * 2.5) * 0.18;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={isFocused ? scale * 1.25 : scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* Glow halo behind avatar */}
      <Sphere args={[0.7, 24, 24]}>
        <meshBasicMaterial
          color={agent.color}
          transparent
          opacity={isFocused ? 0.22 : 0.1}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Core orb — main agent identity */}
      <Sphere ref={coreRef} args={[0.42, 32, 32]}>
        <meshStandardMaterial
          color={agent.color}
          emissive={agent.color}
          emissiveIntensity={0.75}
          metalness={0.4}
          roughness={0.25}
          toneMapped={false}
        />
      </Sphere>

      {/* Inner highlight ring (white rim) */}
      <Sphere args={[0.44, 32, 32]}>
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.06} />
      </Sphere>

      {/* Status indicator ring (orbiting) */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.62, 0.04, 12, 64]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.9}
          toneMapped={false}
        />
      </mesh>

      {/* Focused outer ring */}
      {isFocused && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.85, 0.025, 12, 64]} />
          <meshBasicMaterial color={agent.color} transparent opacity={0.7} />
        </mesh>
      )}

      {/* Progress arc — visible when working */}
      {agent.progress > 0 && agent.progress < 100 && (
        <mesh position={[0, -0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.62, 32, 1, 0, (agent.progress / 100) * Math.PI * 2]} />
          <meshBasicMaterial color={statusColor} transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};
