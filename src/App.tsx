import React, { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll, ContactShadows } from "@react-three/drei";

// 2D Canvasを使用して高精細なテクスチャを即時生成するヘルパー関数
// これにより RenderTexture / createReconciler 起因の環境エラーを完璧に回避します
function createPageCanvasTexture({
  title,
  chapter = "",
  content = "",
  pageNumber,
  bgColor = "#fdfbf7",
  textColor = "#2d3748",
  borderColor = "#e2e8f0",
  isCover = false,
  coverSubtitle = "",
}: {
  title: string;
  chapter?: string;
  content?: string;
  pageNumber?: number | string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  isCover?: boolean;
  coverSubtitle?: string;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 736;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 背景
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (isCover) {
    // 表紙装飾フレーム
    ctx.strokeStyle = "#d69e2e";
    ctx.lineWidth = 10;
    ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

    ctx.strokeStyle = "#ecc94b";
    ctx.lineWidth = 2;
    ctx.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);

    // 表紙タイトル
    ctx.fillStyle = "#ecc94b";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, 220);

    // 表紙サブタイトル
    if (coverSubtitle) {
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "20px sans-serif";
      ctx.fillText(coverSubtitle, canvas.width / 2, 290);
    }

    // 案内
    ctx.fillStyle = "#a0aec0";
    ctx.font = "16px sans-serif";
    ctx.fillText(
      "SCROLL DOWN TO TURN PAGES",
      canvas.width / 2,
      canvas.height - 80,
    );
  } else {
    // 通常ページのフレーム
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // 章タイトル
    if (chapter) {
      ctx.fillStyle = "#718096";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(chapter.toUpperCase(), canvas.width / 2, 75);
    }

    // ページタイトル
    ctx.fillStyle = textColor;
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, 135);

    // タイトル下の区切り線
    ctx.beginPath();
    ctx.moveTo(80, 160);
    ctx.lineTo(canvas.width - 80, 160);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 本文折り返し描画
    if (content) {
      ctx.fillStyle = textColor;
      ctx.font = "20px sans-serif";
      ctx.textAlign = "left";

      const maxWidth = 410;
      const startX = 50;
      let startY = 220;
      const lineHeight = 36;

      let line = "";
      for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const testLine = line + char;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, startX, startY);
          line = char;
          startY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, startX, startY);
    }

    // ページ番号
    if (pageNumber !== undefined) {
      ctx.fillStyle = "#a0aec0";
      ctx.font = "18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`- ${pageNumber} -`, canvas.width / 2, canvas.height - 45);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

interface PageMeshProps {
  number: number;
  totalPages: number;
  title: string;
  chapter: string;
  content: string;
  isOpened: boolean;
}

const PageMesh: React.FC<PageMeshProps> = ({
  number,
  totalPages,
  title,
  chapter,
  content,
  isOpened,
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const scroll = useScroll();

  // 表面テクスチャ
  const frontTexture = useMemo(() => {
    return createPageCanvasTexture({
      title,
      chapter,
      content,
      pageNumber: number * 2 + 1,
    });
  }, [title, chapter, content, number]);

  // 裏面テクスチャ
  const backTexture = useMemo(() => {
    return createPageCanvasTexture({
      title: `${title} (解説)`,
      chapter: "",
      content:
        "前のページの詳細な解説および補足資料がこちらに記載されています。",
      pageNumber: number * 2 + 2,
      bgColor: "#edf2f7",
    });
  }, [title, number]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!isOpened) {
      // 本が開く前は右側で待機
      groupRef.current.rotation.y = 0;
      groupRef.current.position.z = (totalPages - number) * 0.006;
      return;
    }

    // スクロールに応じたページめくり
    const scrollOffset = scroll.offset;
    const pageStep = 1 / totalPages;
    const pageStart = number * pageStep;
    const progress = Math.max(
      0,
      Math.min(1, (scrollOffset - pageStart) / pageStep),
    );

    // 0度（右）から -180度（左）へ回転
    const targetRotationY = -progress * Math.PI;
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotationY,
      12,
      delta,
    );

    // 重なり順と浮き上がり（アーチ効果）
    const isFlipped = progress > 0.5;
    const baseZ = isFlipped
      ? 0.01 + number * 0.006
      : (totalPages - number) * 0.006;
    const arcLift = Math.sin(progress * Math.PI) * 0.15;

    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      baseZ + arcLift,
      12,
      delta,
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, (totalPages - number) * 0.006]}>
      {/* 表面 */}
      <mesh position={[0.8, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[1.6, 2.3]} />
        <meshStandardMaterial
          map={frontTexture}
          side={THREE.FrontSide}
          roughness={0.3}
        />
      </mesh>

      {/* 裏面 */}
      <mesh
        position={[0.8, 0, -0.001]}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[1.6, 2.3]} />
        <meshStandardMaterial
          map={backTexture}
          side={THREE.FrontSide}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
};

interface FrontCoverProps {
  isOpened: boolean;
  onOpenComplete: () => void;
}

