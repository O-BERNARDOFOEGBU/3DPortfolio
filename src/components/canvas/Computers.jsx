import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  return (
    <mesh>
      <primitive
        object={computer?.scene}
        scale={isMobile ? 0.7 : 0.75}
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleWebGLContextLost = (event) => {
      event.preventDefault();
      // Handle context loss here (e.g., show an error message, reload the page)
      console.error("WebGL context lost. Please refresh the page.");
    };

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    if (canvasRef.current) {
      canvasRef.current.addEventListener(
        "webglcontextlost",
        handleWebGLContextLost,
        false
      );
    }

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener(
          "webglcontextlost",
          handleWebGLContextLost,
          false
        );
      }
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <div>
      {canvasRef.current ? (
        <Canvas
          onCreated={({ gl }) => {
            canvasRef.current = gl;
            gl.physicallyCorrectLights = false;
            gl.toneMapping = 0; // No tone mapping
            gl.outputEncoding = 3000; // THREE.sRGBEncoding
            gl.antialias = false; // Disable antialiasing
            gl.powerPreference = "low-power"; // Optimize for low-power devices
            gl.setPixelRatio(0.5); // Lower pixel ratio for performance on low-end devices
          }}
          frameloop="demand"
          dpr={1}
          camera={{ position: [20, 3, 5], fov: 25 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <OrbitControls
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
            <Computers isMobile={isMobile} />
          </Suspense>

          <Preload all />
        </Canvas>
      ) : (
        <div>Error: WebGL not supported. Please use a modern browser.</div>
      )}
    </div>
  );
};

export default ComputersCanvas;
