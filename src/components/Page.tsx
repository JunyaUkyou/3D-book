import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { createPageCanvasTexture } from "../utiles/createPageCanvasTexture";
import { updatePageTurn } from "../utiles/updatePageTurn";

interface PagehProps {
  pageNumber: number;
  totalPages: number;
  title: string;
  chapter: string;
  content: string;
}

export const Page: React.FC<PagehProps> = ({
  pageNumber,
  totalPages,
  title,
  chapter,
  content,
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const scroll = useScroll();

  // 表面テクスチャ
  const frontTexture = useMemo(() => {
    return createPageCanvasTexture({
      title,
      chapter,
      content,
      pageNumber: pageNumber * 2,
    });
  }, [title, chapter, content, pageNumber]);

  // 裏面テクスチャ
  const backTexture = useMemo(() => {
    return createPageCanvasTexture({
      title: `${title} (解説)`,
      chapter: "",
      content:
        "前のページの詳細な解説および補足資料がこちらに記載されています。",
      pageNumber: pageNumber * 2 + 1,
      bgColor: "#edf2f7",
    });
  }, [title, pageNumber]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // スクロールに応じたページめくり
    const scrollOffset = scroll.offset;
    const { targetRotationY, targetPositionZ } = updatePageTurn({
      scrollOffset,
      totalPages,
      pageNumber,
    });

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotationY,
      12,
      delta,
    );

    // 重なり順と浮き上がり（アーチ効果）
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      targetPositionZ,
      12,
      delta,
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, (totalPages - pageNumber) * 0.006]}>
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
        position={[0.8, 0, -0.011]}
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
