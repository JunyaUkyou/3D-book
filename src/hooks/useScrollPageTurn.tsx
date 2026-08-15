import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { updatePageTurn } from "../utilities/updatePageTurn";

interface Param {
  totalPages: number;
  pageNumber: number;
}

export function useScrollPageTurn({ totalPages, pageNumber }: Param) {
  const groupRef = useRef<THREE.Group>(null!);
  const scroll = useScroll();

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // スクロールに応じたページめくり
    const scrollOffset = scroll.offset;
    const { targetRotationX, targetRotationY, targetPositionZ } =
      updatePageTurn({
        scrollOffset,
        totalPages,
        pageNumber,
      });

    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targetRotationX,
      12,
      delta,
    );

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

  return groupRef;
}
