"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Petal({ position, rotation, speed, amplitude }: {
  position: [number, number, number];
  rotation: [number, number, number];
  speed: number;
  amplitude: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];
  const timeOffset = Math.random() * Math.PI * 2;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed + timeOffset;
    meshRef.current.position.y = initialY + Math.sin(t) * amplitude;
    meshRef.current.position.x = position[0] + Math.sin(t * 0.7) * 0.3;
    meshRef.current.rotation.z = rotation[2] + Math.sin(t * 0.5) * 0.3;
    meshRef.current.rotation.x = rotation[0] + Math.cos(t * 0.3) * 0.2;
  });

  const petalShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.15, 0.15, 0.2, 0.4, 0, 0.5);
    shape.bezierCurveTo(-0.2, 0.4, -0.15, 0.15, 0, 0);
    return shape;
  }, []);

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <shapeGeometry args={[petalShape]} />
      <meshStandardMaterial
        color="#f7c6d9"
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function FloatingPetals({ count = 40 }: { count?: number }) {
  const petals = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      speed: 0.3 + Math.random() * 0.4,
      amplitude: 0.2 + Math.random() * 0.5,
    }));
  }, [count]);

  return (
    <group>
      {petals.map((p) => (
        <Petal key={p.id} {...p} />
      ))}
    </group>
  );
}
