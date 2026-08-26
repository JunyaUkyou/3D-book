import { type PageData } from "../const/pagesData";
import { PAGE_CONFIG } from "../const/pageConfig";
import { PageFace } from "./PageFace";
import { useScrollPageTurn } from "../hooks/useScrollPageTurn";
import { usePageTextures } from "../hooks/usePageTextures";

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
  // スクロール時にページめくりが動作するRefオブジェクトを取得
  const pageTurnRef = useScrollPageTurn({ totalPages, pageNumber });

  // テクスチャを取得
  const texture = usePageTextures(pageNumber, frontPage, backPage);

  // 後ろのページほど奥に配置する
  const initPositionZ = (totalPages - pageNumber) * PAGE_CONFIG.stackOffsetZ;

  return (
    <group ref={pageTurnRef} position={[0, 0, initPositionZ]}>
      {/* 表面 */}
      <PageFace
        pageType={frontPage?.pageType}
        texture={texture.front}
        position={[0.8, 0, 0]}
      />

      {/* 裏面 */}
      <PageFace
        pageType={backPage?.pageType}
        texture={texture.back}
        position={[0.8, 0, -0.011]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
};
