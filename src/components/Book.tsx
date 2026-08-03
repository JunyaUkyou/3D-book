import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Box } from "./Box";
import { Page } from "./Page";

type BookProps = {
  rotation: [x: number, y: number, z: number];
  isOpened: boolean;
  onOpenComplete: () => void;
};

export function Book({ onOpenComplete, isOpened, ...props }: BookProps) {
  // 表紙（右カバー）の回転用Ref
  const coverRef = useRef<THREE.Group>(null!);

  const pagesData = [
    { number: 0, text: "Cover Inside", color: "#ffffff" },
    { number: 1, text: "Page 2: Intro", color: "#f8f8f8" },
    { number: 2, text: "Page 3: Content", color: "#f0f0f0" },
    { number: 3, text: "Page 4: End", color: "#e8e8e8" },
  ];

  useFrame((_, delta) => {
    if (!isOpened) {
      // 初期状態: Math.PI (180度パタンと閉じて左にある状態)
      // 目標状態: 0 (右側に開いてフラットな状態)
      const currentRotation = coverRef.current.rotation.y;
      const targetRotation = 0;

      // なめらかに0に近づける（表紙を開く）
      coverRef.current.rotation.y = THREE.MathUtils.lerp(
        currentRotation,
        targetRotation,
        delta * 3,
      );

      // ほぼ0（開ききった状態）になったら完了通知
      if (Math.abs(coverRef.current.rotation.y) < 0.01) {
        coverRef.current.rotation.y = 0;
        onOpenComplete();
      }
    }
  });

  return (
    <group {...props}>
      {/* 1. 裏表紙（左側）: 最初からベタッと水平に置かれている */}
      <Box position={[-0.56, 0, -0.005]} scale={[1.1, 0.03, 1]} color="#333" />

      {/* 2. 背表紙（中央の繋ぎ目） */}
      <Box position={[0, -0.01, -0.005]} scale={[0.02, 0.04, 1]} color="#222" />

      {/* 3. 【重要】開く表紙（右側）のピボットグループ */}
      {/* 
        回転軸(0,0,0)を本の背（中央）に置くため、このgroupのpositionは [0,0,0] です。
        初期状態として rotation={[0, Math.PI, 0]} (180度回転＝左側に閉じた状態) にしておきます。
      */}
      <group ref={coverRef} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        {/* 軸から右へ 0.56 ずらした位置に Box を置く */}
        <Box position={[0.56, 0, 0]} scale={[1.1, 0.03, 1]} color="#333" />
      </group>

      {/* 4. 中身のページ群（裏表紙の上に配置され、表紙が閉じている間は隠れる） */}
      {pagesData.map((data) => (
        <Page
          key={data.number}
          number={data.number}
          text={data.text}
          color={data.color}
          totalPages={pagesData.length}
          isOpened={isOpened}
        />
      ))}
    </group>
  );
}
