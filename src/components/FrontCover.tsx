import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { createPageCanvasTexture } from "../utiles/createPageCanvasTexture";
import { updatePageTurn } from "../utiles/updatePageTurn";

export const FrontCover = () => {
  const scroll = useScroll();
  const coverGroupRef = useRef<THREE.Group>(null!);

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

  const pageNumber = 0;
  const totalPages = 6;

  useFrame((_, delta) => {
    if (!coverGroupRef.current) return;

    // スクロール位置
    const scrollOffset = scroll.offset;

    const { targetRotationY, targetPositionZ } = updatePageTurn({
      scrollOffset,
      totalPages,
      pageNumber,
    });

    // ページの回転を設定
    coverGroupRef.current.rotation.y = THREE.MathUtils.damp(
      coverGroupRef.current.rotation.y,
      targetRotationY,
      12,
      delta,
    );

    // 重なり順と浮き上がり（アーチ効果）
    coverGroupRef.current.position.z = THREE.MathUtils.damp(
      coverGroupRef.current.position.z,
      targetPositionZ,
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
