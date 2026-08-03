import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  OrthographicCamera,
  RenderTexture,
  Text,
  useScroll,
} from "@react-three/drei";

// 1ページ分のコンポーネント
type PageProps = {
  number: number;
  text: string;
  color: string;
  totalPages?: number;
  isOpened: boolean;
};
export function Page({
  number,
  text,
  color = "white",
  totalPages = 4,
}: PageProps) {
  const ref = useRef<THREE.Group>(null!);
  const scroll = useScroll();

  useFrame(() => {
    // scroll.offset は 0.0 (最上部) 〜 1.0 (最下部)
    // 各ページがめくられるタイミング（セクション）を計算
    const pageProgress = scroll.offset * totalPages;

    // このページがめくられる進捗 (0.0 〜 1.0) を計算
    // 例: page 0 は progress 0~1、page 1 は progress 1~2
    const currentProgress = Math.max(0, Math.min(1, pageProgress - number));

    // 0 から Math.PI (180度) までめくる
    // 閉じている状態 (-Math.PI/2) から 反対側 (Math.PI/2) へ回転
    const targetRotation = -Math.PI / 2 + currentProgress * Math.PI;

    // スムーズに回転（Lerp）
    ref.current.rotation.z = THREE.MathUtils.lerp(
      ref.current.rotation.z,
      targetRotation,
      0.1,
    );
  });

  return (
    // 重なり順（z-index）を微調整して、めくったページが上に重ねられるようにする
    <group ref={ref} position={[0, 0, number * 0.002]}>
      <mesh
        castShadow
        receiveShadow
        position={[-0.5, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial side={THREE.DoubleSide}>
          <RenderTexture attach="map">
            <color attach="background" args={[color]} />
            <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={100} />
            <Text color="black" fontSize={0.2}>
              {text}
            </Text>
          </RenderTexture>
        </meshStandardMaterial>
      </mesh>
    </group>
  );
}
