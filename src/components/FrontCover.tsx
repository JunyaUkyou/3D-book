import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

import { createPageCanvasTexture } from "../utiles/createPageCanvasTexture";

interface FrontCoverProps {
  isOpened: boolean;
  onOpenComplete: () => void;
}

export const FrontCover: React.FC<FrontCoverProps> = ({
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
