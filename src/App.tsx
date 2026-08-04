import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import { Book } from "./components/Book";

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setIsOpened(false);
    setResetKey((prev) => prev + 1);
  };

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

        <div className="flex items-center gap-3 pointer-events-auto">
          <span
            className={`px-3 py-1 text-xs rounded-full border ${
              isOpened
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-amber-500/10 border-amber-500/30 text-amber-300 animate-pulse"
            }`}
          >
            {isOpened ? "● OPENED (Scroll active)" : "○ OPENING COVER..."}
          </span>

          <button
            onClick={handleReset}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
          >
            Replay Opening
          </button>
        </div>
      </header>

      {/* スクロール誘導メッセージ */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
        <div
          className={`transition-all duration-700 ${
            isOpened ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-full text-xs text-slate-300 shadow-xl">
            <span>↓ スクロールしてページをめくってください</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        key={resetKey}
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

        <ScrollControls pages={isOpened ? 5 : 1} damping={0.2}>
          <Book isOpened={isOpened} setIsOpened={setIsOpened} />
        </ScrollControls>
      </Canvas>
    </div>
  );
}
