import { Page } from "./Page";
import { Spine } from "./Spine";
import { type SpreadPage } from "../const/pagesData";
import { PAGE_CONFIG } from "../const/pageConfig";
import { useResponsiveCamera } from "../hooks/useResponsiveCamera";

interface Props {
  pages: SpreadPage[];
  totalPages: number;
}

export const Book = ({ pages, totalPages }: Props) => {
  const bookWidth = PAGE_CONFIG.cover.args[0] * 2;
  const bookHeight = PAGE_CONFIG.cover.args[1];
  useResponsiveCamera(bookWidth, bookHeight);

  return (
    <group rotation={[0, 0, 0]} position={[0, 0, 0]}>
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
