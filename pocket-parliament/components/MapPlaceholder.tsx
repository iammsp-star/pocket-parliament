'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Box } from '@react-three/drei';

export default function MapPlaceholder() {
  return (
    <div className="absolute inset-0 bg-sky-100 dark:bg-zinc-900">
      <Canvas orthographic camera={{ position: [10, 10, 10], zoom: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        
        {/* Placeholder City Center */}
        <Box position={[0, 0.5, 0]} args={[2, 1, 2]}>
          <meshStandardMaterial color="#3b82f6" />
        </Box>
        
        <Box position={[-1.5, 0.25, -1.5]} args={[1, 0.5, 1]}>
          <meshStandardMaterial color="#f59e0b" />
        </Box>

        <Box position={[1.5, 1, 1.5]} args={[1, 2, 1]}>
          <meshStandardMaterial color="#8b5cf6" />
        </Box>

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>

        <OrbitControls 
          enableRotate={true} 
          enablePan={true} 
          enableZoom={true}
          maxPolarAngle={Math.PI / 2.5}
        />
        <Environment preset="city" />
      </Canvas>
      
      <div className="absolute top-24 right-8 bg-zinc-900/80 backdrop-blur-md text-white p-4 rounded-xl border border-zinc-800 pointer-events-none">
        <h3 className="font-bold mb-1">Live Map Data</h3>
        <p className="text-sm text-zinc-400">Low-poly visual feedback engine</p>
      </div>
    </div>
  );
}
