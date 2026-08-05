import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import { Book } from "./components/Book";
// import { Stats, OrbitControls } from "@react-three/drei";

export default function App() {
  return (
    <div className="w-screen h-screen bg-slate-950 font-sans text-white overflow-hidden select-none relative">
      {/* ヘッダーUI */}
      <header className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center pointer-events-none">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-amber-200">
            3D BOOK EXPERIENCE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            React Three Fiber + Scroll-driven Flip Animation
          </p>
        </div>
      </header>

      {/* スクロール誘導メッセージ */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
        <div className="px-4 py-2 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-full text-xs text-slate-300 shadow-xl">
          <span>↓ スクロールしてページをめくってください</span>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 6], fov: 32 }}
        className="w-full h-full"
      >
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={2.0}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />
        <pointLight position={[-5, 5, -2]} intensity={0.5} />

        <ScrollControls pages={6} damping={0.2}>
          <Book />
        </ScrollControls>
        {/* <OrbitControls />
        <Stats /> */}
      </Canvas>
    </div>
  );
}
