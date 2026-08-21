import * as THREE from "three";
import { useEffect } from "react";
import { useThree, type Camera } from "@react-three/fiber";

function isPerspectiveCamera(
  camera: Camera,
): camera is THREE.PerspectiveCamera {
  return camera instanceof THREE.PerspectiveCamera;
}

export function useResponsiveCamera(
  bookWidth = 5.0,
  bookHeight = 3.5,
  margin = 1.2,
) {
  const { camera, size, invalidate } = useThree();

  useEffect(() => {
    if (!isPerspectiveCamera(camera)) return;

    // アスペクト比とFOVから最適なZ距離を計算
    const aspect = size.width / size.height;

    // convert deg to rad
    const fovInRad = (camera.fov * Math.PI) / 180;

    // fov / 2をシータの直角三角形とし、タンジェントで底辺(本が見きれないカメラのZ距離)を求める
    const theta = fovInRad / 2;

    // opposite of right triangle (直角三角形の対辺)
    // 本の横幅を対辺とする直角三角形と、本の高さを対辺とする直角三角形の2つの対辺を用意する
    const oppositeHeight = bookHeight / 2;
    const oppositeWidth = bookWidth / 2;

    // Math.tan()で底辺1のときの対辺が求まるため、対辺がoppositeの場合の底辺を求める
    const distForHeight = oppositeHeight / Math.tan(theta);
    const distForWidth = oppositeWidth / (Math.tan(theta) * aspect);

    // 縦・横で見切れない方の距離を採用
    const targetZ = Math.max(distForHeight, distForWidth) * margin;

    // カメラ位置を直接更新（Reactの再レンダリングなしで高速）
    camera.position.setZ(targetZ);
    camera.updateProjectionMatrix();

    invalidate();
  }, [size, camera, bookWidth, bookHeight, margin, invalidate]);
}
