// usePageTextures.ts
import { useEffect, useMemo } from "react";
import { createPageCanvasTexture } from "../utilities/createPageCanvasTexture";
import { type PageData } from "../const/pagesData";

export const usePageTextures = (
  pageNumber: number,
  frontPage?: PageData,
  backPage?: PageData,
) => {
  const frontTexture = useMemo(() => {
    if (!frontPage) return undefined;
    return createPageCanvasTexture({
      pagedata: frontPage,
      pageNumber: pageNumber * 2,
    });
  }, [frontPage, pageNumber]);

  const backTexture = useMemo(() => {
    if (!backPage) return undefined;
    return createPageCanvasTexture({
      pagedata: backPage,
      pageNumber: pageNumber * 2 + 1,
    });
  }, [backPage, pageNumber]);

  // テクスチャが変更された際・アンマウント時に古いテクスチャを破棄
  useEffect(() => {
    return () => {
      frontTexture?.dispose();
    };
  }, [frontTexture]);

  useEffect(() => {
    return () => {
      backTexture?.dispose();
    };
  }, [backTexture]);

  return { front: frontTexture, back: backTexture };
};
