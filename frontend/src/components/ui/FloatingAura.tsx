"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function AnimatedShapes() {
    const meshRef1 = useRef<THREE.Mesh>(null!);
    const meshRef2 = useRef<THREE.Mesh>(null!);
    const meshRef3 = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef1.current) {
            meshRef1.current.rotation.x = Math.cos(t / 4) / 8;
            meshRef1.current.rotation.y = Math.sin(t / 4) / 8;
        }
        if (meshRef2.current) {
            meshRef2.current.rotation.x = Math.sin(t / 4) / 8;
            meshRef2.current.rotation.y = Math.cos(t / 4) / 8;
        }
    });

    return (
        <>
            <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
                <Sphere args={[1.2, 64, 64]} position={[-3, 1, -2]} ref={meshRef1}>
                    <MeshDistortMaterial
                        color="#f7c6d9"
                        speed={2}
                        distort={0.4}
                        transparent
                        opacity={0.15}
                        roughness={0.1}
                    />
                </Sphere>
            </Float>

            <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
                <Sphere args={[0.8, 64, 64]} position={[3, -1, -3]} ref={meshRef2}>
                    <MeshDistortMaterial
                        color="#f4a7c1"
                        speed={3}
                        distort={0.5}
                        transparent
                        opacity={0.1}
                        roughness={0.2}
                    />
                </Sphere>
            </Float>

            <Float speed={1.2} rotationIntensity={1.5} floatIntensity={1}>
                <Sphere args={[1, 64, 64]} position={[0, -2, -1]} ref={meshRef3}>
                    <MeshDistortMaterial
                        color="#fde8f0"
                        speed={1.5}
                        distort={0.3}
                        transparent
                        opacity={0.2}
                        roughness={0}
                    />
                </Sphere>
            </Float>
        </>
    );
}

function Particles({ count = 100 }) {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 15;
            p[i * 3 + 1] = (Math.random() - 0.5) * 10;
            p[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return p;
    }, [count]);

    const ref = useRef<THREE.Points>(null!);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y += 0.001;
            ref.current.rotation.x += 0.0005;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[points, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color="#f4a7c1"
                transparent
                opacity={0.4}
                sizeAttenuation
            />
        </points>
    );
}

export default function FloatingAura() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#f4a7c1" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f7c6d9" />
                <AnimatedShapes />
                <Particles count={150} />
            </Canvas>
        </div>
    );
}
