"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Tower({ x, z, height, radius }: { x: number; z: number; height: number; radius: number }) {
  return (
    <group position={[x, height / 2 - 2, z]}>
      <mesh>
        <cylinderGeometry args={[radius, radius * 1.1, height, 8]} />
        <meshStandardMaterial color="#f4a7c1" transparent opacity={0.6} />
      </mesh>
      {/* Cone top */}
      <mesh position={[0, height / 2 + 0.4, 0]}>
        <coneGeometry args={[radius * 1.2, 1.2, 8]} />
        <meshStandardMaterial color="#e8809e" transparent opacity={0.7} />
      </mesh>
      {/* Windows */}
      {[0.3, -0.3].map((yw, i) => (
        <mesh key={i} position={[radius * 0.9, yw, 0]}>
          <boxGeometry args={[0.05, 0.15, 0.08]} />
          <meshStandardMaterial color="#fff5f8" emissive="#f4a7c1" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export default function DreamCastle() {
  const castleRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!castleRef.current) return;
    castleRef.current.position.y = -2 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <group ref={castleRef} position={[0, -2, -8]} scale={[0.8, 0.8, 0.8]}>
      {/* Main body */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[4, 3, 2]} />
        <meshStandardMaterial color="#fde8f0" transparent opacity={0.7} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 3.2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.2, 1.2, 4]} />
        <meshStandardMaterial color="#f4a7c1" transparent opacity={0.7} />
      </mesh>

      {/* Gate */}
      <mesh position={[0, 0.7, 1.01]}>
        <boxGeometry args={[0.8, 1.4, 0.05]} />
        <meshStandardMaterial color="#e8809e" transparent opacity={0.5} />
      </mesh>

      {/* Towers */}
      <Tower x={-2.2} z={-0.5} height={4.5} radius={0.5} />
      <Tower x={2.2} z={-0.5} height={4.5} radius={0.5} />
      <Tower x={-1.4} z={1} height={3.5} radius={0.4} />
      <Tower x={1.4} z={1} height={3.5} radius={0.4} />

      {/* Battlements */}
      {[-1.5, -0.75, 0, 0.75, 1.5].map((bx, i) => (
        <mesh key={i} position={[bx, 3.1, 1.01]}>
          <boxGeometry args={[0.3, 0.4, 0.1]} />
          <meshStandardMaterial color="#f7c6d9" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}
