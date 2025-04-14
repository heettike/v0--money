"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useRef, useState, useEffect } from "react"
import * as THREE from "three"

const isMobile = () => {
  if (typeof window === "undefined") return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

const BoxWithEdges = ({ position, color = "#0070f3", edgeColor = "#214dbd", scale = [0.5, 0.5, 0.5] }) => {
  return (
    <group position={position}>
      <mesh scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.1}
          metalness={0.8}
          transparent={true}
          opacity={0.9}
          transmission={0.5}
          clearcoat={1}
        />
      </mesh>
      <lineSegments scale={scale}>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial color={edgeColor} linewidth={2} />
      </lineSegments>
    </group>
  )
}

const DollarSign = ({ position }) => {
  // Custom dollar sign with larger size and different color
  return (
    <group position={position}>
      {/* Vertical line */}
      <BoxWithEdges position={[0, 0, 0]} scale={[0.25, 2.5, 0.5]} color="#00d700" edgeColor="#00a000" />

      {/* Top curve */}
      <BoxWithEdges position={[0.5, 0.75, 0]} scale={[0.5, 0.5, 0.5]} color="#00d700" edgeColor="#00a000" />
      <BoxWithEdges position={[0.25, 1.25, 0]} scale={[0.5, 0.5, 0.5]} color="#00d700" edgeColor="#00a000" />
      <BoxWithEdges position={[-0.25, 1.25, 0]} scale={[0.5, 0.5, 0.5]} color="#00d700" edgeColor="#00a000" />
      <BoxWithEdges position={[-0.5, 0.75, 0]} scale={[0.5, 0.5, 0.5]} color="#00d700" edgeColor="#00a000" />

      {/* Middle */}
      <BoxWithEdges position={[0.25, 0, 0]} scale={[0.5, 0.5, 0.5]} color="#00d700" edgeColor="#00a000" />
      <BoxWithEdges position={[-0.25, 0, 0]} scale={[0.5, 0.5, 0.5]} color="#00d700" edgeColor="#00a000" />

      {/* Bottom curve */}
      <BoxWithEdges position={[0.5, -0.75, 0]} scale={[0.5, 0.5, 0.5]} color="#00d700" edgeColor="#00a000" />
      <BoxWithEdges position={[0.25, -1.25, 0]} scale={[0.5, 0.5, 0.5]} color="#00d700" edgeColor="#00a000" />
      <BoxWithEdges position={[-0.25, -1.25, 0]} scale={[0.5, 0.5, 0.5]} color="#00d700" edgeColor="#00a000" />
      <BoxWithEdges position={[-0.5, -0.75, 0]} scale={[0.5, 0.5, 0.5]} color="#00d700" edgeColor="#00a000" />
    </group>
  )
}

const BoxLetter = ({ letter, position }) => {
  const group = useRef()

  const getLetterShape = (letter) => {
    const shapes = {
      N: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1],
      ],
      E: [
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 0],
        [1, 0, 0],
        [1, 1, 1],
      ],
      X: [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1],
      ],
      T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
      M: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
      ],
      O: [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
      ],
      Y: [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
      ],
    }
    return shapes[letter] || shapes["N"] // Default to 'N' if letter is not found
  }

  const letterShape = getLetterShape(letter)

  return (
    <group ref={group} position={position}>
      {letterShape.map((row, i) =>
        row.map((cell, j) => {
          if (cell) {
            let xOffset = j * 0.5

            // Adjust positioning based on letter
            if (letter === "N" || letter === "M" || letter === "Y") {
              xOffset = j * 0.5 - 1
            } else if (letter === "E") {
              xOffset = j * 0.5 - 0.5
            } else if (letter === "O") {
              xOffset = j * 0.5 - 0.75
            }

            return <BoxWithEdges key={`${i}-${j}`} position={[xOffset, (4 - i) * 0.5 - 1, 0]} />
          }
          return null
        }),
      )}
    </group>
  )
}

const Scene = () => {
  const orbitControlsRef = useRef()
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  useEffect(() => {
    setIsMobileDevice(isMobile())
  }, [])

  return (
    <>
      <group position={[-1, 0, 0]} rotation={[0, Math.PI / 1.5, 0]}>
        <DollarSign position={[-8, 0, 0]} />
        <BoxLetter letter="M" position={[-4, 0, 0]} />
        <BoxLetter letter="O" position={[-2, 0, 0]} />
        <BoxLetter letter="N" position={[0, 0, 0]} />
        <BoxLetter letter="E" position={[2, 0, 0]} />
        <BoxLetter letter="Y" position={[4, 0, 0]} />
      </group>
      <OrbitControls
        ref={orbitControlsRef}
        enableZoom
        enablePan
        enableRotate
        autoRotate
        autoRotateSpeed={2}
        rotation={[Math.PI, 0, 0]}
      />

      <ambientLight intensity={0.5} />

      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />

      <Environment
        files={
          isMobileDevice
            ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download3-7FArHVIJTFszlXm2045mQDPzsZqAyo.jpg"
            : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dither_it_M3_Drone_Shot_equirectangular-jpg_San_Francisco_Big_City_1287677938_12251179%20(1)-NY2qcmpjkyG6rDp1cPGIdX0bHk3hMR.jpg"
        }
        background
      />
    </>
  )
}

export default function Component() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas camera={{ position: [10.047021, -0.127436, -11.137374], fov: 50 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
