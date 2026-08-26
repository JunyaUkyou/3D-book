import { useMemo } from "react";
import { PAGES_DATA, type SpreadPage } from "../const/pagesData";

export function useGetBookPage(): SpreadPage[] {
  const pages = useMemo(() => {
    const result: SpreadPage[] = [];

    for (let pageIndex = 0; pageIndex < PAGES_DATA.length; pageIndex += 2) {
      result.push({
        front: PAGES_DATA[pageIndex],
        back: PAGES_DATA[pageIndex + 1],
      });
    }

    return result;
  }, []);

  return pages;
}
