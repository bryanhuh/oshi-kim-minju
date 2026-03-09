"use client";

import { Suspense, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

interface WorldArea {
  href: string;
  label: string;
  korean: string;
  position: [number, number, number];
  color: string;
  accentColor: string;
  icon: string;
  shape: "castle" | "garden" | "stage" | "library" | "lane";
}

const AREAS: WorldArea[] = [
  {
    href: "/profile",
    label: "Her Castle",
    korean: "성",
    position: [0, 0, 0],
    color: "#f4a7c1",
    accentColor: "#e8809e",
    icon: "♛",
    shape: "castle",
  },
  {
    href: "/gallery",
    label: "Flower Garden",
    korean: "정원",
    position: [-5.5, 0, -4],
    color: "#f7c6d9",
    accentColor: "#f4a7c1",
    icon: "✿",
    shape: "garden",
  },
  {
    href: "/dramas",
    label: "The Stage",
    korean: "무대",
    position: [5.5, 0, -4],
    color: "#e8809e",
    accentColor: "#d4607e",
    icon: "✦",
    shape: "stage",
  },
  {
    href: "/izone",
    label: "IZ*ONE Stage",
    korean: "아이즈원",
    position: [0, 0, -7],
    color: "#f4a7c1",
    accentColor: "#e8809e",
    icon: "★",
    shape: "stage",
  },
  {
    href: "/#breaking-news",
    label: "The Library",
    korean: "도서관",
    position: [-5.5, 0, 3],
    color: "#fde8f0",
    accentColor: "#f4a7c1",
    icon: "⬡",
    shape: "library",
  },
  {
    href: "/gallery?tab=instagram",
    label: "Memory Lane",
    korean: "기억",
    position: [5.5, 0, 3],
    color: "#f7c6d9",
    accentColor: "#e8809e",
    icon: "◈",
    shape: "lane",
  },
];

function CastleShape({
  color,
  accentColor,
}: {
  color: string;
  accentColor: string;
}) {
  return (
    <group>
      {/* Main tower */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.9, 1.2, 0.9]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Roof pyramid */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.7, 0.8, 4]} />
        <meshStandardMaterial
          color={accentColor}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      {/* Side towers */}
      {(
        [
          [-0.55, 0.4, -0.55],
          [0.55, 0.4, -0.55],
          [-0.55, 0.4, 0.55],
          [0.55, 0.4, 0.55],
        ] as [number, number, number][]
      ).map((pos, i) => (
        <group key={i} position={pos}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.8, 6]} />
            <meshStandardMaterial color={color} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.55, 0]} castShadow>
            <coneGeometry args={[0.22, 0.35, 6]} />
            <meshStandardMaterial color={accentColor} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function GardenShape({ color }: { color: string }) {
  return (
    <group>
      {Array.from({ length: 9 }, (_, i) => {
        const angle = (i / 9) * Math.PI * 2;
        const r = i < 5 ? 0.55 : 0.2;
        const x = i < 5 ? Math.cos(angle) * r : Math.cos(angle * 2) * 0.28;
        const z = i < 5 ? Math.sin(angle) * r : Math.sin(angle * 2) * 0.28;
        const h = 0.35 + (i % 3) * 0.12;
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, h / 2, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.06, h, 5]} />
              <meshStandardMaterial color="#a0785a" roughness={0.9} />
            </mesh>
            <mesh position={[0, h + 0.12, 0]} castShadow>
              <sphereGeometry args={[0.14 + (i % 3) * 0.04, 6, 6]} />
              <meshStandardMaterial color={color} roughness={0.5} />
            </mesh>
          </group>
        );
      })}
      {/* Center flower */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#e8809e" roughness={0.4} />
      </mesh>
    </group>
  );
}

