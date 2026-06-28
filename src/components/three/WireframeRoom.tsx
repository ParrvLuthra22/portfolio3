'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

function CameraRig() {
  const { mouse, camera } = useThree();

  useFrame((state) => {
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mouse.x * 1.5,
      0.025
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      mouse.y * 0.6 + 0.3,
      0.025
    );
    camera.lookAt(
      THREE.MathUtils.lerp(0, mouse.x * 0.5, 0.05),
      THREE.MathUtils.lerp(0, mouse.y * 0.3, 0.05),
      -8
    );
  });

  return null;
}

function CorridorFrame({
  z,
  opacity,
  scale,
}: {
  z: number;
  opacity: number;
  scale: number;
}) {
  const w = 14 * scale;
  const h = 9 * scale;

  const points: [number, number, number][] = [
    [-w / 2, -h / 2, 0],
    [w / 2, -h / 2, 0],
    [w / 2, h / 2, 0],
    [-w / 2, h / 2, 0],
    [-w / 2, -h / 2, 0],
  ];

  return (
    <Line
      points={points}
      color="#FF4500"
      lineWidth={1}
      transparent
      opacity={opacity}
      position={[0, 0, z]}
    />
  );
}

function HorizontalLines({ z, opacity }: { z: number; opacity: number }) {
  const count = 5;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const y = -4.5 + (i / (count - 1)) * 9;
        return (
          <Line
            key={i}
            points={[[-8, y, z], [8, y, z]]}
            color="#FF4500"
            lineWidth={0.5}
            transparent
            opacity={opacity * 0.4}
          />
        );
      })}
    </>
  );
}

function FloorGrid() {
  const size = 80;
  const divisions = 30;
  const step = size / divisions;
  const lines: [number, number, number][][] = [];

  for (let i = 0; i <= divisions; i++) {
    const x = -size / 2 + i * step;
    lines.push([
      [x, -4.5, -size / 2],
      [x, -4.5, 0],
    ]);
  }
  for (let i = 0; i <= divisions; i++) {
    const z = -size / 2 + i * step;
    lines.push([
      [-size / 2, -4.5, z],
      [size / 2, -4.5, z],
    ]);
  }

  return (
    <>
      {lines.map((pts, i) => (
        <Line
          key={i}
          points={pts as [number, number, number][]}
          color="#FF4500"
          lineWidth={0.4}
          transparent
          opacity={0.08}
        />
      ))}
    </>
  );
}

function Particles() {
  const count = 150;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = -(Math.random() * 60);
    }
    return arr;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FF4500"
        size={0.04}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  const frameCount = 10;
  const corridorFrames = useMemo(
    () =>
      Array.from({ length: frameCount }, (_, i) => ({
        z: -(i * 7) - 3,
        opacity: Math.max(0.04, 0.45 - i * 0.04),
        scale: 1 - i * 0.015,
      })),
    []
  );

  return (
    <>
      <fog attach="fog" args={['#0A0A0A', 15, 75]} />
      <CameraRig />
      <FloorGrid />
      <Particles />
      {corridorFrames.map(({ z, opacity, scale }, i) => (
        <group key={i}>
          <CorridorFrame z={z} opacity={opacity} scale={scale} />
          {i % 2 === 0 && <HorizontalLines z={z} opacity={opacity} />}
        </group>
      ))}
    </>
  );
}

export default function WireframeRoom() {
  return (
    <Canvas
      camera={{ position: [0, 0, 0], fov: 70, near: 0.01, far: 200 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene />
    </Canvas>
  );
}
