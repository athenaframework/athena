import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Environment, Text, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ControlTower } from './ControlTower';
import { AgentAvatar } from './AgentAvatar';
import { ParticleSystem } from './ParticleSystem';
import { AgentData } from '../types';
import { useStore } from '../hooks/useStore';

interface Scene3DProps {
  agents: AgentData[];
  activitiesLog: string[];
}

const ROLE_BY_NAME: Record<string, string> = {
  Oracle: 'PLANNER',
  Nexus: 'ARCHITECT',
  Forge: 'ENGINEER',
  Cipher: 'TESTER',
  Aegis: 'REVIEWER',
};

export const Scene3D: React.FC<Scene3DProps> = ({ agents }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const { focusedAgent, setFocusedAgent, particleEffects } = useStore();

  // Position agents in a horizontal circle around the control tower
  const agentPositions = agents.reduce<Record<string, [number, number, number]>>(
    (acc, agent, i) => {
      const angle = (i / Math.max(agents.length, 1)) * Math.PI * 2 - Math.PI / 2;
      const radius = 4.2;
      acc[agent.name] = [
        Math.cos(angle) * radius,
        Math.sin(i * 0.7) * 0.3, // slight vertical variance
        Math.sin(angle) * radius,
      ];
      return acc;
    },
    {}
  );

  // Animate camera target when focused
  useFrame(() => {
    if (focusedAgent && agentPositions[focusedAgent] && controlsRef.current) {
      const [x, y, z] = agentPositions[focusedAgent];
      controlsRef.current.target.lerp(new THREE.Vector3(x, y, z), 0.08);
    } else if (controlsRef.current) {
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
    }
  });

  const agentEffects = (agentName: string) =>
    particleEffects.filter((e) => e.agentName === agentName);

  return (
    <>
      {/* Lighting — soft, ambient + ocean key light */}
      <ambientLight intensity={0.7} color="#E2EDF5" />
      <directionalLight position={[8, 12, 8]} intensity={1.1} color="#FFFFFF" castShadow />
      <pointLight position={[10, 6, 10]} intensity={0.8} color="#4A90C2" />
      <pointLight position={[-10, 4, -10]} intensity={0.6} color="#3D8B8B" />
      <pointLight position={[0, -5, 0]} intensity={0.4} color="#C49B5A" />

      <Environment preset="dawn" />

      {/* Subtle starfield for depth */}
      <Stars radius={50} depth={30} count={400} factor={2} fade speed={0.5} />

      {/* Cinematic camera — closer, slight tilt */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 3, 9]}
        fov={50}
      />

      <OrbitControls
        ref={controlsRef}
        args={[cameraRef.current as THREE.PerspectiveCamera]}
        autoRotate={!focusedAgent}
        autoRotateSpeed={0.35}
        enableDamping
        dampingFactor={0.06}
        enableZoom
        enablePan={false}
        minDistance={5}
        maxDistance={18}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
      />

      {/* Central Control Tower */}
      <ControlTower pulseIntensity={agents.some((a) => a.status === 'working') ? 2 : 1} />

      {/* Floor — subtle reflective disc */}
      <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 6.5, 64]} />
        <meshBasicMaterial
          color="#4A90C2"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Agent Avatars + name labels */}
      {agents.map((agent) => {
        const pos = agentPositions[agent.name] || [0, 0, 0];
        const isFocused = focusedAgent === agent.name;
        const role = ROLE_BY_NAME[agent.name] || 'AGENT';

        return (
          <group key={agent.name}>
            <AgentAvatar
              agent={agent}
              position={pos}
              scale={1.1}
              onClick={() => setFocusedAgent(isFocused ? null : agent.name)}
              isFocused={isFocused}
            />

            {/* Floating name label */}
            <group position={[pos[0], pos[1] + 1.4, pos[2]]}>
              <Text
                fontSize={0.28}
                color={isFocused ? agent.color : '#2B4A6E'}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.018}
                outlineColor="#FFFFFF"
                outlineOpacity={0.95}
              >
                {agent.name.toUpperCase()}
              </Text>
              <Text
                position={[0, -0.28, 0]}
                fontSize={0.13}
                color="#2B4A6E"
                fillOpacity={0.55}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.012}
                outlineColor="#FFFFFF"
                outlineOpacity={0.9}
              >
                {role}
              </Text>
            </group>

            {/* Particle effects */}
            {agentEffects(agent.name).map((effect) => (
              <ParticleSystem
                key={effect.id}
                position={pos}
                color={agent.color}
                count={50}
                effectType={effect.type as any}
              />
            ))}
          </group>
        );
      })}
    </>
  );
};
