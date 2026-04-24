'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float, Text, Billboard, Sky, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '@/store/gameStore'
import { motion } from 'framer-motion'

// ─── Low-poly Terrain ────────────────────────────────────────────────────────

function TerrainTile({ position, color, height = 0.3, type }: {
  position: [number, number, number]
  color: string
  height?: number
  type?: 'water' | 'grass' | 'urban' | 'mountain' | 'industrial'
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={[1.9, height, 1.9]} />
      <meshLambertMaterial color={color} flatShading />
    </mesh>
  )
}

// ─── Building ─────────────────────────────────────────────────────────────────

function Building({ position, height, color, type }: {
  position: [number, number, number]
  height: number
  color: string
  type: string
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current && type === 'tower') {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.02
    }
  })

  return (
    <group position={position}>
      <mesh ref={ref} position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[0.5, height, 0.5]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
      {/* Roof detail */}
      <mesh position={[0, height + 0.1, 0]}>
        <pyramidGeometry args={[0.3, 0.2, 4]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
    </group>
  )
}

// ─── Tree / Nature ────────────────────────────────────────────────────────────

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.4, 5]} />
        <meshLambertMaterial color="#6b4c2a" flatShading />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <coneGeometry args={[0.28, 0.7, 6]} />
        <meshLambertMaterial color="#2d6a2d" flatShading />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <coneGeometry args={[0.18, 0.5, 6]} />
        <meshLambertMaterial color="#3a8a3a" flatShading />
      </mesh>
    </group>
  )
}

// ─── Airplane (Tourism) ───────────────────────────────────────────────────────

function Airplane({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  const speed = 0.3 + Math.random() * 0.2
  const radius = 5 + Math.random() * 3
  const offsetAngle = Math.random() * Math.PI * 2
  const height = position[1]

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + offsetAngle
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.z = Math.sin(t) * radius
    ref.current.position.y = height + Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    ref.current.rotation.y = -t + Math.PI / 2
  })

  return (
    <group ref={ref}>
      {/* Body */}
      <mesh>
        <cylinderGeometry args={[0.04, 0.07, 0.4, 6]} />
        <meshLambertMaterial color="#e2e8f0" flatShading />
      </mesh>
      {/* Wings */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.08, 0.45, 0.05]} />
        <meshLambertMaterial color="#cbd5e1" flatShading />
      </mesh>
    </group>
  )
}

// ─── Low-poly Water ────────────────────────────────────────────────────────────

function AnimatedWater({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2) * 0.05
    }
  })
  return (
    <mesh ref={ref} position={position} receiveShadow>
      <boxGeometry args={[1.8, 0.15, 1.8]} />
      <meshLambertMaterial color="#1e6fad" flatShading transparent opacity={0.8} />
    </mesh>
  )
}

// ─── Smoke / Pollution ────────────────────────────────────────────────────────

function SmokePuff({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime + position[0]
    ref.current.position.y = position[1] + (t % 2) * 0.8
    ref.current.material.opacity = Math.max(0, 0.5 - ((t % 2) / 2) * 0.5)
    ref.current.scale.setScalar(0.5 + ((t % 2) / 2) * 1.5)
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.12, 6, 5]} />
      <meshLambertMaterial color="#94a3b8" flatShading transparent opacity={0.4} />
    </mesh>
  )
}

// ─── The Main Scene ────────────────────────────────────────────────────────────

