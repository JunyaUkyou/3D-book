import { type PageType, PAGE_TYPE } from "../const/pagesData";

export const isCoverPage = (pageType?: PageType) =>
  pageType === PAGE_TYPE.frontCover || pageType === PAGE_TYPE.backCover;
