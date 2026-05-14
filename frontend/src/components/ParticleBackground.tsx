"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useState, useRef } from "react";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";

function ParticleField() {
  const ref = useRef<any>(null);
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {sphere && (
        <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color="#3BA5FF"
            size={0.005}
            sizeAttenuation={true}
            depthWrite={false}
          />
        </Points>
      )}
    </group>
  );
}

export function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-[var(--color-volt-black)]">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleField />
      </Canvas>
    </div>
  );
}
