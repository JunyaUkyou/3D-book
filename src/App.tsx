import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import { Book } from "./components/Book";
import { Header } from "./components/Header";
import { ScrollDownMessage } from "./components/ScrollDownMessage";
import { useGetBookPage } from "./hooks/useGetBookPage";

// import { OrbitControls } from "@react-three/drei";

export default function App() {
  const pages = useGetBookPage();
  const totalPages = pages.length;

  return (
    <div className="w-screen h-screen bg-slate-950 font-sans text-white overflow-hidden select-none relative">
      <Header />

      <Canvas
        shadows
        camera={{
          position: [0, 0, 6],
          fov: 32,
        }}
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

        <ScrollControls pages={totalPages} damping={0.2}>
          <Book pages={pages} totalPages={totalPages} />
        </ScrollControls>
        {/* <OrbitControls
          target={[0, 0, 0]}
          enableZoom={false}
          enablePan={false}
        /> */}
        <axesHelper args={[5]} />
      </Canvas>

      <ScrollDownMessage />
    </div>
  );
}
