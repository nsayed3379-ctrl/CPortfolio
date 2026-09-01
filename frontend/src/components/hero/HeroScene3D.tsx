"use client";

// Real WebGL 3D replacement for the old flat-SVG hero diagram (see
// HeroVisual.tsx for the dynamic-import wrapper). Same "hub + four
// satellite nodes" contract the SVG version used to document, now
// actually rendered in three.js via react-three-fiber.
//
// Deliberately textless: the ticker directly below the hero already
// scrolls AI / DATA / SOFTWARE / CLOUD / etc, so labelling these shapes
// too was pure repetition. The accessible description lives on the
// container's aria-label instead of baked-in DOM text.

import { Suspense, useMemo, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, Line, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const COLOR_ELECTRIC = "#2e5eff";
const COLOR_ELECTRIC_SOFT = "#3f6bff";
const COLOR_CYAN = "#0891b2";

const NODES = [
  { key: "ai", angle: 90, radius: 2.7, y: 0.6 },
  { key: "software", angle: 0, radius: 2.85, y: -0.15 },
  { key: "cloud", angle: 270, radius: 2.7, y: -0.6 },
  { key: "data", angle: 180, radius: 2.85, y: 0.15 },
];

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function useReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}

function SatelliteNode({
  position,
  reducedMotion,
}: {
  position: [number, number, number];
  reducedMotion: boolean;
}) {
  return (
    <Float
      speed={reducedMotion ? 0 : 1.6}
      rotationIntensity={reducedMotion ? 0 : 0.4}
      floatIntensity={reducedMotion ? 0 : 0.8}
      position={position}
    >
      <mesh>
        <sphereGeometry args={[0.5, 48, 48]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.85}
          thickness={0.9}
          roughness={0.12}
          ior={1.3}
          clearcoat={1}
          clearcoatRoughness={0.08}
          attenuationColor={COLOR_ELECTRIC_SOFT}
          attenuationDistance={1.2}
          envMapIntensity={1.4}
        />
      </mesh>
    </Float>
  );
}

type DashMaterial = THREE.Material & { dashOffset?: number };
type DashedLine2 = THREE.Object3D & { material: DashMaterial };

function OrbitLines({ positions }: { positions: [number, number, number][] }) {
  const lineRefs = useRef<(DashedLine2 | null)[]>([]);

  useFrame((_, delta) => {
    for (const line of lineRefs.current) {
      const mat = line?.material;
      if (mat && typeof mat.dashOffset === "number") {
        mat.dashOffset -= delta * 0.6;
      }
    }
  });

  return (
    <group>
      {positions.map((pos, i) => (
        <Line
          key={i}
          ref={(el) => {
            lineRefs.current[i] = el as unknown as DashedLine2 | null;
          }}
          points={[[0, 0, 0], pos]}
          color={COLOR_ELECTRIC_SOFT}
          transparent
          opacity={0.5}
          lineWidth={1}
          dashed
          dashScale={6}
          dashSize={1}
          gapSize={0.6}
        />
      ))}
    </group>
  );
}

function Hub({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!reducedMotion && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.rotation.x += delta * 0.06;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial
          color={COLOR_ELECTRIC}
          transmission={0.8}
          thickness={1.6}
          roughness={0.1}
          ior={1.4}
          clearcoat={1}
          clearcoatRoughness={0.06}
          attenuationColor={COLOR_ELECTRIC}
          attenuationDistance={1.5}
          envMapIntensity={1.6}
        />
      </mesh>
      {/* soft outer glow halo */}
      <mesh scale={1.7}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color={COLOR_ELECTRIC_SOFT} transparent opacity={0.07} />
      </mesh>
    </group>
  );
}

function Scene() {
  const reducedMotion = useReducedMotion();
  const groupRef = useRef<THREE.Group>(null);

  const positions = useMemo<[number, number, number][]>(
    () =>
      NODES.map((n) => {
        const rad = (n.angle * Math.PI) / 180;
        return [Math.cos(rad) * n.radius, n.y, Math.sin(rad) * n.radius];
      }),
    []
  );

  useFrame((_, delta) => {
    if (!reducedMotion && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 4]} intensity={30} color={COLOR_ELECTRIC} distance={12} decay={2} />
      <pointLight position={[-3, -2, -3]} intensity={16} color={COLOR_CYAN} distance={12} decay={2} />

      {/* Procedural environment (no external HDR fetch) so the glass
          materials below have something to reflect/refract. */}
      <Environment resolution={256}>
        <Lightformer intensity={3} color={COLOR_ELECTRIC} position={[0, 4, 2]} scale={[8, 2, 1]} />
        <Lightformer intensity={2} color={COLOR_CYAN} position={[-5, -2, -3]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer intensity={2} color="#ffffff" position={[5, 1, 3]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer intensity={1.5} color="#ffffff" position={[0, -5, 0]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
      </Environment>

      <Sparkles count={40} scale={6} size={1.5} speed={reducedMotion ? 0 : 0.25} color={COLOR_ELECTRIC_SOFT} opacity={0.35} />

      <group ref={groupRef}>
        <Hub reducedMotion={reducedMotion} />
        <OrbitLines positions={positions} />
        {NODES.map((node, i) => (
          <SatelliteNode key={node.key} position={positions[i]} reducedMotion={reducedMotion} />
        ))}
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 2 - 0.6}
        maxPolarAngle={Math.PI / 2 + 0.6}
      />
    </>
  );
}

export default function HeroScene3D() {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg"
      role="img"
      aria-label="Interactive 3D diagram showing VecoSoft at the center of AI, Data, Software, and Cloud capabilities"
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.6, 8.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ touchAction: "none" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