const FrontCover: React.FC<FrontCoverProps> = ({
  isOpened,
  onOpenComplete,
}) => {
  const coverGroupRef = useRef<THREE.Group>(null!);
  const progressRef = useRef(0);
  const hasCompletedRef = useRef(false);

  // 表紙表面テクスチャ
  const coverTexture = useMemo(() => {
    return createPageCanvasTexture({
      title: "THE 3D BOOK",
      coverSubtitle: "Interactive Experience",
      isCover: true,
      bgColor: "#1a202c",
    });
  }, []);

  // 表紙裏面（見開き左）テクスチャ
  const coverInnerTexture = useMemo(() => {
    return createPageCanvasTexture({
      title: "はじめに",
      chapter: "PREFACE",
      content:
        "スクロールすることで、3D空間上の本がリアルにめくられていきます。",
      bgColor: "#f1f5f9",
    });
  }, []);

  useFrame((_, delta) => {
    if (!coverGroupRef.current) return;

    if (!isOpened) {
      // 背表紙を軸にして閉じた状態(0度)から左側(-180度)へ開くアニメーション
      progressRef.current = Math.min(1, progressRef.current + delta * 1.0);
      const targetRotationY = -progressRef.current * Math.PI;
      coverGroupRef.current.rotation.y = targetRotationY;
      coverGroupRef.current.position.z =
        0.03 + Math.sin(progressRef.current * Math.PI) * 0.15;

      if (progressRef.current >= 0.98 && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onOpenComplete();
      }
    } else {
      coverGroupRef.current.rotation.y = -Math.PI;
      coverGroupRef.current.position.z = 0.005;
    }
  });

  return (
    <group ref={coverGroupRef} position={[0, 0, 0.03]}>
      <mesh position={[0.82, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.64, 2.36, 0.02]} />
        <meshStandardMaterial
          map={coverTexture}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      {/* 表紙の裏側（180度めくったときの左側） */}
      <mesh position={[0.82, 0, -0.011]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.62, 2.34]} />
        <meshStandardMaterial map={coverInnerTexture} roughness={0.4} />
      </mesh>
    </group>
  );
};

const BookBase = () => {
  return (
    <group position={[0, 0, -0.01]}>
      {/* 左裏表紙ベース */}
      <mesh position={[-0.82, 0, 0]} receiveShadow>
        <boxGeometry args={[1.64, 2.36, 0.02]} />
        <meshStandardMaterial color="#2d3748" roughness={0.4} />
      </mesh>
      {/* 右裏表紙ベース */}
      <mesh position={[0.82, 0, -0.01]} receiveShadow>
        <boxGeometry args={[1.64, 2.36, 0.02]} />
        <meshStandardMaterial color="#2d3748" roughness={0.4} />
      </mesh>
      {/* 背表紙 */}
      <mesh position={[0, 0, -0.005]}>
        <boxGeometry args={[0.08, 2.36, 0.03]} />
        <meshStandardMaterial color="#1a202c" roughness={0.3} />
      </mesh>
    </group>
  );
};

interface BookSceneProps {
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookScene: React.FC<BookSceneProps> = ({ isOpened, setIsOpened }) => {
  const pagesData = [
    {
      chapter: "Chapter I",
      title: "はじまりの物語",
      content:
        "Web 3Dの世界へようこそ。Three.jsとReact Three Fiberを組み合わせることで、紙の本のような質感と没入感のある表現を実現できます。",
    },
    {
      chapter: "Chapter II",
      title: "インタラクティブ設計",
      content:
        "スクロール操作と3Dオブジェクトの回転角を連動させることで、ユーザーの直感的な操作に完璧に同期した表現が可能になります。",
    },
    {
      chapter: "Chapter III",
      title: "リアルな質感と陰影",
      content:
        "ライティングやシャドウ、テクスチャの質感を細かく調整することで、デジタルでありながら触れられそうなぬくもりを演出します。",
    },
    {
      chapter: "Chapter IV",
      title: "無限の可能性",
      content:
        "この技術を応用すれば、オンラインポートフォリオやデジタル図鑑、インタラクティブ絵本など、表現の可能性が大きく広がります。",
    },
  ];

  return (
    <group rotation={[Math.PI / 8, 0, 0]} position={[0, -0.2, 0]}>
      <BookBase />

      {pagesData.map((data, index) => (
        <PageMesh
          key={index}
          number={index}
          totalPages={pagesData.length}
          chapter={data.chapter}
          title={data.title}
          content={data.content}
          isOpened={isOpened}
        />
      ))}

      <FrontCover
        isOpened={isOpened}
        onOpenComplete={() => setIsOpened(true)}
      />
    </group>
  );
};

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
        camera={{ position: [0, 2.8, 4.5], fov: 32 }}
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
          <BookScene isOpened={isOpened} setIsOpened={setIsOpened} />
        </ScrollControls>

        <ContactShadows
          position={[0, -0.22, 0]}
          opacity={0.6}
          scale={10}
          blur={1.5}
          far={4}
        />
      </Canvas>
    </div>
  );
}
