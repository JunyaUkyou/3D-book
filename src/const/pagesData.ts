export const PAGE_TYPE = {
  frontCover: "frontCover",
  backCover: "backCover",
  page: "page",
} as const;

export type PageType = keyof typeof PAGE_TYPE;

export type PageData = {
  title: string;
  chapter?: string;
  content?: string;
  coverSubtitle?: string;
  pageType: PageType;
};

type PageKey = "front" | "back";

export type SpreadPage = Record<PageKey, PageData>;

export const PAGES_DATA: PageData[] = [
  {
    title: "THE 3D BOOK",
    coverSubtitle: "Interactive Experience",
    pageType: PAGE_TYPE.frontCover,
  },
  {
    chapter: "PREFACE",
    title: "はじめに",
    content: "スクロールすることで、3D空間上の本がリアルにめくられていきます。",
    pageType: PAGE_TYPE.page,
  },
  {
    chapter: "Chapter I",
    title: "はじまりの物語",
    content:
      "Web 3Dの世界へようこそ。Three.jsとReact Three Fiberを組み合わせることで、紙の本のような質感と没入感のある表現を実現できます。",
    pageType: PAGE_TYPE.page,
  },
  {
    title: `はじまりの物語 (解説)`,
    chapter: "",
    content: "前のページの詳細な解説および補足資料がこちらに記載されています。",
    pageType: PAGE_TYPE.page,
  },
  {
    chapter: "Chapter II",
    title: "インタラクティブ設計",
    content:
      "スクロール操作と3Dオブジェクトの回転角を連動させることで、ユーザーの直感的な操作に完璧に同期した表現が可能になります。",
    pageType: PAGE_TYPE.page,
  },
  {
    chapter: "",
    title: "インタラクティブ設計 (解説)",
    content: "前のページの詳細な解説および補足資料がこちらに記載されています。",
    pageType: PAGE_TYPE.page,
  },
  {
    chapter: "Chapter III",
    title: "リアルな質感と陰影",
    content:
      "ライティングやシャドウ、テクスチャの質感を細かく調整することで、デジタルでありながら触れられそうなぬくもりを演出します。",
    pageType: PAGE_TYPE.page,
  },
  {
    chapter: "",
    title: "リアルな質感と陰影 (解説)",
    content: "前のページの詳細な解説および補足資料がこちらに記載されています。",
    pageType: PAGE_TYPE.page,
  },
  {
    chapter: "Chapter IV",
    title: "無限の可能性",
    content:
      "この技術を応用すれば、オンラインポートフォリオやデジタル図鑑、インタラクティブ絵本など、表現の可能性が大きく広がります。",
    pageType: PAGE_TYPE.page,
  },
  {
    chapter: "",
    title: "Chapter IV (解説)",
    content: "前のページの詳細な解説および補足資料がこちらに記載されています。",
    pageType: PAGE_TYPE.page,
  },
  {
    chapter: "",
    title: "最後のページ",
    content: "前のページの詳細な解説および補足資料がこちらに記載されています。",
    pageType: PAGE_TYPE.page,
  },
  {
    title: "aaaaaaaaaaaa",
    coverSubtitle: "aaaaaaaaa",
    pageType: PAGE_TYPE.backCover,
  },
] as const;
