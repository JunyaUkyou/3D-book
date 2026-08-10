import * as THREE from "three";
import { PAGE_CONFIG } from "../const/pageConfig";
import { type PageType } from "../const/pagesData";
import { isCoverPage } from "../utilities/isCover";

interface Props {
  pageType?: PageType;
  texture: THREE.CanvasTexture<HTMLCanvasElement> | undefined;
  position: [number, number, number];
  rotation?: [number, number, number];
}

export const PageFace = ({
  pageType,
  texture,
  position,
  rotation = [0, 0, 0],
}: Props) => {
  const isCover = isCoverPage(pageType);

  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      {isCover ? (
        <boxGeometry args={PAGE_CONFIG.cover.args} />
      ) : (
        <planeGeometry args={PAGE_CONFIG.inner.args} />
      )}

      <meshStandardMaterial
        map={texture}
        side={THREE.FrontSide}
        roughness={PAGE_CONFIG.roughness}
      />
    </mesh>
  );
};
