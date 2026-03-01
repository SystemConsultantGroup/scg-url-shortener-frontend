import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Text, MeshTransmissionMaterial } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function FloatingShape({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position}>
    <torusKnotGeometry args={[0.3, 0.1, 256, 64]} />
      <MeshTransmissionMaterial
        backside
        backsideThickness={1}
        thickness={1}
        roughness={0}
        transmission={1}
        ior={1.1}
        chromaticAberration={0}
        anisotropy={0}
        color={color}
        resolution={1024}
        samples={32}
      />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute p-6 inset-0 z-0 h-screen w-full pointer-events-none">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <Environment preset="studio" />
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        
        {/* Background Text in 3D for Refraction */}
        <Text
          position={[0, 0, -2]}
          fontSize={0.9}
          lineHeight={1}
          font="https://cdn.jsdelivr.net/npm/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff"
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Shorten.{"\n"}Simplify.
        </Text>

        {/* Single Shape at top-left of text */}
        <FloatingShape position={[0, 0, 1.5]} color="#ffffff" />
      </Canvas>
    </div>
  );
}
