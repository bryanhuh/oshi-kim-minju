"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import FloatingPetals from "./FloatingPetals";
import DreamCastle from "./DreamCastle";

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
      <planeGeometry args={[60, 60, 20, 20]} />
      <meshStandardMaterial color="#fde8f0" transparent opacity={0.8} />
    </mesh>
  );
}

function ScrollCamera({ scrollY }: { scrollY: number }) {
  const { camera } = useThree();
  const targetZ = useRef(5);

  useFrame(() => {
    targetZ.current = 5 - scrollY * 0.005;
    camera.position.z += (targetZ.current - camera.position.z) * 0.05;
    camera.position.y += (scrollY * 0.003 - camera.position.y) * 0.05;
  });

  return null;
}

function FloatingLights() {
  const light1 = useRef<THREE.PointLight>(null);
  const light2 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (light1.current) {
      light1.current.position.x = Math.sin(t * 0.5) * 5;
      light1.current.position.y = 2 + Math.cos(t * 0.3) * 1;
    }
    if (light2.current) {
      light2.current.position.x = Math.cos(t * 0.4) * 6;
      light2.current.position.z = Math.sin(t * 0.3) * 3;
    }
  });

  return (
    <>
      <pointLight ref={light1} color="#f7c6d9" intensity={3} distance={15} />
      <pointLight ref={light2} color="#fde8f0" intensity={2} distance={12} position={[3, 1, 2]} />
    </>
  );
}

interface HeroSceneProps {
  scrollY?: number;
}

export default function HeroScene({ scrollY = 0 }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 100 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
      shadows
    >
      <Suspense fallback={null}>
        <fog attach="fog" args={["#fde8f0", 8, 30]} />
        <ambientLight intensity={0.8} color="#fff5f8" />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.5}
          color="#fde8f0"
          castShadow
        />
        <FloatingLights />
        <FloatingPetals count={50} />
        <DreamCastle />
        <Ground />
        <ScrollCamera scrollY={scrollY} />
      </Suspense>
    </Canvas>
  );
}
