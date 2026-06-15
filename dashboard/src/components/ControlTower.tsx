import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

interface ControlTowerProps {
  pulseIntensity?: number;
}

export const ControlTower: React.FC<ControlTowerProps> = ({ pulseIntensity = 1 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
      groupRef.current.rotation.x += 0.0001;
    }

    if (sphereRef.current) {
      pulseRef.current += 0.02;
      const scale = 1 + Math.sin(pulseRef.current) * 0.05 * pulseIntensity;
      sphereRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Inner glowing core - ocean blue */}
      <Sphere ref={sphereRef} args={[1.2, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          emissive="#4A90C2"
          emissiveIntensity={0.7}
          color="#6BA5D0"
          wireframe={false}
          toneMapped={false}
        />
      </Sphere>

      {/* Outer wireframe shell - deep blue */}
      <Icosahedron args={[1.4, 4]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#2B4A6E"
          wireframe={true}
          transparent
          opacity={0.45}
        />
      </Icosahedron>

      {/* Rotating rings - ocean / teal / gold */}
      {[0, 45, 90].map((rotation, i) => (
        <group
          key={i}
          rotation={[
            (rotation * Math.PI) / 180,
            0,
            (rotation * Math.PI) / 180,
          ]}
        >
          <mesh>
            <torusGeometry args={[1.8, 0.08, 16, 100]} />
            <meshStandardMaterial
              emissive={i === 0 ? '#4A90C2' : i === 1 ? '#3D8B8B' : '#C49B5A'}
              emissiveIntensity={0.55}
              color="#E2EDF5"
              wireframe={false}
            />
          </mesh>
        </group>
      ))}

      {/* Pulsing outer glow - soft sky */}
      <Sphere args={[1.6, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#7BA3C4"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </group>
  );
};
