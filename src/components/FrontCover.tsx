import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { createPageCanvasTexture } from "../utiles/createPageCanvasTexture";

interface FrontCoverProps {
  isOpened: boolean;
  onOpenComplete: () => void;
}

// const DURATION_SEC = 2.0;

export const FrontCover: React.FC<FrontCoverProps> = ({
  isOpened,
  onOpenComplete,
}) => {
  const scroll = useScroll();
  const coverGroupRef = useRef<THREE.Group>(null!);
  const progressRef = useRef(0);
  const hasCompletedRef = useRef(false);

  // 1秒あたりの進捗スピードを出す
  // const speed = 1.0 / DURATION_SEC;

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
      pageNumber: 1,
    });
  }, []);

  // useFrame((_, delta) => {
  //   if (!coverGroupRef.current) return;

  //   if (!isOpened) {
  //     // 背表紙を軸にして閉じた状態(0度)から左側(-180度)へ開くアニメーション
  //     progressRef.current = Math.min(1, progressRef.current + delta * speed);
  //     const targetRotationY = -progressRef.current * Math.PI;
  //     coverGroupRef.current.rotation.y = targetRotationY;
  //     coverGroupRef.current.position.z =
  //       0.03 + Math.sin(progressRef.current * Math.PI) * 0.15;

  //     if (progressRef.current >= 0.98 && !hasCompletedRef.current) {
  //       hasCompletedRef.current = true;
  //       onOpenComplete();
  //     }
  //   } else {
  //     coverGroupRef.current.rotation.y = -Math.PI;
  //     coverGroupRef.current.position.z = 0.005;
  //   }
  // });

  const pageNumber = 0;
  const totalPages = 6;
  useFrame((_, delta) => {
    if (!coverGroupRef.current) return;

    // スクロール位置
    const scrollOffset = scroll.offset;
    // 1ページあたりの幅
    const pageStep = 1 / totalPages;
    // 1ページごとのスタート位置
    const pageStart = pageNumber * pageStep;
    // ページ内の進んだ距離
    const pageOffset = scrollOffset - pageStart;

    // ページ内のスクロール移動進捗率(0~1)を取得
    // まだ自分のスクロールに入っていなければ0
    // 自分の領域をこえたら1
    const progress = Math.max(0, Math.min(1, pageOffset / pageStep));
    // if (progress !== 0) {
    //   console.log({ progress });
    // }
    // 0度（右）から -180度（左）へ回転
    const targetRotationY = -progress * Math.PI;
    coverGroupRef.current.rotation.y = THREE.MathUtils.damp(
      coverGroupRef.current.rotation.y,
      targetRotationY,
      12,
      delta,
    );

    // // 重なり順と浮き上がり（アーチ効果）
    const isFlipped = progress > 0.5;
    const baseZ = isFlipped
      ? 0.01 + pageNumber * 0.006
      : (totalPages - pageNumber) * 0.006;
    const arcLift = Math.sin(progress * Math.PI) * 0.15;

    coverGroupRef.current.position.z = THREE.MathUtils.damp(
      coverGroupRef.current.position.z,
      baseZ + arcLift,
      12,
      delta,
    );
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
