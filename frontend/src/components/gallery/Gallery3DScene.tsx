"use client";

import { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import type { GalleryImage } from "@/types";

function PictureFrame({
  image,
  position,
  rotation,
  index,
  onClick,
}: {
  image: GalleryImage;
  position: [number, number, number];
  rotation: [number, number, number];
  index: number;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [hovered, setHovered] = useState(false);
  const timeOffset = useMemo(() => index * 0.73, [index]);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    loader.load(
      image.thumbnailUrl ?? image.url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      () => {}
    );
    return () => {
      texture?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image.thumbnailUrl, image.url]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y =
      position[1] + Math.sin(t * 0.38 + timeOffset) * 0.14;
    groupRef.current.rotation.z = Math.sin(t * 0.28 + timeOffset) * 0.025;
  });

  const frameColor = hovered ? "#e8809e" : "#f4a7c1";

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Outer frame */}
      <mesh castShadow>
        <boxGeometry args={[2.6, 3.6, 0.09]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={0.25}
          metalness={0.4}
        />
      </mesh>
      {/* Inner mat */}
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[2.25, 3.25, 0.02]} />
        <meshStandardMaterial color="#fff8fb" roughness={0.9} />
      </mesh>
      {/* Image */}
      <mesh position={[0, 0.05, 0.075]}>
        <planeGeometry args={[2.1, 2.95]} />
        <meshStandardMaterial
          map={texture ?? undefined}
          color={texture ? "#ffffff" : "#fde8f0"}
          roughness={0.7}
        />
      </mesh>
      {/* Caption */}
      {image.source && (
        <Text
          position={[0, -2.0, 0.1]}
          fontSize={0.11}
          color="#e8809e"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
        >
          {image.source}
        </Text>
      )}
      {/* Hover glow */}
      {hovered && (
        <pointLight color="#f7c6d9" intensity={3} distance={5} />
      )}
    </group>
  );
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 180;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 34;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.018;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#f4a7c1"
        size={0.055}
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({
  images,
  onImageClick,
}: {
  images: GalleryImage[];
  onImageClick: (img: GalleryImage) => void;
}) {
  const limited = images.slice(0, 10);

  const frameData = useMemo(() => {
    const N = limited.length;
    return limited.map((img, i) => {
      const t = N <= 1 ? 0.5 : i / (N - 1);
      const angle = (t - 0.5) * Math.PI * 0.85;
      const radius = 12;
      return {
        image: img,
        position: [
          Math.sin(angle) * radius,
          (((i * 7) % 5) - 2) * 0.18,
          -Math.cos(angle) * radius,
        ] as [number, number, number],
        rotation: [0, -angle, 0] as [number, number, number],
      };
    });
  }, [limited]);

  return (
    <>
      <fog attach="fog" args={["#fde8f0", 18, 45]} />
      <ambientLight intensity={0.55} color="#fff5f8" />
      <directionalLight
        position={[0, 10, 6]}
        intensity={1.2}
        color="#fdf0f5"
        castShadow
      />
      <pointLight position={[0, 2, 4]} color="#f7c6d9" intensity={2} distance={25} />

      <FloatingParticles />

      {frameData.map((f, i) => (
        <group key={f.image.id}>
          <PictureFrame
            image={f.image}
            position={f.position}
            rotation={f.rotation}
            index={i}
            onClick={() => onImageClick(f.image)}
          />
          {/* Spotlight from above */}
          <spotLight
            position={[f.position[0], f.position[1] + 6, f.position[2] + 2]}
            intensity={1.8}
            angle={0.38}
            penumbra={0.6}
            color="#fff0f5"
            castShadow
          />
        </group>
      ))}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#fde8f0" transparent opacity={0.35} />
      </mesh>

      <OrbitControls
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 5}
        enableZoom
        minDistance={3.5}
        maxDistance={18}
        autoRotate
        autoRotateSpeed={0.35}
        dampingFactor={0.08}
        enableDamping
      />
    </>
  );
}

export default function Gallery3DScene({
  images,
  onImageClick,
}: {
  images: GalleryImage[];
  onImageClick: (img: GalleryImage) => void;
}) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{ height: "68vh" }}
      >
        <Canvas
          camera={{ position: [0, 1.5, 9], fov: 52 }}
          gl={{ antialias: true, alpha: true }}
          style={{
            background:
              "linear-gradient(to bottom, #fde8f0 0%, #fdf0f5 50%, #fdf7fa 100%)",
          }}
          shadows
        >
          <Suspense fallback={null}>
            <Scene images={images} onImageClick={onImageClick} />
          </Suspense>
        </Canvas>
      </div>
      <p className="text-center text-[#2a1a20]/35 text-xs tracking-[0.25em]">
        drag to rotate · scroll to zoom · click to view
      </p>
    </div>
  );
}
