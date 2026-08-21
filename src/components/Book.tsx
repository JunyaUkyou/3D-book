import { Page } from "./Page";
import { Spine } from "./Spine";
import { PAGES_DATA, type PageData } from "../const/pagesData";
import { PAGE_CONFIG } from "../const/pageConfig";
import { useResponsiveCamera } from "../hooks/useResponsiveCamera";

type PageKey = "front" | "back";

export const Book = () => {
  const bookWidth = PAGE_CONFIG.cover.args[0] * 2;
  const bookHeight = PAGE_CONFIG.cover.args[1];
  useResponsiveCamera(bookWidth, bookHeight);

  const pages: Record<PageKey, PageData | undefined>[] = [];
  for (let pageIndex = 0; pageIndex < PAGES_DATA.length; pageIndex += 2) {
    pages.push({
      front: PAGES_DATA[pageIndex],
      back: PAGES_DATA[pageIndex + 1],
    });
  }

  const totalPages = pages.length;
  return (
    <group rotation={[0, 0, 0]} position={[0, 0, 0]}>
      {/* <group rotation={[Math.PI / 8, 0, 0]} position={[0, -0.2, 0]}> */}
      <Spine totalPages={totalPages} />

      {pages.map((pageData, index) => (
        <Page
          key={index}
          pageNumber={index}
          totalPages={totalPages}
          frontPage={pageData.front}
          backPage={pageData.back}
        />
      ))}
    </group>
  );
};