function StageShape({
  color,
  accentColor,
}: {
  color: string;
  accentColor: string;
}) {
  return (
    <group>
      {/* Stage platform */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.16, 1.0]} />
        <meshStandardMaterial color={accentColor} roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 0.55, -0.42]} castShadow>
        <boxGeometry args={[1.2, 0.78, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Arch */}
      <mesh position={[0, 1.0, -0.42]}>
        <torusGeometry args={[0.35, 0.06, 6, 12, Math.PI]} />
        <meshStandardMaterial color={accentColor} roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Curtains */}
      {([-0.55, 0.55] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.55, -0.38]} castShadow>
          <boxGeometry args={[0.14, 0.78, 0.06]} />
          <meshStandardMaterial color={accentColor} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function LibraryShape({ color }: { color: string }) {
  return (
    <group>
      {/* Main building */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.2, 0.9, 0.85]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[1.3, 0.12, 0.95]} />
        <meshStandardMaterial color="#f4a7c1" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Books on shelves (decorative boxes) */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={i}
          position={[-0.42 + i * 0.2, 0.38, 0.44]}
          castShadow
        >
          <boxGeometry
            args={[0.12, 0.3 + (i % 2) * 0.1, 0.04]}
          />
          <meshStandardMaterial color={i % 2 === 0 ? "#f4a7c1" : "#e8809e"} roughness={0.8} />
        </mesh>
      ))}
      {/* Columns */}
      {([-0.44, 0.44] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.45, 0.44]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.9, 6]} />
          <meshStandardMaterial color="#f7c6d9" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function LaneShape({ color }: { color: string }) {
  return (
    <group>
      {/* Polaroid frames */}
      {(
        [
          [-0.32, 0.4, 0, 0.15],
          [0.32, 0.45, 0, -0.12],
          [0, 0.65, -0.1, 0.06],
        ] as [number, number, number, number][]
      ).map(([x, y, z, rot], i) => (
        <group key={i} position={[x, y, z]} rotation={[0, rot, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.45, 0.52, 0.03]} />
            <meshStandardMaterial color="white" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.04, 0.022]}>
            <planeGeometry args={[0.36, 0.36]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.19, 0.022]}>
            <planeGeometry args={[0.36, 0.06]} />
            <meshStandardMaterial color="white" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function AreaShape({ area }: { area: WorldArea }) {
  switch (area.shape) {
    case "castle":
      return <CastleShape color={area.color} accentColor={area.accentColor} />;
    case "garden":
      return <GardenShape color={area.color} />;
    case "stage":
      return <StageShape color={area.color} accentColor={area.accentColor} />;
    case "library":
      return <LibraryShape color={area.color} />;
    case "lane":
      return <LaneShape color={area.color} />;
    default:
      return null;
  }
}

function AreaGroup({
  area,
  onSelect,
}: {
  area: WorldArea;
  onSelect: (area: WorldArea) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const timeOffset = useMemo(
    () => AREAS.indexOf(area) * 0.9,
    [area]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y =
      area.position[1] + Math.sin(t * 0.45 + timeOffset) * 0.06;
    if (hovered) {
      groupRef.current.rotation.y +=
        (Math.sin(t * 2) * 0.01) * 0.5;
    }
  });

  return (
    <group
      ref={groupRef}
      position={area.position}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(area);
      }}
    >
      {/* Base platform */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <cylinderGeometry args={[1.1, 1.2, 0.12, 16]} />
        <meshStandardMaterial
          color={hovered ? area.accentColor : area.color}
          roughness={0.3}
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Shape */}
      <AreaShape area={area} />

      {/* Glow ring */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={hovered}>
        <ringGeometry args={[1.1, 1.35, 32]} />
        <meshStandardMaterial
          color={area.accentColor}
          emissive={area.accentColor}
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.22}
        color={hovered ? area.accentColor : "#2a1a20"}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {area.label}
      </Text>
      <Text
        position={[0, 1.92, 0]}
        fontSize={0.14}
        color="#f4a7c1"
        anchorX="center"
        anchorY="middle"
      >
        {area.korean}
      </Text>

      {/* Hover point light */}
      <pointLight
        color={area.accentColor}
        intensity={hovered ? 3 : 0}
        distance={4}
        position={[0, 1, 0]}
      />
    </group>
  );
}

function PathConnectors() {
  const paths = useMemo(() => {
    return AREAS.slice(1).map((area) => {
      const start = new THREE.Vector3(...AREAS[0].position);
      const end = new THREE.Vector3(...area.position);
      const mid = start.clone().lerp(end, 0.5);
      mid.y = 0.05;
      return { start, end, mid, color: area.color };
    });
  }, []);

  return (
    <>
      {paths.map((path, i) => {
        const dir = path.end.clone().sub(path.start);
        const length = dir.length();
        const center = path.start.clone().lerp(path.end, 0.5);
        const angle = Math.atan2(dir.x, dir.z);
        return (
          <mesh
            key={i}
            position={[center.x, 0.02, center.z]}
            rotation={[0, angle, 0]}
          >
            <planeGeometry args={[0.12, length - 1.8]} />
            <meshStandardMaterial
              color={path.color}
              transparent
              opacity={0.35}
              roughness={0.8}
            />
          </mesh>
        );
      })}
    </>
  );
}