function IsometricScene() {
  const { socialMetrics, economicMetrics, laborDemographics, budget } = useGameStore()
  const { crime, education, infrastructure, environmentQuality } = socialMetrics
  const { tourism, technologicalAdvancement } = economicMetrics

  // Build terrain grid 7x7
  const grid = useMemo(() => {
    const tiles = []
    const size = 7

    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        const dist = Math.abs(x) + Math.abs(z)
        const isCoastal = (x === -3 || x === 3 || z === -3 || z === 3)
        const isUrban = (Math.abs(x) <= 1 && Math.abs(z) <= 1)
        const isIndustrial = ((x === 2 || x === -2) && Math.abs(z) <= 1)
        const isFarm = ((z === 2 || z === -2) && !isUrban)

        let tileType: 'water' | 'grass' | 'urban' | 'mountain' | 'industrial' = 'grass'
        let color = '#4a7c59'
        let height = 0.2 + Math.random() * 0.1

        if (isCoastal && Math.random() > 0.5) {
          tileType = 'water'
          color = '#1e3a8a'
          height = 0.1
        } else if (isUrban) {
          tileType = 'urban'
          color = infrastructure > 50 ? '#475569' : '#374151'
          height = 0.25
        } else if (isIndustrial) {
          tileType = 'industrial'
          color = '#3d3d3d'
          height = 0.22
        } else if (isFarm) {
          color = laborDemographics.primary > 35 ? '#65a30d' : '#4a7c59'
          height = 0.2
        } else {
          color = environmentQuality > 60 ? '#3d8c47' : environmentQuality > 40 ? '#4a7c59' : '#8a8a6a'
          height = 0.2 + Math.random() * 0.15
        }

        tiles.push({ x, z, type: tileType, color, height })
      }
    }
    return tiles
  }, [socialMetrics, economicMetrics, laborDemographics])

  const showAirplanes = tourism > 20
  const showSmoke = socialMetrics.environmentQuality < 50
  const numBuildings = Math.floor(infrastructure / 15)

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 14, 8]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#fef3c7"
      />
      <pointLight position={[-6, 6, -6]} intensity={0.4} color="#818cf8" />
      <pointLight position={[6, 4, 6]} intensity={0.3} color="#34d399" />

      {/* Sky */}
      <Sky sunPosition={[10, 3, 0]} turbidity={6} rayleigh={1.5} />

      {/* Sparkles for tech/soft power */}
      {technologicalAdvancement > 30 && (
        <Sparkles count={40} scale={12} size={1} speed={0.3} color="#818cf8" opacity={0.4} />
      )}

      {/* Terrain */}
      {grid.map(({ x, z, type, color, height }, i) => (
        type === 'water'
          ? <AnimatedWater key={i} position={[x * 2, 0, z * 2]} />
          : <TerrainTile key={i} position={[x * 2, 0, z * 2]} color={color} height={height} type={type} />
      ))}

      {/* Urban buildings */}
      {infrastructure > 20 && [
        [0, 0], [0.7, 0.4], [-0.6, 0.3], [0.4, -0.7], [-0.3, -0.5],
      ].slice(0, numBuildings).map(([bx, bz], i) => (
        <Building
          key={`b-${i}`}
          position={[bx * 2, 0.25, bz * 2]}
          height={0.6 + i * 0.4 + (infrastructure / 100) * 0.8}
          color={infrastructure > 60 ? '#94a3b8' : '#64748b'}
          type={i === 0 ? 'tower' : 'regular'}
        />
      ))}

      {/* Trees */}
      {environmentQuality > 30 && [
        [-4, -4], [-2, -6], [6, -2], [-6, 2], [4, 6],
        [2, 4], [-4, 2], [6, -5], [-5, 5]
      ].slice(0, Math.floor(environmentQuality / 15)).map(([tx, tz], i) => (
        <Tree key={`t-${i}`} position={[tx * 0.9, 0.25, tz * 0.9]} />
      ))}

      {/* Airplanes (Tourism) */}
      {showAirplanes && [1, 2].map(i => (
        <Airplane key={`plane-${i}`} position={[0, 3.5 + i * 0.8, 0]} />
      ))}

      {/* Smoke (Pollution) */}
      {showSmoke && [
        [4, 0.8, 2], [-4, 0.8, -2], [4, 0.8, -2]
      ].map((pos, i) => (
        <SmokePuff key={`smoke-${i}`} position={pos as [number, number, number]} />
      ))}

      {/* Floating labels */}
      <Float speed={1.5} floatIntensity={0.3}>
        <Billboard position={[0, 4.5, 0]}>
          <Text
            fontSize={0.35}
            color="#f8fafc"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.woff"
          >
            {useGameStore.getState().countryName}
          </Text>
        </Billboard>
      </Float>

      {/* Crime graffiti markers */}
      {crime > 55 && [
        [-2, 0.4, 0], [2, 0.4, -2], [0, 0.4, 2]
      ].map((pos, i) => (
        <mesh key={`crime-${i}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.08, 6, 5]} />
          <meshLambertMaterial color="#ef4444" flatShading />
        </mesh>
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={22}
        maxPolarAngle={Math.PI / 3}
        minPolarAngle={Math.PI / 6}
        autoRotate
        autoRotateSpeed={0.3}
        target={[0, 0, 0]}
      />
    </>
  )
}

// ─── Canvas Wrapper ────────────────────────────────────────────────────────────

export default function IsometricMap() {
  const { socialMetrics, budget } = useGameStore()
  const isCrisis = budget.debtToGDP > 90 || socialMetrics.crime > 75

  return (
    <div className="relative w-full h-full isometric-canvas">
      {/* Canvas */}
      <Canvas
        shadows
        camera={{ position: [12, 10, 12], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <IsometricScene />
        </Suspense>
      </Canvas>

      {/* Overlay badges */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none">
        <MapBadge
          icon="🌏"
          label={`GDP: ${formatCurrencyShort(useGameStore.getState().budget.totalGDP)}`}
          color="indigo"
        />
        <MapBadge
          icon="🌡️"
          label={`Approval: ${useGameStore.getState().overallApproval}%`}
          color={useGameStore.getState().overallApproval > 50 ? 'green' : 'red'}
        />
        {isCrisis && (
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [1, 0.7, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <MapBadge icon="🚨" label="CRISIS ACTIVE" color="red" />
          </motion.div>
        )}
      </div>

      {/* Corner hint */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <p className="text-[10px] text-slate-500 glass rounded-lg px-2 py-1">
          🖱️ Drag to orbit · Scroll to zoom
        </p>
      </div>
    </div>
  )
}

function MapBadge({ icon, label, color }: { icon: string; label: string; color: string }) {
  const colors: Record<string, string> = {
    indigo: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
    green: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
    red: 'bg-red-500/20 border-red-500/30 text-red-300',
  }
  return (
    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border backdrop-blur-sm ${colors[color] || colors.indigo}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  )
}

function formatCurrencyShort(v: number) {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}T`
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}B`
  return `$${v}M`
}
