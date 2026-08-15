import { Page } from "./Page";
import { Spine } from "./Spine";
import { PAGES_DATA, type PageData } from "../const/pagesData";

type PageKey = "front" | "back";

export const Book = () => {
  const pages: Record<PageKey, PageData | undefined>[] = [];
  for (let pageIndex = 0; pageIndex < PAGES_DATA.length; pageIndex += 2) {
    pages.push({
      front: PAGES_DATA[pageIndex],
      back: PAGES_DATA[pageIndex + 1],
    });
  }

  const totalPages = pages.length;
  return (
    <group rotation={[Math.PI / 8, 0, 0]} position={[0, -0.2, 0]}>
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