function CameraController({
  target,
  onDone,
}: {
  target: WorldArea | null;
  onDone: () => void;
}) {
  const { camera } = useThree();
  const animating = useRef(false);
  const progress = useRef(0);
  const startPos = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useFrame((_, delta) => {
    if (!target || !animating.current) return;

    progress.current = Math.min(progress.current + delta * 0.9, 1);
    const t = THREE.MathUtils.smoothstep(progress.current, 0, 1);

    const endPos = new THREE.Vector3(
      target.position[0],
      target.position[1] + 3,
      target.position[2] + 5
    );
    camera.position.lerpVectors(startPos.current, endPos, t);

    const endTarget = new THREE.Vector3(...target.position);
    const currentTarget = new THREE.Vector3().lerpVectors(
      startTarget.current,
      endTarget,
      t
    );
    camera.lookAt(currentTarget);

    if (progress.current >= 1) {
      animating.current = false;
      setTimeout(() => doneRef.current(), 200);
    }
  });

  if (target && !animating.current) {
    animating.current = true;
    progress.current = 0;
    startPos.current.copy(camera.position);
    startTarget.current.set(0, 0, 0);
  }

  return null;
}

function Ground() {
  return (
    <>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
        <planeGeometry args={[50, 50, 20, 20]} />
        <meshStandardMaterial color="#fde8f0" roughness={0.9} />
      </mesh>
      {/* Subtle grid lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.13, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#f4a7c1"
          transparent
          opacity={0.06}
          wireframe
        />
      </mesh>
    </>
  );
}

function FloatingOrbs() {
  const count = 30;
  const orbsRef = useRef<THREE.Mesh[]>([]);

  const orbData = useMemo(() =>
    Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 22,
        0.4 + Math.random() * 3,
        (Math.random() - 0.5) * 18,
      ] as [number, number, number],
      speed: 0.3 + Math.random() * 0.4,
      offset: Math.random() * Math.PI * 2,
      size: 0.04 + Math.random() * 0.06,
    })), []);

  useFrame((state) => {
    orbsRef.current.forEach((orb, i) => {
      if (!orb) return;
      const d = orbData[i];
      orb.position.y =
        d.position[1] + Math.sin(state.clock.elapsedTime * d.speed + d.offset) * 0.4;
    });
  });

  return (
    <>
      {orbData.map((d, i) => (
        <mesh
          key={i}
          position={d.position}
          ref={(el) => {
            if (el) orbsRef.current[i] = el;
          }}
        >
          <sphereGeometry args={[d.size, 6, 6]} />
          <meshStandardMaterial
            color="#f7c6d9"
            emissive="#f4a7c1"
            emissiveIntensity={0.4}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </>
  );
}

export default function WorldScene({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const [selectedArea, setSelectedArea] = useState<WorldArea | null>(null);

  const handleSelect = (area: WorldArea) => {
    setSelectedArea(area);
  };

  const handleDone = () => {
    if (selectedArea) {
      onNavigate(selectedArea.href);
      setSelectedArea(null);
    }
  };

  return (
    <Canvas
      camera={{ position: [0, 10, 14], fov: 48 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "linear-gradient(to bottom, #fde8f0, #fdf0f5)" }}
      shadows
    >
      <Suspense fallback={null}>
        <fog attach="fog" args={["#fde8f0", 22, 55]} />
        <ambientLight intensity={0.7} color="#fff5f8" />
        <directionalLight
          position={[8, 14, 8]}
          intensity={1.4}
          color="#fdf0f5"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight
          position={[0, 6, 0]}
          color="#f7c6d9"
          intensity={1.5}
          distance={30}
        />

        <Ground />
        <FloatingOrbs />
        <PathConnectors />

        {AREAS.map((area) => (
          <AreaGroup key={area.href} area={area} onSelect={handleSelect} />
        ))}

        <CameraController target={selectedArea} onDone={handleDone} />
      </Suspense>
    </Canvas>
  );
}
