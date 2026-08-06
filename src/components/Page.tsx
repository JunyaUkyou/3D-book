import { useMemo } from "react";
import { createPageCanvasTexture } from "../utilities/createPageCanvasTexture";
import { type PageData } from "../const/pagesData";
import { PAGE_CONFIG } from "../const/pageConfig";
import { PageFace } from "./PageFace";
import { useScrollPageTurn } from "../hooks/useScrollPageTurn";

interface PageProps {
  pageNumber: number;
  totalPages: number;
  frontPage?: PageData;
  backPage?: PageData;
}

export const Page: React.FC<PageProps> = ({
  pageNumber,
  totalPages,
  frontPage,
  backPage,
}) => {
  const groupRef = useScrollPageTurn({ totalPages, pageNumber });

  // 表面テクスチャ
  const frontTexture = useMemo(() => {
    if (!frontPage) return;
    return createPageCanvasTexture({
      pagedata: frontPage,
      pageNumber: pageNumber * 2,
    });
  }, [frontPage, pageNumber]);

  // 裏面テクスチャ
  const backTexture = useMemo(() => {
    if (!backPage) return;
    return createPageCanvasTexture({
      pagedata: backPage,
      pageNumber: pageNumber * 2 + 1,
    });
  }, [backPage, pageNumber]);

  const initPositionZ = (totalPages - pageNumber) * PAGE_CONFIG.stackOffsetZ;

  return (
    <group ref={groupRef} position={[0, 0, initPositionZ]}>
      {/* 表面 */}
      <PageFace
        isCover={frontPage?.isCover}
        texture={frontTexture}
        position={[0.8, 0, 0]}
      />

      {/* 裏面 */}
      <PageFace
        isCover={backPage?.isCover}
        texture={backTexture}
        position={[0.8, 0, -0.011]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
};
