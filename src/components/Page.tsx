import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { createPageCanvasTexture } from "../utiles/createPageCanvasTexture";

interface PagehProps {
  number: number;
  totalPages: number;
  title: string;
  chapter: string;
  content: string;
  isOpened: boolean;
}

export const Page: React.FC<PagehProps> = ({
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
