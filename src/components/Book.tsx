import { Page } from "./Page";
import { FrontCover } from "./FrontCover";
import { BookBase } from "./BookBase";
import { PAGES_DATA } from "../data/pages";

export const Book = () => {
  const totalPages = PAGES_DATA.length + 1;

  return (
    <group rotation={[Math.PI / 8, 0, 0]} position={[0, -0.2, 0]}>
      <BookBase />

      <FrontCover pageNumber={0} totalPages={totalPages} />

      {PAGES_DATA.map((pageData, index) => (
        <Page
          key={index}
          pageNumber={index + 1}
          totalPages={totalPages}
          pageData={pageData}
        />
      ))}
    </group>
  );
};
